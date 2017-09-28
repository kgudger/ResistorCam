var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
var cwidth = window.innerWidth;
var cheight = window.innerHeight;


Template7.global = {
    android: isAndroid,
    ios: isIos
};

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var returnedText ="";

if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}

// Initialize app
var myApp = new Framework7({
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true,	
    init: false
});

myApp.onPageInit('index', function (page) {
	console.log("In index Page");
    // Do something here for "about" page
	make_base();
});

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

//And now we initialize app
myApp.init();

// Handle Cordova Device Ready Event
document.addEventListener("deviceready", /*
$$(document).on('deviceready',*/ function() {
    console.log("Device is ready!");
/*    canvasMain = document.getElementById("canvas");
    CanvasCamera.initialize(canvasMain);
    // define options
    var opt = {
                quality: 75,
                destinationType: CanvasCamera.DestinationType.FILE_URI,
                encodingType: CanvasCamera.EncodingType.JPEG,
                //saveToPhotoAlbum:true,
                sourceType:Camera.PictureSourceType.CAMERA,
                correctOrientation:true,
                width:640,
                height:960
              };
    CanvasCamera.start(opt);*/
	if ( typeof CameraPreview != "undefined" ) {
		CameraPreview.startCamera({toBack: true, 
			previewDrag: true, tapPhoto: true,
			width: cwidth,
			height: cheight,
			camera: CameraPreview.CAMERA_DIRECTION.BACK});
		var location_timeout = setTimeout("startFlash()", 2000);
	} else {
		alert("Camera not supported on this device.");
	}
});

/** 
 *	Delayed start camera flash
 */
function startFlash() {
	console.log('In startFlash');
	CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.TORCH);
}

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
	console.log("In About Page");
    // Do something here for "about" page

});
/*
// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})
*/
/**
 *	photoCap function, called when Take Photo clicked
 */
function photoCap() {
//	alert("Taking Photo");
	if(navigator.camera) {
/*		window.plugins.flashlight.available(function(isAvailable) {
			if (isAvailable) {
		// switch on
			window.plugins.flashlight.switchOn(
			null, // optional success callback
			null // optional error callback
//			{intensity: 0.3} // optional as well
			)}});*/

		var canid  = document.getElementById('can_id');
		navigator.camera.getPicture(function(imageURI){
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');
			var image = new Image();
			image.src = imageURI;
//			image.src = "data:image/jpeg;base64," + imageData;
//			image.src = imageData;	ctx.rect(cwidth*3/8, cheight/3, cwidth/4, cheight/3);
			var cx = canvas.width / 2;
			var cy = canvas.height / 3;
			var imgData = ctx.getImageData(cx, cy, 1, cy);
			var pdata = imgData.data;
			image.onload = function(e) {
				ctx.drawImage(image,0,0, image.width, image.height,
									0,0, canvas.width, canvas.height);
/*				window.plugins.flashlight.available(function(isAvailable) {
					if (isAvailable) 
					      window.plugins.flashlight.switchOff(); // success/error callbacks may be passed
				});*/
				var jdata = JSON.stringify(pdata);
				var queryString = "command=send&data=" + jdata;
				sendfunc(queryString)

			}
			console.log(pdata);
		}, null, {sourceType:Camera.PictureSourceType.CAMERA, quality: 50, 
//				targetWidth: 1500, targetHeight: 2048,
				correctOrientation: true,
				encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.FILE_URI});
	} else {
		alert("Camera not supported on this device.");
	}
}
function photoCap2() {
//	alert("Taking Photo");
	if ( typeof CameraPreview != "undefined" ) {
		CameraPreview.getMaxZoom(function(maxZoom){
			console.log(maxZoom);
		});
		CameraPreview.setZoom(2);
	CameraPreview.takePicture(function(imgData){
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');
			var image = new Image();
			image.src = 'data:image/jpeg;base64,' + imgData;
//      document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
			image.onload = function(e) {
				ctx.drawImage(image,0,0, image.width, image.height,
									0,0, canvas.width, canvas.height);
/*				window.plugins.flashlight.available(function(isAvailable) {
					if (isAvailable) 
					      window.plugins.flashlight.switchOff(); // success/error callbacks may be passed
				});*/
				var cx = canvas.width / 2;
				var cy = canvas.height / 3;
				var cym = canvas.height / 2;
				var imgData = ctx.getImageData(cx, cy, 1, cy);
				var pdata = imgData.data;
				var nPixLen = pdata.length;
				tPixes = nPixLen / (48) // how many bunches to scale down to
				var Red   = new Array();
				var Green = new Array();
				var Blue  = new Array();
//				var xtion = new Array();
				var jdata = new Array();
				var k = 0 ;
				var j = 0 ;
				var change = false;
				for ( var i = 0; i < nPixLen ; i+=Math.floor(tPixes) ) { // 3 less than total
					Red[j] = pdata[i];
					Green[j] = pdata[i+1];
					Blue[j] = pdata[i+2] ;
					console.log("i is " + i + " j is " + j + " Red[j] is " + Red[j]);
					j++ ;
/*					var delta = Math.abs(pdata[i]   - pdata[i+12]) +
								Math.abs(pdata[i+1] - pdata[i+13]) +
								Math.abs(pdata[i+2] - pdata[i+14]) ;
					if ( delta > 40 ) {
						if ( change == false ) {
							change = true ;
							xtion[k++] = j ;
						}
					} else {
						change = false ;
					} */
				}
				jdata[0] = Red ;
				jdata[1] = Green;
				jdata[2] = Blue;
/*				var stt = 0 ; // beginning of pixels
				for ( var i = 0; i < xtion.length; i++ ) {
					var midpt = Math.round((xtion[i] - stt) / 2) + stt ; // midpoint of each color
					Red[i] = pdata[midpt*4];
					Green[i] = pdata[midpt*4+1];
					Blue[i] = pdata[midpt*4+2] ;
					stt = xtion[i] ; // next transition point
				}
				var midpt = Math.round((nPixLen / 4 - stt) / 2) + stt ; // midpoint of last color
				Red[i] = pdata[midpt*4];
				Green[i] = pdata[midpt*4+1];
				Blue[i] = pdata[midpt*4+2] ;
*/
				ctx.strokeStyle="#FFFF00";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				ctx.lineTo(cx, cy*2);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(cx-10, cym);
				ctx.lineTo(cx+10, cym);
				ctx.stroke();
				console.log(JSON.stringify(Red));
				console.log(JSON.stringify(Green));
				console.log(JSON.stringify(Blue));
/*				console.log(JSON.stringify(xtion));
				var midpt   = Math.round(Red.length / 2) ; 
				var diff    = new Array();*/
/*				for ( var i = 0; i < Red.length ; i++ ) {
					diff[i] = Math.abs(Red[midpt]-Red[i]) +
						Math.abs(Green[midpt]-Green[i]) +
						Math.abs(Blue[midpt]-Blue[i]) ;
				}*/
				var jdata2 = JSON.stringify(jdata) ;
				var queryString = "command=send&data=" + jdata2;
				console.log(jdata);
				sendfunc(queryString)
				document.getElementById("cambut").setAttribute( "onClick", "javascript: make_base();");
			}
		});
	} else {
		alert("Camera not supported on this device.");
	}
}

/**
 *	make_base function initializes the canvas to the image and size.
 */
function make_base()
{
	var canid  = document.getElementById('can_id');
	var canvas = document.getElementById('canvas');
	cwidth = canvas.width = window.innerWidth;
	cheight = canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle="#FFFF00";
	ctx.beginPath();
	ctx.rect(cwidth*3/8, cheight/3, cwidth/4, cheight/3);
	ctx.stroke();
	ctx.beginPath();
    ctx.moveTo(cwidth/2, cheight/3);
    ctx.lineTo(cwidth/2, cheight*2/3);
    ctx.lineWidth = 2;
	ctx.stroke();
	ctx.beginPath();
    ctx.moveTo(cwidth/2-10, cheight/2);
    ctx.lineTo(cwidth/2+10, cheight/2);
	ctx.stroke();
	document.getElementById("cambut").setAttribute( "onClick", "javascript: photoCap2();");
//	ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
/*
	var image = new Image();
	if ( isIos ) 
		image.src = "images/ResistorI.png";
	else
		image.src = "images/ResistorA.png";
	image.onload = function(e) {
		ctx.drawImage(image,0,0, image.width, image.height,
									0,0, canvas.width, canvas.height);
	}*/
}

/**
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param params is GET request string
 */
function sendfunc(params) {
    var xmlhttp;
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        console.log(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
          {
            returnedList = (xmlhttp.responseText);
            console.log("Returned value is " + returnedList);
            returnedText = returnedList;
			confirm("Thank you for your data submission!");
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');
			ctx.lineWidth=3;
			ctx.fillStyle="yellow";
			ctx.font="15px sans-serif";
			console.log("text is " + returnedText);
			ctx.strokeStyle = 'black';
			ctx.strokeText(returnedText,50,100);
			ctx.fillText(returnedText,50,100);
		  }
	} // http://home.loosescre.ws/~keith/ResistorCam/server.php/?command=send&data=%22test%22
	  // http://home.loosescre.ws/~keith/ResistorCam/server.php?command=send&data=photo 
	xmlhttp.open("GET","http://home.loosescre.ws/~keith/ResistorCam/server.php" + '?' + params, true);
	xmlhttp.send(null);
    }
}; // sendfunc

function findNewY(bitmap, direction) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var ix = image.width;
	var iy = image.height;
	var imageData = ctx.getImageData(ix/4, iy/4, ix*3/4, iy*3/4);
	var data = imageData.data;

  var xmax = bitmap.getWidth();
  var ymax = bitmap.getHeight();
  var diff = false ;
  var color = bitmap.getPixel(xmax/=2,ymax/=2);
  var red   = Color.red(color) ;
  var green = Color.green(color) ;
  var blue  = Color.blue(color) ;
  for ( var i = ymax; (i > 1) && (diff == false) ; --i )
  {
	var newcolor = bitmap.getPixel(xmax,ymax+=direction);
	var rednew   = Color.red(newcolor) ;
   	var greennew = Color.green(newcolor) ;
   	var bluenew  = Color.blue(newcolor)  ;
   	var absolute = Math.abs(red - rednew) + 
   		  		 Math.abs(green - greennew) + 
   		  		 Math.abs(blue - bluenew) ;
   	if ( absolute > 25 )  // having trouble here finding color change
   	  diff = true ;
   	else {
   	  red = rednew ;
   	  blue = bluenew;
   	  green = greennew;
   	}
  }
  return ymax ;
}

/* Canvas draw line
 * @param ctx is canvas context
 * @param x is starting x
 * @param y is starting y
 * @param xe is ending x
 * @param ye is ending y
 */
function cdraw_line(ctx, x,y,xe,ye) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(xe, ye);
	ctx.stroke();
}
