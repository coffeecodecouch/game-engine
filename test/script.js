//--------[ math ]-------------------------------------------------------------
function rad(degrees) {return degrees * Math.PI/180}


//--------[ sprites ]----------------------------------------------------------
var sprites = [];
function Sprite(events) {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.on = events;

    this.rotate = function(deg) {
        this.angle += deg;
        if(this.angle > 360) this.angle -= 360;
        if(this.angle < 0) this.angle += 360;
    };

    this.move = function(steps) {
        this.x += Math.cos(rad(this.angle)) * steps;
        this.y += Math.sin(rad(this.angle)) * steps;
    }

    this.bye = function() {sprites.splice(sprites.indexOf(this), 1)}

    sprites.push(this);
}

function emit(name) {
    for(var i = 0; i < sprites.length; i++) {
        if(sprites[i].on[name]) sprites[i].on[name]();
    }
}


//--------[ set up ]-----------------------------------------------------------
var can = document.getElementsByTagName('canvas')[0];
var ctx = can.getContext('2d');
var mousedown = false;

can.addEventListener('touchstart', function() {emit('screenPress')}, false);
can.addEventListener('mousedown', function() {
    mousedown = true;
    emit('screenPress');
}, false);

can.addEventListener('touchmove', function() {emit('screenMove')}, false);
can.addEventListener('mousemove', function() {
    if(mousedown) emit('screenMove');
}, false);

can.addEventListener('touchend', function() {emit('screenRelease')}, false);
can.addEventListener('mouseup', function() {
    mousedown = false;
    emit('screenRelease');
}, false);

can.width = can.parentNode.clientWidth;
can.height = can.parentNode.clientHeight;

//--------[ main loop ]--------------------------------------------------------
function loop() {
    requestAnimFrame(loop);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, can.width, can.height);
    for(var i = 0; i < sprites.length; i++) {
        ctx.save();
        ctx.translate(sprites[i].x, sprites[i].y);
        ctx.translate(25, 25); // half of img width/height
        ctx.rotate(rad(sprites[i].angle));

        ctx.fillStyle = 'red';
        ctx.fillRect(-25, -25, 50, 50); // -25 = half of img width/height

        ctx.restore();
    }
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

loop();


//--------[ user code ]--------------------------------------------------------
var testGuy = new Sprite({
    screenPress: function() {
        console.log('test guy approves of your press');
        if(Math.random() < 0.3) emit('quack');
        testGuy.rotate(20);
        testGuy.move(20);
    },
    screenMove: function() {
        console.log('screenmove');
    }
});

var testDuck = new Sprite({
    quack: function() {
        console.log('QUAAAACKK stop pressing!');
        if(Math.random() < 0.1) testDuck.bye();
    }
});
