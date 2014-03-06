define(["jquery","bootstrap","socketio", "cookie"], function($) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    var test = {};


    $(document).ready(function(){

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

//we need to make sure the url is on the right page
if(document.location.pathname == "/auction"){

  var socket = io.connect('http://spotaplace.com/');

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
    ////console.log("my other data");
    if($('form[name=bidForm]').length === 1  ){
       $('.bidContent').append('<div class="row"><div class="col-md-5 vendorBidBox bid">'+
      '<p>'+data.storeName+'</p>'+
      '<p>'+data.description+'<p>'+
      '<form name="vendorBidBoxForm" class="vendorBidBoxForm">'+
      '<input type="hidden" name="auctionId" value="'+data.auctionID+'">'+
      '<input type="hidden" name="vendorId" value="'+data.vendorID+'">'+
      '</form></div></div>');

    }else{
    //console.log(data);
    $('.bidContent').append('<div class="row"><div class="col-md-5 vendorBidBox bid">'+
      '<p>'+data.storeName+'</p>'+
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








});