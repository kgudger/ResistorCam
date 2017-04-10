var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

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
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

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
//			style="width:auto;height:500px;"
//			canvas.style.width = "auto";
//			canvas.style.height = "500px";
//			canvas.style.height = "auto";
			var ctx = canvas.getContext('2d');
			var image = new Image();
			image.src = imageURI;
//			image.src = "data:image/jpeg;base64," + imageData;
//			image.src = imageData;
			image.onload = function(e) {
				ctx.drawImage(image,0,0, image.width, image.height,
									0,0, canvas.width, canvas.height);
/*				window.plugins.flashlight.available(function(isAvailable) {
					if (isAvailable) 
					      window.plugins.flashlight.switchOff(); // success/error callbacks may be passed
				});*/
				var queryString = "command=send&data=photo";
				sendfunc(queryString)

			}
//			console.log(imageData);
		}, null, {sourceType:Camera.PictureSourceType.CAMERA, quality: 50, 
//				targetWidth: 1500, targetHeight: 2048,
				correctOrientation: true,
				encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.FILE_URI});
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
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');
	var image = new Image();
	if ( isIos ) 
		image.src = "images/ResistorI.png";
	else
		image.src = "images/ResistorA.png";
	image.onload = function(e) {
		ctx.drawImage(image,0,0, image.width, image.height,
									0,0, canvas.width, canvas.height);
	}
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
			ctx.strokeText(returnedText,500,100);
			ctx.fillText(returnedText,50,100);
		  }
	} // http://home.loosescre.ws/~keith/ResistorCam/server.php/?command=send&data=%22test%22
	  // http://home.loosescre.ws/~keith/ResistorCam/server.php?command=send&data=photo 
	xmlhttp.open("GET","http://home.loosescre.ws/~keith/ResistorCam/server.php" + '?' + params, true);
	xmlhttp.send(null);
    }
}; // sendfunc

