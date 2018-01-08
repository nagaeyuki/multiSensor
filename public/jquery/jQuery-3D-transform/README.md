# 2D & 3D Transformations and Animations
This library uses native CSS3 transformations in supported browsers.

## Supported Browsers for 3D animations
    	* Chrome 12+
    	* Firefox 10+
    	* Internet Explorer 10+
    	* Safari 4+
    	* Android Browser 3+
    	* iOs Safari 3.2

## Supported Browsers for 2D animations
    	* Chrome
    	* FireFox 3.5+
    	* Safari 3.1+
    	* Opera 10.5+
    	* Internet Explorer 9+

## Usage
	// Rotate 30 Degrees
	$('#example').transform({rotate: '30deg'});
	
	// Use CSS Hooks to Rotate
	$('#example').css({rotate: '30deg'});
	
	// Animate the rotation
	$('#example').animate({rotate: '30deg'});
	
	// For 3D transformations & animations :
	// Don't forget to set perspective to the container (Css : perspective)
	// (Check out the demo)
	// Ex : -webkit-perspective:800px;
	
	// Animate in 3D or 2D.
    	// Overrides jQuery .animate() method http://api.jquery.com/animate/
	$('#example').animate({
		rotateX: '45deg', //rotates 45 degrees on the X axis
		rotateY: '45deg', //rotates 45 degrees on the Y axis
		rotateZ: '45deg', //rotates 45 degrees on the Z axis
		translateX: 20px', //moves the transformation 20px on the X axis
		translateY: '20px', //moves the transformation 20px on the Y axis
		translateZ: '20px', //moves the transformation 20px on the Z axis
		translate3d: ['20px', '20px', '20px'], //moves the transformation 20px on the x, y and z axis
		scaleX: 1.5, //scales by 1.5 on the X axis
		scaleY: 1.5, //scales by 1.5 on the Y axis
		scaleZ: 1.5, //scales by 1.5 on the Z axis        
		scale3d: [1.5, 1.5, 1.5], //scales by 1.5 on the x, y and z axis
		skew: ['10deg', '10deg'], //skews 10 degrees on the x and y axis
		skewX: '10deg', //skews 10 degrees on the x axis
		skewY: '10deg', //skews 10 degrees on the y axis
		scale: [1.5, 1.5], //scales by 1.5 on the x and y axis
		translate: ['20px', '20px'], //moves the transformation 20px on the x and y axis
		origin: ['20%', '20%']  //changes the transformation origin
	}, 1000);
	
	// Properties can be strings or arrays
	$('#example').css({skew: ['10deg', '10deg']});
	$('#example').css({skew: '10deg, 10deg'});
	
	// For animation, arrays should be nested because of jQuery's per-property easing support
	$('#example').animate({skew: ['10deg', '10deg']}); // technically this defines nonsense easing of 10deg
	$('#example').animate({skew: [['10deg', '10deg']]}); // this is a friendlier way of supporting this
	
	
	