// ======================================================
// Radar Chart
// ======================================================

// chart animation
$('#radarChart').hide();
$('#radarChart').fadeIn(650);

// Radar Chart Options
var radarOptions = {

  //Boolean - If we show the scale above the chart data
  scaleOverlay: false,

  //Boolean - If we want to override with a hard coded scale
  scaleOverride: false,

  //** Required if scaleOverride is true **
  //Number - The number of steps in a hard coded scale
  scaleSteps: null,
  //Number - The value jump in the hard coded scale
  scaleStepWidth: null,
  //Number - The centre starting value
  scaleStartValue: null,

  //Boolean - Whether to show lines for each scale point
  scaleShowLine: true,

  //String - Colour of the scale line
  scaleLineColor: "#999",

  //Number - Pixel width of the scale line
  scaleLineWidth: 0.5,

  //Boolean - Whether to show labels on the scale
  scaleShowLabels: false,

  //Interpolated JS string - can access value
  scaleLabel: "<%=value%>",

  //String - Scale label font declaration for the scale label
  scaleFontFamily: "'Arial'",

  //Number - Scale label font size in pixels : 차트 간격
  scaleFontSize: 25,

  //String - Scale label font weight style
  scaleFontStyle: "normal",

  //String - Scale label font colour
  scaleFontColor: "#666",

  //Boolean - Show a backdrop to the scale label
  scaleShowLabelBackdrop: true,

  //String - The colour of the label backdrop
  scaleBackdropColor: "rgba(255,255,255,0.75)",

  //Number - The backdrop padding above & below the label in pixels
  scaleBackdropPaddingY: 2,

  //Number - The backdrop padding to the side of the label in pixels
  scaleBackdropPaddingX: 2,

  //Boolean - Whether we show the angle lines out of the radar
  angleShowLineOut: true,

  //String - Colour of the angle line
  angleLineColor: "rgba(255,255,255,0.3)",

  //Number - Pixel width of the angle line
  angleLineWidth: 1,

  //String - Point label font declaration
  pointLabelFontFamily: "'Arial'",

  //String - Point label font weight
  pointLabelFontStyle: "normal",

  //Number - Point label font size in pixels
  pointLabelFontSize: 12,

  //String - Point label font colour
  pointLabelFontColor: "#EFEFEF",

  //Boolean - Whether to show a dot for each point
  pointDot: true,

  //Number - Radius of each point dot in pixels
  pointDotRadius: 3,

  //Number - Pixel width of point dot stroke
  pointDotStrokeWidth: 1,

  //Boolean - Whether to show a stroke for datasets
  datasetStroke: true,

  //Number - Pixel width of dataset stroke
  datasetStrokeWidth: 1,

  //Boolean - Whether to fill the dataset with a colour
  datasetFill: true,

  //Boolean - Whether to animate the chart
  animation: true,

  //Number - Number of animation steps
  animationSteps: 60,

  //String - Animation easing effect
  animationEasing: "easeOutQuart",

  //Function - Fires when the animation is complete
  onAnimationComplete: null

}

// Radar Data
var one = document.getElementById("pieChart1").value;
var two = document.getElementById("pieChart2").value;
var thr = document.getElementById("pieChart3").value;
var fou = document.getElementById("pieChart4").value;
var fiv = document.getElementById("pieChart5").value;

var radarData = {
  // 죄측부터 순서대로 지식, 배짱, 재주, 싱냥함, 매력
  labels: ["근력", "매력", "카리스마", "범죄력", "지력"],
  datasets: [value={{ result.0.1 }}
    {
      fillColor: "rgba(94, 236, 255, 0.4)",
      strokeColor: "rgba(216, 271, 255, 1)",
      data: [one, two, thr, fou, fiv]
    }
  ]
}


//Get the context of the Radar Chart canvas element we want to select
var ctx = document.getElementById("radarChart").getContext("2d");

// Create the Radar Chart
var myRadarChart = new Chart(ctx).Radar(radarData, radarOptions);




// ======================================================
// Mouse Vertex Effect
// ======================================================

(function() {

  var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

  // Main
  initHeader();
  initAnimation();
  addListeners();

  function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = {
      x: width / 2,
      y: height / 2
    };

    largeHeader = document.getElementById('large-header');
    largeHeader.style.height = height + 'px';

    canvas = document.getElementById('demo-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create points
    points = [];
    for (var x = 0; x < width; x = x + width / 20) {
      for (var y = 0; y < height; y = y + height / 20) {
        var px = x + Math.random() * width / 20;
        var py = y + Math.random() * height / 20;
        var p = {
          x: px,
          originX: px,
          y: py,
          originY: py
        };
        points.push(p);
      }
    }

    // for each point find the 5 closest points
    for (var i = 0; i < points.length; i++) {
      var closest = [];
      var p1 = points[i];
      for (var j = 0; j < points.length; j++) {
        var p2 = points[j]
        if (!(p1 == p2)) {
          var placed = false;
          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (closest[k] == undefined) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    // assign a circle to each point
    for (var i in points) {
      var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
      points[i].circle = c;
    }
  }

  // Event handling
  function addListeners() {
    if (!('ontouchstart' in window)) {
      window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
  }

  function mouseMove(e) {
    var posx = posy = 0;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
  }

  function scrollCheck() {
    if (document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
  }

  // animation
  function initAnimation() {
    animate();
    for (var i in points) {
      shiftPoint(points[i]);
    }
  }

  function animate() {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (var i in points) {
        // detect points in range
        if (Math.abs(getDistance(target, points[i])) < 4000) {
          points[i].active = 0.3;
          points[i].circle.active = 0.6;
        } else if (Math.abs(getDistance(target, points[i])) < 20000) {
          points[i].active = 0.1;
          points[i].circle.active = 0.3;
        } else if (Math.abs(getDistance(target, points[i])) < 40000) {
          points[i].active = 0.02;
          points[i].circle.active = 0.1;
        } else {
          points[i].active = 0;
          points[i].circle.active = 0;
        }

        drawLines(points[i]);
        points[i].circle.draw();
      }
    }
    requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
    TweenLite.to(p, 1 + 1 * Math.random(), {
      x: p.originX - 50 + Math.random() * 100,
      y: p.originY - 50 + Math.random() * 100,
      ease: Circ.easeInOut,
      onComplete: function() {
        shiftPoint(p);
      }
    });
  }

  // Canvas manipulation
  // 버텍스 라인 색상 지정
  function drawLines(p) {
    if (!p.active) return;
    for (var i in p.closest) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      ctx.strokeStyle = 'rgba(186,217,249,' + p.active + ')';
      ctx.stroke();
    }
  }

  function Circle(pos, rad, color) {
    var _this = this;

    // constructor
    (function() {
      _this.pos = pos || null;
      _this.radius = rad || null;
      _this.color = color || null;
    })();



    // 버텍스 색상 지정
    this.draw = function() {
      if (!_this.active) return;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(255,255,249,' + _this.active + ')';
      ctx.fill();
    };
  }

  // Util
  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }

})();


// ======================================================
//  Pie Chart
// ======================================================

! function() {
  var a = function(a, b) {
      var c = document.createElement("canvas");
      "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(c);
      var d = c.getContext("2d");
      if (c.width = c.height = b.size, a.appendChild(c), window.devicePixelRatio > 1) {
        var e = window.devicePixelRatio;
        c.style.width = c.style.height = [b.size, "px"].join(""), c.width = c.height = b.size * e, d.scale(e, e)
      }
      d.translate(b.size / 2, b.size / 2), d.rotate((-0.5 + b.rotate / 180) * Math.PI);
      var f = (b.size - b.lineWidth) / 2;
      b.scaleColor && b.scaleLength && (f -= b.scaleLength + 2);
      var g = function(a, b, c) {
          c = Math.min(Math.max(0, c || 1), 1), d.beginPath(), d.arc(0, 0, f, 0, 2 * Math.PI * c, !1), d.strokeStyle = a, d.lineWidth = b, d.stroke()
        },
        h = function() {
          var a, c, e = 24;
          d.lineWidth = 1, d.fillStyle = b.scaleColor, d.save();
          for (var e = 24; e >= 0; --e) 0 === e % 6 ? (c = b.scaleLength, a = 0) : (c = .6 * b.scaleLength, a = b.scaleLength - c), d.fillRect(-b.size / 2 + a, 0, c, 1), d.rotate(Math.PI / 12);
          d.restore()
        };
      Date.now = Date.now || function() {
        return +new Date
      };
      var i = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(a) {
          window.setTimeout(a, 1e3 / 60)
        }
      }();
      this.clear = function() {
        d.clearRect(b.size / -2, b.size / -2, b.size, b.size)
      }, this.draw = function(a) {
        this.clear(), b.scaleColor && h(), b.trackColor && g(b.trackColor, b.lineWidth), d.lineCap = b.lineCap;
        var c;
        c = "function" == typeof b.barColor ? b.barColor(a) : b.barColor, a > 0 && g(c, b.lineWidth, a / 100)
      }.bind(this), this.animate = function(a, c) {
        var d = Date.now();
        b.onStart(a, c);
        var e = function() {
          var f = Math.min(Date.now() - d, b.animate),
            g = b.easing(this, f, a, c - a, b.animate);
          this.draw(g), b.onStep(a, c, g), f >= b.animate ? b.onStop(a, c) : i(e)
        }.bind(this);
        i(e)
      }.bind(this)
    },
    b = function(b, c) {
      var d, e = {
          barColor: "#ef1e25",
          trackColor: "#f9f9f9",
          scaleColor: "#dfe0e0",
          scaleLength: 5,
          lineCap: "round",
          lineWidth: 3,
          size: 110,
          rotate: 0,
          animate: 1e3,
          renderer: a,
          easing: function(a, b, c, d, e) {
            return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
          },
          onStart: function() {},
          onStep: function() {},
          onStop: function() {}
        },
        f = {},
        g = 0,
        h = function() {
          this.el = b, this.options = f;
          for (var a in e) e.hasOwnProperty(a) && (f[a] = c && "undefined" != typeof c[a] ? c[a] : e[a], "function" == typeof f[a] && (f[a] = f[a].bind(this)));
          f.easing = "string" == typeof f.easing && "undefined" != typeof jQuery && jQuery.isFunction(jQuery.easing[f.easing]) ? jQuery.easing[f.easing] : e.easing, d = new f.renderer(b, f), d.draw(g), b.dataset && b.dataset.percent && this.update(parseInt(b.dataset.percent, 10))
        }.bind(this);
      this.update = function(a) {
        return a = parseInt(a, 10), f.animate ? d.animate(g, a) : d.draw(a), g = a, this
      }.bind(this), h()
    };
  window.EasyPieChart = b
}();

var options = {
  scaleColor: false,
  trackColor: 'rgba(255,255,255,0.3)',
  // default barColor: '#E7F7F5',
  barColor: '#E7F7F5',
  lineWidth: 2,
  lineCap: 'butt',
  size: 95
};

window.addEventListener('DOMContentLoaded', function() {
  var charts = [];
  [].forEach.call(document.querySelectorAll('.chart'), function(el) {
    charts.push(new EasyPieChart(el, options));
  });
});

var elem = document.getElementById('radarChart');
var elem = document.getElementById('pieChart');



// chart animation
$('#pieChart1').hide();
$('#pieChart1').delay(600).fadeIn(1000);
$('#pieChart2').hide();
$('#pieChart2').delay(300).fadeIn(1000);
$('#pieChart3').hide();
$('#pieChart3').delay(100).fadeIn(1000);
$('#pieChart4').hide();
$('#pieChart4').delay(300).fadeIn(1000);
$('#pieChart5').hide();
$('#pieChart5').delay(600).fadeIn(1000);