from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
# deep learning
from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np
import argparse
import imutils
import pickle
import cv2
import os
import matplotlib.pyplot as plt
from keras.models import Model
from sklearn import preprocessing
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Profile
from .forms import ProfileForm
from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone


def home(request):
    return render(request, 'home.html')

# TODO 이미지 데이터 베이스에 부착시키기.
# 분석한 이미지를 class 의 detail에 넣어주기, radar chart 그려주기

def upload(request):
    if request.method=='POST':
        form = ProfileForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.pub_date = timezone.datetime.now()
            post.save()
            # session을 통해서 show랑 변수 공유
            # request.session['image']=request.POST.get("name")
            return redirect('/show/' + str(post.id))
    else: form=ProfileForm()
    return render(request,'upload.html',{'form':form})

def show(request,profile_id):
    # 1. id로 pic을 가져온다.
    # 2. pic을 model로 돌려준다.
    # img_target = request.session['image']
    profile_detail = get_object_or_404(Profile, pk=profile_id)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    FACE_CASCADE = cv2.CascadeClassifier(BASE_DIR+'/keras/haarcascade_frontalface_default.xml')
    
    # TODO 여기만 해주면 된다.
    image_path = settings.MEDIA_ROOT+'/'+str(profile_detail.pic)
    image_grey = cv2.imread(image_path,cv2.IMREAD_GRAYSCALE)
    # faces=FACE_CASCADE.detectMultiScale(image_grey,scaleFactor=1.16,minNeighbors=5,minSize=(25,25),flags=0)
    faces=FACE_CASCADE.detectMultiScale(image_grey,scaleFactor=1.16,minNeighbors=5,minSize=(25,25),flags=cv2.CASCADE_SCALE_IMAGE)
    
    image = []
    for x,y,w,h in faces:
        image=image_grey[y-10:y+h+10,x-10:x+w+10]
    output = image.copy()
     
    # pre-process the image for classification
    # 96 * 96
    image = cv2.resize(image, (96, 96))
    image = image.astype("float") / 255.0
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)

    model = load_model(BASE_DIR+'/keras/final.model')
    lb = pickle.loads(open(BASE_DIR+'/keras/final.pickle',"rb").read())

    layer_name='dense_2'
    intermediate_layer_model = Model(inputs=model.input,outputs=model.get_layer(layer_name).output)
    intermediate_output = intermediate_layer_model.predict(image)

    model.predict(image)

    result = []
    for i,j in zip(list(lb.classes_),list(*intermediate_output)):
        # ("rich",str(56)+'%')
        result.append((i,str(int(round(j*100)))+'%'))

    return render(request, 'show.html', {'result':result,'image_path':image_path})

# TODO 프로필 사진 변경 되기
# 회원 id에 따라서 프로필 사진 가져오고 show(분석) 해주기

def picture(request):
    profiles = Profile.objects
    return render(request,'picture.html',{'profiles':profiles})