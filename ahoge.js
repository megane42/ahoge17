enchant();

const FPS = 30;
const WIDTH = 480;
const HEIGHT = 480;
const IMG_LIST = ['./croquette2.png', './pluto2.png', './croquette1.png', './pluto1.png', './left.png', './right.png'];

var nowShowing = "";
var score = 0;
var resultTime = 0;

window.onload = function () {

    var game = new Core(WIDTH, HEIGHT);
    game.fps = FPS;
    game.preload.apply(game, IMG_LIST);

    game.onload = function() {
        var titleScene = new Scene();
        var playScene = new Scene();
        var resultScene = new Scene();
        titleScene.backgroundColor = "black";
        playScene.backgroundColor = "black";
        resultScene.backgroundColor = "black";

        // title scene ----------------------------------------

        var titleLabel = new Label("Croquette or Pluto");
        titleLabel.textAlign = "center";
        titleLabel.font = "32px Contrail One";
        titleLabel.color = 'white';
        moveRelative(titleLabel, 0.5, 0.2);
        titleScene.addChild(titleLabel);

        var titleButton = new Button("Start", "light", 32, 80);
        titleButton.font = "24px Contrail One";
        titleButton.ontouchend = function() {
            lastActionFrame = game.frame;
            game.replaceScene(playScene);
        }
        moveRelative(titleButton, 0.5, 0.8);
        titleScene.addChild(titleButton);

        var titleCroquette = new Sprite(256, 256);
        titleCroquette.image = game.assets[IMG_LIST[2]];
        titleCroquette.scale(0.6, 0.6);
        moveRelative(titleCroquette, 0.3, 0.5);
        titleScene.addChild(titleCroquette);

        var titlePlute = new Sprite(256, 256);
        titlePlute.image = game.assets[IMG_LIST[3]];
        titlePlute.scale(0.6, 0.6);
        moveRelative(titlePlute, 0.7, 0.5);
        titleScene.addChild(titlePlute);

        // play scene ----------------------------------------

        var firstFrame = 0;
        playScene.onenter = function () {
            firstFrame = game.frame;
        }

        var timerLabel = new Label();
        timerLabel.color = 'white';
        timerLabel.onenterframe = function () {
            timerLabel.text = ((game.frame - firstFrame) / FPS).toFixed(2);
        }
        playScene.addChild(timerLabel);

        var scoreLabel = new Label();
        scoreLabel.color = 'white';
        scoreLabel.onenterframe = function () {
            scoreLabel.text = score + ' / 10';
            if (score >= 10) {
                score = 0;
                resultTime = ((game.frame - firstFrame) / FPS).toFixed(2);
                game.replaceScene(resultScene);
            }
        }
        moveRelative(scoreLabel, 0.75, 0.0);
        playScene.addChild(scoreLabel);

        var stuff = croquetteOrPluto(game)
        playScene.addChild(croquetteOrPluto(game));

        var left = new Sprite(100, 100);
        left.image = game.assets[IMG_LIST[4]];
        playScene.onleftbuttondown = function () {
            if (nowShowing.match(/croquette/)) {
                score += 1;
            } else {
                score -= 1;
            }
            playScene.removeChild(stuff);
            stuff = croquetteOrPluto(game);
            playScene.addChild(stuff);
        };
        moveRelative(left, 0.2, 0.8);
        playScene.addChild(left);

        var right = new Sprite(100, 100);
        right.image = game.assets[IMG_LIST[5]];
        playScene.onrightbuttondown = function () {
            if (nowShowing.match(/pluto/)) {
                score += 1;
            } else {
                score -= 1;
            }
            playScene.removeChild(stuff);
            stuff = croquetteOrPluto(game);
            playScene.addChild(stuff);
        }
        moveRelative(right, 0.8, 0.8);
        playScene.addChild(right);

        // result scene ----------------------------------------
        var resultLabel = new Label("Result");
        resultLabel.textAlign = "center";
        resultLabel.font = "32px Contrail One";
        resultLabel.color = 'white';
        moveRelative(resultLabel, 0.5, 0.2);
        resultScene.addChild(resultLabel);

        var resultTimeLabel = new Label();
        resultTimeLabel.text = String(resultTime);
        resultTimeLabel.textAlign = "center";
        resultTimeLabel.font = "48px Contrail One";
        resultTimeLabel.color = 'white';
        moveRelative(resultTimeLabel, 0.5, 0.5);
        resultScene.addChild(resultTimeLabel);

        var retryButton = new Button("Restart", "light", 32, 80);
        retryButton.font = "24px Contrail One";
        retryButton.ontouchend = function() {
            lastActionFrame = game.frame;
            game.replaceScene(playScene);
        }
        moveRelative(retryButton, 0.3, 0.8);
        resultScene.addChild(retryButton);

        var tweetButton = new Button("Tweet", "light", 32, 80);
        tweetButton.font = "24px Contrail One";
        tweetButton.ontouchend = tweet;
        moveRelative(tweetButton, 0.7, 0.8);
        resultScene.addChild(tweetButton);

        resultScene.onenter = function () {
            resultTimeLabel.text = resultTime + ' Sec.';
        }

        //  --------------------------------------------------
        game.pushScene(titleScene);
    };
    game.start();
};

function moveRelative (obj, x, y) {
    obj.x = x * WIDTH - obj.width * 0.5;
    obj.y = y * HEIGHT - obj.height * 0.5;
}

function croquetteOrPluto (game) {
    var stuff = new Sprite(256, 256);
    nowShowing = IMG_LIST[Math.floor(Math.random()*2)];
    stuff.image = game.assets[nowShowing];
    moveRelative(stuff, 0.5, 0.4);
    return stuff;
}

function tweet(){
    var score = resultTime;
    var t = encodeURIComponent("私はコロッケと冥王星を見分けるのに " + score + " 秒かかりました。 #コロッケと冥王星を見極めるゲーム #ahoge");
    var f = "http://twitter.com/intent/tweet?url=" + location.href + "&text=" + t;
    window.open(f, "null");
}