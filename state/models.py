from django.db import models

class Profile(models.Model):
    # name = models.CharField(max_length=20,primary_key=True)
    name = models.CharField(null=True,max_length=20)
    pub_date = models.DateTimeField('date published',null=True)
    pic = models.ImageField(null=True,upload_to='profile')
    
    def __str__(self):
        return self.name
