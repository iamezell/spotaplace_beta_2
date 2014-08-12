define(["jquery","bootstrap","socketio", "cookie", "tubular","WOW", "countdown", "bootstrapValidator"], function($) {
	//the jquery.alpha.js and jquery.beta.js plugins have been loaded.
	var test = {};


	$(document).ready(function(){
		
		$('#status').fadeOut();
	$('#preloader').delay(350).fadeOut('slow');
	$('body').delay(350).css({
		'overflow': 'visible'
			});
		
		
		
		// check if are on the homepage
		if(document.location.pathname == "/"){
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Opera Mini/i.test(navigator.userAgent) ) {
		$.backstretch([
			"img/background/1.jpg"
		]);
	}
	else {
		$('#home').tubular({
			videoId: 'XqWEPwuIYtA'
		}); // where videoId is the YouTube ID.
	}
			
				/* ---------------------------------------------------------
	 * Menu Button
	 */

	var isToggled = false;

	$("#menu-btn").on("click", function () {
		if (isToggled) {
			$(this).children("i").attr("class", "fa fa-bars");
			isToggled = false;
		} else {
			$(this).children("i").attr("class", "fa fa-times");
			isToggled = true;
		}
	});
			
			
			new WOW().init();
			
			/* ---------------------------------------------------------
	 * Scroll arrow
	 */
	
	$("#scroll").click(function () {
	 	if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
	 		var target = $(this.hash);
	 		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	 		if (target.length) {
	 			$('html,body').animate({
	 				scrollTop: target.offset().top
	 			}, 1200);
	 			return false;
	 		}
	 	}
	 });

			/* ---------------------------------------------------------
	 * Scroll arrow
	 */
	
	$("#scroll").click(function () {
	 	if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
	 		var target = $(this.hash);
	 		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	 		if (target.length) {
	 			$('html,body').animate({
	 				scrollTop: target.offset().top
	 			}, 1200);
	 			return false;
	 		}
	 	}
	 });

			/* ---------------------------------------------------------
	 * Countdown
	 */

	var description = {
		weeks: "weeks",
		days: "days",
		hours: "hours",
		minutes: "minutes",
		seconds: "seconds"
	};
	
	// year/month/day
	$('#countdown').countdown('2014/10/1', function (event) {
		$(this).html(event.strftime(
			'<div class="countdown-section"><b>%w</b> <span>' + description.weeks + '</span> </div>' +
			'<div class="countdown-section"><b>%d</b> <span>' + description.days + '</span> </div>' +
			'<div class="countdown-section"><b>%H</b> <span>' + description.hours + '</span> </div>' +
			'<div class="countdown-section"><b>%M</b> <span>' + description.minutes + '</span> </div>' +
			'<div class="countdown-section"><b>%S</b> <span>' + description.seconds + '</span> </div>'
		));
	});
				/* ---------------------------------------------------------
	 * Form validation
	 */

	/* Signup form */

	$('#signupForm').bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'fa fa-check',
			invalid: 'fa fa-times',
			validating: 'fa fa-refresh'
		},
		submitHandler: function (validator, form, submitButton) {
			var l = Ladda.create(submitButton[0]),
				btnText = submitButton.children(".ladda-label");
			
			l.start();
			btnText.html("Signing up...");
			
			$.get(form.attr('action'), form.serialize(), function(result) { 
				btnText.html(result.message);							
			}, 'json')
			.always(function() { 
				l.stop(); 
				validator.disableSubmitButtons(true);
			});
		},
		fields: {
			email: {
				validators: {
					notEmpty: {
						message: 'Email cannot be empty'
					},
					emailAddress: {
						message: 'The input is not a valid email address'
					}
				}
			}
		}
	});
			
		}//end homepage check

		
		
		
		
		
		

	  $('.bidContent').on('click','.vendorInfoBtn', function(el){
	  // ok we need to find wich form was processed
	  var vendorId = $($(this).parent()[0][1]).val();
	  var auctionId = $($(this).parent()[0][0]).val();

	  //console.log("this is the vendor id"+vendorId);
	  //now we need to get the vendor id
	  // $.post( "/forInfo", {'vendorId':vendorId  }, function(res){

	  // } );
	  document.location = '/store-front?store='+vendorId;

	  // //console.log(thisForm);
  })

	  $('.bidContent').on('click','.vendorWinBtn', function(el){
	  // ok we need to find wich form was processed
	  var vendorId = $($(this).parent()[0][1]).val();
	  var auctionId = $($(this).parent()[0][0]).val();
	  //console.log("auction id ="+ auctionId);
	  //now we need to get the vendor id
	  // $.post( "/forInfo", {'vendorId':vendorId  }, function(res){

	  // } );
	  document.location = '/store-front?store='+vendorId+'&win=1'+'&auctionId='+auctionId;

	  // //console.log(thisForm);
	  return false;
  })


	//lets preload the products array
	$('#products').prop('checked',true);

	//radio change events
	$('.radio').change(function(obj){
	  if($('#products').is(':checked')){
			//call to get products
			$.get('/productTypes', function(ret){
			  $('#medium').html('');
			  for(var i=0; i < ret.length; i++){
			   $('#medium').append('<option value="'+ret[i]['name']+'">'+ret[i]['name']+'</option>');
			 }

		   });
		  }else{
			//call to get services
			$.get('/servicetypes', function(ret2){
			 $('#medium').html('');
			 for(var j=0; j < ret2.length; j++){
			   $('#medium').append('<option value="'+ret2[j]['name']+'">'+ret2[j]['name']+'</option>');
			 }
		   });

		  }
		})


  });


	$('form[name=prodsandservs]').submit(function(e){
	  e.preventDefault();

	  $.post('/vendorInfo', $(this).serialize(), function(res){
			// //console.log(res);
			$('#myModal').modal();
			$('.modal-body').html(res.message);
		  })
	  return false;
	})
//to be in own script

$('form[name=product-serv-submit]').submit(function(e){
  e.preventDefault();

  $.post('/add-product-serv', $(this).serialize(), function(res){
	//console.log(res);
	$('#myModal').modal();
			// $('.modal-body').html(res.message);
		  })
  return false;
})

$('form[name=removeProduct]').submit(function(e){
  e.preventDefault();
	// //console.log("firing");

	var parentElement = $(this).parent();
	$.post('/remove-product/'+$(this)[0][0].value, $(this).serialize(), function(res){
			// //console.log($(this));
			if(res == "ok"){
			  parentElement.remove();
			}
			// $('.modal-body').html(res.message);
		  })

	return false;
  })

$('form[name=holder]').submit(function(e){
  e.preventDefault();

	var parentElement = $(this).parent();
	$.post('/getAuctions/', $(this).serialize(), function(res){
			// //console.log(res.auctions);
			var options = $('#auctionList');
			$.each(res.auctions, function() {

			  options.append($("<option />").val(this._id).text(this.description));
			});

		  })

	return false;
  })



$('#auctionGo').on('click', function(){
	// //console.log("hi")
	var auctionList = $('#auctionList');
	var inputArray = $('form[name=hedForm] :input');
	var auctionId = auctionList.find(":selected").val();

	inputArray.each(function(){
	  if(this.name == 'auction'){
		$(this).val(auctionId)
	  }

	  if(this.name == 'POR'){
		$(this).val('vendor');
	  }
	  $('form[name=hedForm]').submit();



	});




  })


// $('form[name=bidForm]').submit(function(e){
//   e.preventDefault();
//   //console.log($(this[0]).val());

//     // var parentElement = $(this).parent();
//      // $.post('/addBid/', $(this).serialize(), function(res){
//      //         // //console.log(res);

//      //     })

// return false;
// })
// if the vendor selects one of the auctions it should enter him into that auction

$("auctionList").click(function(){
  //console.log('hello');
})


$('#bidBtn').on('click', function(event){
  $('#bidModal').modal();
})

$('#speakBtn').on('click', function(event){
  $('#speakModal').modal();
})

//we need to make sure the url is on the right page
if(document.location.pathname == "/auction"){

  var socket = io.connect('http://localhost/');

  // now we need to join the room
  // socket.emit('joinRoom', {room:})


  //console.log("hello");


  $('form[name=bidForm]').submit(function(e){
	e.preventDefault();
	var description = $(this[0]).val();
	var vendorId = $(this[1]).val();
	var auctionId = $(this[2]).val();
	//console.log("running");

	socket.emit('bid', { description: description, vendorId : vendorId, auctionId: auctionId });
	$('#bidModal').modal('hide');
	return false;
	//close modal

  })


  socket.on('bidBoxReturn', function (data) {
	console.log(data);
	if($('form[name=bidForm]').length === 1  ){
	   $('.bidContent').append('<div class="row"><div class="col-md-5 vendorBidBox bid">'+
	  '<p>'+data.name+'</p>'+
	  '<p>'+data.description+'<p>'+
	  '<form name="vendorBidBoxForm" class="vendorBidBoxForm">'+
	  '<input type="hidden" name="auctionId" value="'+data.auctionID+'">'+
	  '<input type="hidden" name="vendorId" value="'+data.vendorID+'">'+
	  '</form></div></div>');

	}else{
	//console.log(data);
	$('.bidContent').append('<div class="row"><div class="col-md-5 vendorBidBox bid">'+
	  '<p>'+data.name+'</p>'+
	  '<p>'+data.description+'<p>'+
	  '<form name="vendorBidBoxForm" class="vendorBidBoxForm">'+
	  '<input type="hidden" name="auctionId" value="'+data.auctionID+'">'+
	  '<input type="hidden" name="vendorId" value="'+data.vendorID+'">'+
	  '<button class="btn btn-primary vendorWinBtn">Choose</button>'+
	  '<a class="btn btn-info vendorInfoBtn">Info</a>'+
	  '</form></div></div>');
  }

  });



} //end if document

	if(document.location.pathname == "/members"){

		var jqxhr = $.get( "getMemberData", function() {
//  alert( "success" );
})
  .done(function(res) {
	if(res.message == "none"){
		console.log("There is no one to review.");
		$(".reviews-box").append("<p>There is no one to review yet.</p>")
	}else{
//		var myRes = JSON.parse(res);
		//@note there has got to be a better way to do this 
//		console.log(res);
		for(var i=0; i < res.length; i++){
//			console.log(res[i].store[0].name);
			$(".reviews-box").append('<form class="form-vertical" name="review-post" role="form" ><div class="form-group"><p>'+res[i].store[0].name+'</p></div><div class="form-group"><textarea name="text" rows="4" cols="50"></textarea></div><div class="form-group"><input type="hidden" name="ratingsId" value="'+res[i].ratingsId+'" ><button class="btn btn-primary" type="submit">rate them</button></div></form>');
		}


//		$(".reviews-box").append()

	} 

			$('.reviewSendBtn').on('click', function(e){
			e.preventDefault();

//			console.log("hello");

		})
	// post a review
	$('form[name=review-post]').submit(function(e){
	e.preventDefault();
	var vendorId = $(this[1]).val();
	var	ratingText = $(this[0]).val();
	var that = $(this)
	var jqxhr2 =  $.post("/reviews", {"ratings-Id":vendorId, "ratingText":ratingText}, function(res){

	}).done(function(res){
//		console.log(res);
		that.remove()
		//get rating id from response than search for the form that has that id and delete it.
	});
	return false;
		//close modal

  })

  })
  .fail(function(e) {
//    alert("got an error");

  })
  .always(function() {
//    alert( "finished" );
  });



}
	
	if(document.location.pathname == "/store-front"){
		$('form[name=getReviews]').submit(function(e){
			e.preventDefault();
			// we need to make a ajax call
			var vendorId = $('form[name=getReviews] :input[type=hidden]').val();
			var getReviews =  $.post("/getReviews", {"vendor_id":vendorId},function(res){
				console.log(res);
				//let put the reviews in the reviewBox
				//clar rating box
				$(".review-box").html("");
				for(var i=0; i < res.length; i++){
//					$(".review-box").append('<ul class="review list-unstyled"><li>'+res[i].name+'</li>'+'<li>'+res[i].ratingText+'</li></ul>')	
					$(".review-box").append('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+res[i].name+'</h3></div><div class="panel-body">'+res[i].ratingText+'</div></div>');
				}
				
			})
//			console.log($('form[name=getReviews] :input[type=hidden]').val());
	});
	}



});