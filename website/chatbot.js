(function() {
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function () {
    const COOLDOWN = 10,
        OK = 0,
        NOPE = -1;

    // possible states
    var frames = {"scared": 0, "mad": 1, "idle": 2},
        toidle = OK,
        lock = OK;

    // get canvas
    canvas = document.getElementById("nyan");
    canvas.width = 128;
    canvas.height = 128;

    // create sprite sheet
    nyan_img = new Image();
    nyan_img.src = "images/nyan-sprite-anim.png";

    // load sprite sheet
    canvas.addEventListener("load", idle);
    canvas.addEventListener("mouseover", scared);
    canvas.addEventListener("mouseout", idle);
    
    // Create sprite
    nyan = sprite({
        context: canvas.getContext("2d"),
        width: 384,
        height: 128,
        image: nyan_img,
        no_frames: 3,
        state: frames.idle
    });

    loop();

    function sprite (options) {
        var that = {},
            no_frames = options.no_frames || 1;

        // current image frame
        that.state = frames.idle;
        
        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;

        that.render = function () {
          // clear the canvas
          that.context.clearRect(0, 0, that.width, that.height);
          
          // draw the animation at current frame
          that.context.drawImage(
            that.image,
            that.state * that.width / no_frames, 0,
            that.width / no_frames,
            that.height,
            0,
            0,
            that.width / no_frames,
            that.height);
        };
        
        return that;
    }


    function scared() {
        if (lock == OK) {
            nyan.state = frames.scared;
            lock = COOLDOWN;
        }
    }

    function mad() {
        nyan.state = frames.mad;
        toidle = COOLDOWN;
    }

    function idle() {
        nyan.state = frames.idle;
    }

    function loop() {
        window.requestAnimationFrame(loop);
        nyan.render();

        if (toidle > 0) {
            --toidle;
        } else if (toidle == OK && lock == OK) {
            idle();
            toidle = NOPE;
        }

        if (lock > 0) {
            --lock;
        }
    }
} ());

$("#replyballoon").click(function(){
    $(this).children('p').attr('contentEditable','true');
});
