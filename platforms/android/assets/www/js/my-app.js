var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

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
    template7Pages: true	
});


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

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

/**
 *	photoCap function, called when Take Photo clicked
 */
function photoCap() {
	alert("Taking Photo");
	if (butid = document.getElementById('saveButt')) 
		butid.parentNode.removeChild(butid);
	if(navigator.camera) {
		var canid  = document.getElementById('can_id');
		navigator.camera.getPicture(function(imageData){
			var canvas = document.getElementById('canvas');
//			style="width:auto;height:500px;"
			canvas.style.width = "auto";
//			canvas.style.height = "500px";
			canvas.style.height = "auto";
			var ctx = canvas.getContext('2d');
			var image = new Image();
			image.src = "data:image/jpeg;base64," + imageData;
//			image.src = imageData;
			image.onload = function(e) {
				ctx.drawImage(image,0,0, image.width, image.height,
									0,0, canvas.width, canvas.height);
				ctx.lineWidth=3;
				ctx.fillStyle="yellow";
//				ctx.lineStyle="#ffff00";
				ctx.font="5px sans-serif";
//				var text = "Lat=" + currentLatitude ;
				ctx.strokeStyle = 'black';
//				ctx.strokeText(text,10,10);
//				ctx.fillText(text,10,10);
//				text = "Lon=" + currentLongitude;
//				ctx.strokeText(text,10,20);
//				ctx.fillText(text,10,20);
//				text = new Date() ;
//				ctx.strokeText(text,10,30);
//				ctx.fillText(text,10,30);
				var btn = document.createElement("button");
				btn.innerHTML = "Save Photo";
				btn.setAttribute("id", "saveButt");
				btn.className="blue_sub";
				btn.onclick = savePhoto;
				canid.appendChild(btn);
			}
//			console.log(imageData);
		}, null, {sourceType:Camera.PictureSourceType.CAMERA, quality: 50, 
//				targetWidth: 1500, targetHeight: 2048,
				correctOrientation: true,
				encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.DATA_URL});
	} else {
		alert("Camera not supported on this device.");
	}
}

/**
 *	savePhoto function, called when photo save button clicked
 */
function savePhoto()
{
	window.canvas2ImagePlugin.saveImageDataToLibrary(
        function(msg){
			alert("Saving Photo");
            console.log(msg);
			var canvas = document.getElementById('canvas');
//			style="width:auto;height:500px;"
			canvas.style.width = "auto";
			canvas.style.height = "0px";
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			var butid = document.getElementById('saveButt');
			butid.parentNode.removeChild(butid);
        },
        function(err){
            console.log(err);
        },
        document.getElementById('canvas')
    );
}
