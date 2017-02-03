
$(function() {

  let socket = io(window.location.pathname);
  //console.log(window.location.pathname);
  socket.on('connect', function() {
    console.log('You are connected');

    socket.on('pageLoad', function(drawings) {
      if(drawings) {
        drawings.forEach(function(eachDrawing) {
          whiteboard.draw(eachDrawing[0], eachDrawing[1], eachDrawing[2]);
        })
      }
    });

    whiteboard.on('draw', function(start, end, color) {
      console.log("drawing...", start, end, color);
      socket.emit('draw', start, end, color);

    })

    // $(document).on('mousemove', function (e) {
    //     var x = e.pageX;
    //     var y = e.pageY;
    //     socket.emit('mousemove', x, y);
    // });

    socket.on('drawFromOthers', function (start, end, color) {

      console.log(start, end, color)

      whiteboard.draw(start, end, color, false);
        // var $div = $('<div></div>')

        // $div
        //   .css({width: 5, height: 5, background: 'red', position: 'fixed'})
        //   .css({top: `${y}px`, left: `${x}px`})
        //   .appendTo($('body'));

        // setTimeout(function () {
        //     $div.remove();
        // }, 400);


    });
  });


});
