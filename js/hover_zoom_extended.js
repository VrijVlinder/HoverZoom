
	var dynamic_img = $('<div id="dynamic">'); 
	var footer_div = $('<div id="footer">&nbsp;&nbsp;Press "Ctrl+b" or just "b" to toggle Hover-Zoom</div>');
	var notify_div = $('<div></div>');
	//var loading_div = $('<div id="loading">&nbsp;&nbsp;Loading..</div>');
	var dynamic_img_width;
	var dynamic_img_height;
	
	var currentX=0;
	var currentY=0;
	var hover_zoom_element_src = '';
	var aspect_ratio;
	var meanPoint;
	var range;

	var window_width;
	var window_height;
	var available_width;
	var available_height;
	
	var xLeftTolerance = 15;
	var xRightTolerance = 30;
	var yTopTolerance = 15;
	var yBottomTolerance = 45;
	
	var maxZoomWidth = 1000;

	var tid_load;
	var tid_show;
	
	var delay = 150; // in milliseconds
	var doNothing = false;
	$(function(){
	
	
		$("body").keypress(function(event) {
			if ( event.which == 2 || event.which == 98 ) {
				//event.preventDefault();					
				doNothing = !doNothing;
				
				if(doNothing) {
					dynamic_img.hide();
					footer_div.hide();
					showNotifyDiv('Disabled');
				} else {
					showNotifyDiv('Enabled');
				}
				
			}
		});
		
		function showNotifyDiv(state) {
			notify_div.text('Hover-Zoom '+state);
			notify_div.slideDown().delay(500).slideUp();
		}
	/*
	loading_div.css('padding', '5px');
	loading_div.css('backgroundColor', 'white');
	loading_div.css('border', '1px solid black');
	loading_div.css('position', 'absolute');
	loading_div.css('pointer-events', 'none');
	loading_div.css('font', '12px Calibri');
	loading_div.css('width', '50px');
	loading_div.css('width', '15px');
	loading_div.appendTo('body');
	loading_div.hide();
	*/

				
	window_width=$(window).width();
	window_height=$(window).height();
	
	notify_div.css('position', 'fixed');
	notify_div.css('left', window_width/2-75);
	notify_div.css('top', '0px');
	notify_div.css('width', '130px');
	notify_div.css('height', '18px');
	notify_div.css('text-align', 'center');
	notify_div.css('z-index', '200');
	//notify_div.css('color', 'black');
	//notify_div.css('background-color', 'rgb(228,224,243)');
	notify_div.css('background-color', 'rgb(56,165,222)');
	notify_div.css('text-shadow', '0px 1px 1px rgb(18,78,109)');
	notify_div.css('color', 'white');
	notify_div.css('font', '13px Calibri');
	
	notify_div.appendTo('body');
	notify_div.slideUp();
	
	//footer_div.css('border', '1px solid red');
	footer_div.css('position', 'absolute');
	footer_div.css('text-align', 'left');
	footer_div.css('font', '13px Calibri');
	footer_div.css('z-index', '100');
	footer_div.css('pointer-events', 'none');
	footer_div.css('color', 'white');
	footer_div.css('height', '20px');
	footer_div.css('padding', '4px 12px');
	footer_div.css('overflow', 'hidden');
	footer_div.css('padding-right', '0px');
	//footer_div.css('background-color', 'rgb(112,146,190)');
	footer_div.css('background-color', 'rgb(56,165,222)');
	footer_div.css('text-shadow', '0px 1px 1px rgb(18,78,109)');
		
	footer_div.css('-webkit-box-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
	footer_div.css('-moz-box-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
	footer_div.css('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
	footer_div.css('border', '1px solid white');
	footer_div.css('border-top', 'none');

	footer_div.appendTo('body');
	footer_div.hide();

	//alert('window_width:' + window_width);
	
	//alert($('#testimg').width());
	
		//$('img').mousemove(function(e){
		$("body").on("mousemove", "img,.hover-zoom-element", function(e){
			//$("span").text(e.pageX + " " + e.pageY);
			

			if(doNothing==true)
				return;
				
			currentX = e.pageX;
			currentY = e.pageY;
			
			calculateDynamicWidth(e.pageX,e.pageY);
			//alert('dynamic_img_height:' + dynamic_img_height);
				
			
		});
			
		$("body").on("mouseout", "img,.hover-zoom-element", function(e){
		//$('img').bind("mouseleave",function(){
			abortTimer(tid_load);
			abortTimer(tid_show);
			dynamic_img.hide();
			footer_div.hide();
			//loading_div.hide();
		});
		
		
		$("body").on("mouseenter", "img,.hover-zoom-element", function(e){
		//$('img').bind("mouseenter",function(){
			if(doNothing==true)
				return;
				
			current_element = this;	
			//current_element_id = this.id;
	
			var imageSource; // this is the current image source
			imageSource = $(current_element).attr('src');
			
			if(null==imageSource||imageSource==""||imageSource=="undefined") {
				imageSource = $(current_element).css('background-image');
				//console.log(imageSource);
				imageSource=imageSource.substring(4,imageSource.length-1);
			}
			
			if(null!=imageSource&&imageSource!=""&&imageSource!="undefined") {
				if(imageSource[0]=="\""||imageSource[0]=="'")
				imageSource=imageSource.substring(1,imageSource.length-1);
			}				
	
			
			if(hover_zoom_element_src!=imageSource) {
				abortTimer(tid_show);
				abortTimer(tid_load);
				dynamic_img.hide();
				footer_div.hide();
				
				//alert('new image');
				tid_load = setTimeout(function(){loadDynamicImage(current_element,currentX,currentY,imageSource);}, delay);
			} else {
				//calculateDynamicWidth(e.pageX,e.pageY);
				//abortTimer(tid_show);
				//dynamic_img.hide();
				//footer_div.hide();
				tid_show = setTimeout(function(){showDynamicImage();}, delay);
			}
		});	

	});	
	

	
	function showDynamicImage() {
		dynamic_img.show();
		footer_div.show();
		
	}
	
	function loadDynamicImage(current_element,currentX,currentY,imageSource) {

				//alert('hi');
				meanPoint = (current_element.getBoundingClientRect().left) + ($(current_element).width())/2;
				range = (35*($(current_element).width())/100)/2; 
				//alert(this.getBoundingClientRect().left);
				
				$content = $("<img src=\'"+imageSource+"\' style='display:block;'/>");
				//console.log($content);
				//$content = $(current_element).data('hover-zoom-content');
				
				//console.log($content);
				//40% from the mean is totally visible area...!!!
				//range is 20% to left and right
				
			dynamic_img.remove();
			//footer_div.remove();
			//footer_div.remove();
			dynamic_img = $('<div id="dynamic">');

			available_width = window_width-xLeftTolerance-xRightTolerance;
			available_height = window_height-yTopTolerance-yBottomTolerance;	
			//setting custom max-width for posts
			dynamic_img.css('max-width', maxZoomWidth+'px');
			dynamic_img.css('max-height', available_height);
			dynamic_img.css('overflow', 'hidden');
			dynamic_img.css('text-align', 'left');
			/*
			dynamic_img.load(function() {
					//alert('new image load');
					max_img_width = dynamic_img.width();
					max_img_height = dynamic_img.height();
					//alert('loaded ' + max_img_width + '-' + max_img_height);
					aspect_ratio=max_img_width/max_img_height;
					//meanPoint=
					calculateDynamicWidth(e.pageX,e.pageY);
					dynamic_img.show();
					footer_div.show();
					//loading_div.hide();
				});
			*/	
			hover_zoom_element_src = imageSource;
			dynamic_img.html($content);
			dynamic_img.css('left', $(document).scrollLeft());
			dynamic_img.css('top', $(document).scrollTop());
			//dynamic_img.css('padding', '0px 15px');
			dynamic_img.css('backgroundColor', 'white');
			dynamic_img.css('border', '1px solid white');//rgb(127,127,127)
			dynamic_img.css('position', 'absolute');
			dynamic_img.css('pointer-events', 'none');
						dynamic_img.css('-webkit-box-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
						dynamic_img.css('-moz-box-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
						dynamic_img.css('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
						dynamic_img.css('border-bottom', 'none');//rgb(127,127,127)

			dynamic_img.appendTo('body');
			calculateDynamicWidth(currentX,currentY);
			dynamic_img.show();
			footer_div.show();
			
		
	}
	
	function abortTimer(tid) { // to be called when you want to stop the timer
		if(null!=tid)
			clearTimeout(tid);
	}		
	
	function calculateDynamicWidth(ePageX,ePageY) {
		var imgX;
		var imgY;
		var y_upper_limit;
		var y_lower_limit;
		var x_left_limit;
		var x_right_limit;
		var pageX = ePageX-$(document).scrollLeft();
		var pageY = ePageY-$(document).scrollTop();
		//alert($(document).scrollTop());
		
		dynamic_img_width=dynamic_img.width();
		dynamic_img_height=dynamic_img.height();

					//alert(dynamic_img_height);

					
		if(dynamic_img_width!=0 && dynamic_img_height!=0) {
			//q=calculateQuadrant(pageX,pageY);

			//available_width = window_width-pageX-xTolerance;
			//available_height = window_height-pageY-yTolerance;
			
			/*
			dynamic_img_width=max_img_width;
			dynamic_img_height=max_img_height;
			//alert('available_width:' + available_width);
			//alert('available_height:' + available_height);
			//alert('dynamic_img_width:' + dynamic_img_width);					
			//alert('dynamic_img_height:' + dynamic_img_height);					
			
			if(dynamic_img_width>available_width) {
				dynamic_img_width=available_width;
				dynamic_img_height=dynamic_img_width/aspect_ratio;
				
				
			}
			
			//alert('dynamic_img_height:' + dynamic_img_height);					

			if(dynamic_img_height>available_height) {
				dynamic_img_height=available_height;
				dynamic_img_width=aspect_ratio*dynamic_img_height
				
				//alert('dynamic_img_height:' + dynamic_img_height);
			}
			*/
			//-----------------------------------------------------

			/*
			if(q==1) {
				imgX = ePageX - (dynamic_img_width/2);
			} else {
				imgX = ePageX - dynamic_img_width - 10;
			}*/

			
			//alert('dynamic_img_width:' + dynamic_img_width);

			y_upper_limit = $(document).scrollTop() + yTopTolerance;
			y_lower_limit = $(document).scrollTop() + window_height - yBottomTolerance;

			x_left_limit = $(document).scrollLeft() + xLeftTolerance;
			x_right_limit = $(document).scrollLeft() + window_width - xRightTolerance;

			imgY = ePageY - dynamic_img_height/2;
			
			if(imgY<y_upper_limit)
				imgY=y_upper_limit;
			
			if((imgY+dynamic_img_height)>y_lower_limit) {
				//alert('in here');
				//imgY=window_height-(yTolerance/2)-dynamic_img_height;
				imgY=y_lower_limit-dynamic_img_height;
			}

			imgX = ePageX - dynamic_img_width/2;
			
			if(imgX<x_left_limit)
				imgX=x_left_limit;
			
			if((imgX+dynamic_img_width)>x_right_limit) {
				//alert('in here');
				//alert('dynamic_img_width:' + dynamic_img_width);
				//imgY=window_height-(yTolerance/2)-dynamic_img_height;
				imgX=x_right_limit-dynamic_img_width;
			}
			
			opacity = Math.abs(range/(ePageX-meanPoint)) + 0.1;
			//visible range of 40*2 pixels from mean point
			
			dynamic_img.css('top', imgY);
			dynamic_img.css('left', imgX);			
			dynamic_img.css('opacity', opacity);
			
			footer_div.css('top', imgY+dynamic_img_height);
			footer_div.css('left', imgX);			
			footer_div.css('width', dynamic_img_width-12);
			footer_div.css('opacity', opacity);
			
		} else {
			//alert('loading');
			/*
			
			loading_div.css('top', e.pageY);
			loading_div.css('left', e.pageX);			
			loading_div.show();*/
			
			//dont set width or height - show the normal image dimension
			//show loading image...
			//alert('loading');
			
			/*
			if(max_img_width<dynamic_img.width())
				max_img_width = dynamic_img.width();
				
			if(max_img_height<dynamic_img.height())
				max_img_height = dynamic_img.height();
				
			aspect_ratio=max_img_width/max_img_height;

			dynamic_img.css('top', ePageY);
			dynamic_img.css('left', ePageX);			
			*/

			//alert(max_img_width);	
			//calculateDynamicWidth(ePageX,ePageY);
		}
	}
	
	function calculateQuadrant(pageX,pageY) {
		var meanX = window_width/2;
		
		if(pageX<=meanX) {
			//available_width = window_width-pageX-xRightTolerance;
			available_width = window_height-xLeftTolerance-xRightTolerance;//(pageX-xLeftTolerance-$(document).scrollLeft())*2;
			available_height = window_height-yTopTolerance-yBottomTolerance;
			return 1;
		} else {
			//available_width = pageX-xLeftTolerance-$(document).scrollLeft();
			//available_width = (window_width-pageX-xRightTolerance)*2;
			available_width = window_height-xLeftTolerance-xRightTolerance;
			available_height = window_height-yTopTolerance-yBottomTolerance;		
			return 2;
		}
	}

