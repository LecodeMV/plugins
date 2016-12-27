/*
#=============================================================================
# LE - Animated Pictures
# LeAnimatedPictures.js
# By Lecode
# Requested by Jonforum
# Version 1.1
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# -Credits to Lecode
# -Keep this header
# -Free to use for commercial and non-commercial projects
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : Added some plugin commands
#=============================================================================
*/
var Imported = Imported || {};
Imported["LeAnimatedPictures"] = true;

var Lecode = Lecode || {};
Lecode.S_LeAnimatedPictures = {};
/*:
 * @plugindesc Animated pictures
 * @author Lecode
 * @version 1.1
 *
 * @help
 * 
 * ==========================================================================================
 *                  CREATE AN ANIMATED PICTURE
 * ------------------------------------------------------------------------------------------
 * Use this plugin command:
 * AnimatedPicture id name frames lines delay origin x y scaleX scaleY opacity blendMode
 * 
 * id => The id of your picture that will be created
 * name => The filenam of the picture
 * lines => The number of line of the spritesheet
 * delay => The loop time rate, in millisecond ( 1000 millisecond = 1 second)
 * origin => 0: Upper left         1: Center
 * x => X coordinate
 * y => Y coordinate
 * scaleX => % of x scale ( starts at 100. Don't put "%")
 * scaleY => % of y scale ( starts at 100. Don't put "%")
 * opacity => Opacity of your picture
 * blendMode => 0: Normal   1: Additive     2: Multiply     3: Screen
 * 
 * Example: AnimatedPicture 1 Pic 13 2 100 0 200 200 100 100 255 0
 * 
 * Default picture commands like opacity change will still work. Just use the same picture ID.
 * The picture isn't animated yet, use the following command to starts the animation.
 * ==========================================================================================
 *                  START ANIMATION
 * ------------------------------------------------------------------------------------------
 * This command starts the animation of a picture. Use this command:
 * AnimatedPicture id Start mode
 * 
 * id => The id of the picture you want to animate
 * mode => Use "cycle" or "infinite"
 * When using cycle, the animation if played one time and ends to
 * the last frame.
 * When using infinite, the animation will loop undefinitely.
 * 
 * Example: AnimatedPicture 1 Start infinite
 * ==========================================================================================
 *                  SET ANIMATION LINE
 * ------------------------------------------------------------------------------------------
 * Use this command to change the line of picture animation:
 * AnimatedPicture id SetLine lineID
 * 
 * id => The id of the picture you want to animate
 * lineID => The index of the line you want to choose. (Starts at 0)
 * 
 * Example: AnimatedPicture 1 SetLine 0
 * ==========================================================================================
 *                  SET ANIMATION FRAME
 * ------------------------------------------------------------------------------------------
 * You can set a fixed frame for your picture. The animation will end and
 * the picture will be set at the specified frame. Use this command:
 * 
 * AnimatedPicture id SetFrame frameID
 * 
 * id => The id of the picture you want to animate
 * frameID => The index of the frame you want to choose. (Starts at 0)
 * 
 * Example: AnimatedPicture 1 SetFrame 1
 * ==========================================================================================
 *                  STOP ANIMATION
 * ------------------------------------------------------------------------------------------
 * Use this command to stop the animation of a picture. The frame index will not
 * be reseted:
 * 
 * AnimatedPicture id Stop
 * 
 * id => The id of the picture you want to animate
 * 
 * Example: AnimatedPicture 1 Stop
 * 
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeAnimatedPictures');

/*-------------------------------------------------------------------------
* Game_AnimatedPicture
-------------------------------------------------------------------------*/
function Game_AnimatedPicture() {
    this.initialize.apply(this, arguments);
}

Game_AnimatedPicture.prototype = Object.create(Game_Picture.prototype);
Game_AnimatedPicture.prototype.constructor = Game_AnimatedPicture;

Game_AnimatedPicture.prototype.initialize = function () {
    this._animated = true;
    this._frames = 0;
    this._lines = 1;
    this._linePos = 0;
    this._fixedFrame = null;
    this._delay = 500;
    this._loopMode = "";
    this._animResetRequested = false;
    Game_Picture.prototype.initialize.call(this);
};

Game_AnimatedPicture.prototype.setAnimationFrame = function (frame) {
    this._fixedFrame = frame;
};

Game_AnimatedPicture.prototype.setAnimationLine = function (line) {
    this._linePos = line;
};

Game_AnimatedPicture.prototype.startPictureAnimation = function (mode) {
    this._loopMode = mode;
    this._fixedFrame = null;
    this._animResetRequested = true;
};

Game_AnimatedPicture.prototype.stopPictureAnimation = function () {
    this._loopMode = "";
};

/*-------------------------------------------------------------------------
* Game_Screen
-------------------------------------------------------------------------*/
Game_Screen.prototype.showAnimatedPicture = function (pictureId, name, origin, x, y,
    scaleX, scaleY, opacity, blendMode, frames, lines, delay) {
    //- Calling $gameScreen.showPicture for compatibility purposes
    this.showPicture(pictureId, name, origin, x, y,
        scaleX, scaleY, opacity, blendMode);
    var realPictureId = this.realPictureId(pictureId);
    this._pictures[realPictureId] = new Game_AnimatedPicture();
    //- Assigning data relative to the animated picture
    this._pictures[realPictureId]._frames = frames;
    this._pictures[realPictureId]._lines = lines;
    this._pictures[realPictureId]._delay = delay;
    //- Recalling the show function (which is previously called in
    //- the showPicture function) to refresh and apply changes
    this._pictures[realPictureId].show(name, origin, x, y,
        scaleX, scaleY, opacity, blendMode);
};


/*-------------------------------------------------------------------------
* Game_Interpreter
-------------------------------------------------------------------------*/
Lecode.S_LeAnimatedPictures.oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    Lecode.S_LeAnimatedPictures.oldGameInterpreter_pluginCommand.call(this, command, args);
    if (command === 'AnimatedPicture') {
        if (args[1] === "SetLine") {
            var picId = Number(args[0]);
            var line = Number(args[2]);
            var picture = $gameScreen.picture(picId);
            picture.setAnimationLine(line);
            return;
        }
        if (args[1] === "SetFrame") {
            var picId = Number(args[0]);
            var frame = Number(args[2]);
            var picture = $gameScreen.picture(picId);
            picture.setAnimationFrame(frame);
            return;
        }
        if (args[1] === "Start") {
            var picId = Number(args[0]);
            var mode = String(args[2]);
            var picture = $gameScreen.picture(picId);
            picture.startPictureAnimation(mode);
            return;
        }
        if (args[1] === "Stop") {
            var picId = Number(args[0]);
            var picture = $gameScreen.picture(picId);
            picture.stopPictureAnimation();
            return;
        }
        var pictureId = Number(args[0]);
        var name = String(args[1]);
        var frames = String(args[2]);
        var lines = String(args[3]);
        var delay = Number(args[4]);
        var origin = Number(args[5]);
        var x = Number(args[6]);
        var y = Number(args[7]);
        var scaleX = Number(args[8]);
        var scaleY = Number(args[9]);
        var opacity = Number(args[10]);
        var blendMode = Number(args[11]);
        $gameScreen.showAnimatedPicture(pictureId, name, origin, x, y,
            scaleX, scaleY, opacity, blendMode, frames, lines, delay);
    }
};

/*-------------------------------------------------------------------------
* Sprite_Picture
-------------------------------------------------------------------------*/
Lecode.S_LeAnimatedPictures.oldSpritePicture_initialize = Sprite_Picture.prototype.initialize;
Sprite_Picture.prototype.initialize = function (pictureId) {
    this._frameCount = 0;
    Lecode.S_LeAnimatedPictures.oldSpritePicture_initialize.call(this, pictureId);
};

//- Called when the bitmap of an animated picture is loaded
Sprite_Picture.prototype.initializeAnimatedBitmap = function () {
    var picture = this.picture();
    if (picture && this.bitmap && picture._animated) {
        var nbrFrames = picture._frames;
        var nbrLines = picture._lines;
        var w = Math.floor(this.bitmap.width / nbrFrames);
        var h = Math.floor(this.bitmap.height / nbrLines);
        this.setFrame(0, 0, w, h);
        //- Animation loop
        setTimeout(this.updateBitmapFrame.bind(this),
            picture._delay);
    }
};

Sprite_Picture.prototype.updateBitmapFrame = function () {
    var picture = this.picture();
    if (picture && this.bitmap && picture._animated) {
        if (picture._animResetRequested) {
            this._frameCount = -1;
            picture._animResetRequested = false;
        }
        if (picture._loopMode) {
            if (picture._fixedFrame) {
                this._frameCount = picture._fixedFrame;
            } else {
                this._frameCount++;
                if (this._frameCount > (picture._frames - 1)) {
                    this.onAnimationCycleFinished();
                }
            }
            //- setFrame set the bitmap box of a sprite
            var nbrFrames = picture._frames;
            var nbrLines = picture._lines;
            //- Width and Height of an individual box
            var w = Math.floor(this.bitmap.width / nbrFrames);
            var h = Math.floor(this.bitmap.height / nbrLines);
            //- x is based of _frameCount, which evoluate from 0 to the maximum number of frames
            //- minus 1.
            var x = this._frameCount * w;
            //- y is based on the line position of the picture
            var y = picture._linePos * h;
            this.setFrame(x, y, w, h);
        }
        //- Animation loop
        setTimeout(this.updateBitmapFrame.bind(this),
            picture._delay);
    }
};

//- Called when the frame counter reach the maximum number of frames
Sprite_Picture.prototype.onAnimationCycleFinished = function () {
    var picture = this.picture();
    if (picture._loopMode === "cycle") {
        picture._loopMode = "";
        this._frameCount = (picture._frames - 1);
    } else {
        this._frameCount = 0;
    }
};

Sprite_Picture.prototype.loadBitmap = function () {
    this.bitmap = ImageManager.loadPicture(this._pictureName);
    this.bitmap.addLoadListener(function () {
        this.initializeAnimatedBitmap();
    }.bind(this));
};