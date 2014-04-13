var sprites = [];
function Sprite(events) {
    this.x = 0;
    this.y = 0;
    this.angle = 90;
    this.on = events;

    this.rotate = function(deg) {
        this.angle += deg;
        // TODOMAYBE: > 359?
        if(this.angle > 360) this.angle -= 360;
        if(this.angle < 0) this.angle += 360;
    };

    this.move = function(steps) {
        // TODO: move x/y depending on angle
        this.x += steps;
    }

    sprites.push(this);
}

function emit(name) {
    for(var i = 0; i < sprites.length; i++) {
        if(sprites[i].on[name]) sprites[i].on[name]();
    }
}

var can = document.getElementsByTagName('canvas')[0];
var ctx = can.getContext('2d');
can.addEventListener('mousedown', function() {emit('screenPress')}, false);

setInterval(function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, can.width, can.height);
    for(var i = 0; i < sprites.length; i++) {
        ctx.save();
        ctx.translate(sprites[i].x, sprites[i].y);
        ctx.translate(25, 25); // half of img width/height
        ctx.rotate(sprites[i].angle * Math.PI/180);

        ctx.fillStyle = 'red';
        ctx.fillRect(-25, -25, 50, 50); // -25 = half of img width/height

        ctx.restore();
    }
}, 1000/60);

// ------------------------


var testGuy = new Sprite({
    screenPress: function() {
        console.log('test guy approves of your press');
        if(Math.random() < 0.3) emit('quack');
        testGuy.rotate(20);
        testGuy.move(20);
    }
});

var testDuck = new Sprite({
    quack: function() {
        console.log('QUAAAACKK stop pressing!');
    }
});
console.log(sprites);
