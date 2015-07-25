enchant();
window.onload = function () {

    const FPS    = 30;
    const WIDTH  = 480;
    const HEIGHT = 480;
    const MAX_SCORE = 10;
    const IMG_LIST  = [
        './img/croquette2.png', './img/pluto2.png',
        './img/croquette1.png', './img/pluto1.png',
        './img/left.png', './img/right.png'
    ];

    var nowShowing = "";
    var resultTime = 0;
    var score = 0;

    var game = new Core(WIDTH, HEIGHT);
    game.fps = FPS;
    game.preload.apply(game, IMG_LIST);

    game.onload = function() {
        var titleScene  = new Scene();
        var playScene   = new Scene();
        var resultScene = new Scene();
        titleScene.backgroundColor  = "black";
        playScene.backgroundColor   = "black";
        resultScene.backgroundColor = "black";

        // title scene ----------------------------------------

        var titleLabel = new Label("Croquette or Pluto");
        titleLabel.textAlign = "center";
        titleLabel.font = "40px Contrail One";
        titleLabel.color = 'white';
        titleLabel.width = titleLabel._boundWidth;
        moveCenterWithPercent(titleLabel, 0.5, 0.1);
        titleScene.addChild(titleLabel);

        var titleButton = new Button("Start", "light", 42, 120);
        titleButton.font = "32px Contrail One";
        titleButton.ontouchend = function() {
            lastActionFrame = game.frame;
            game.replaceScene(playScene);
        }
        // It seems that x = 0.48 is more proper than 0.5 for centering. Why?
        moveCenterWithPercent(titleButton, 0.48, 0.85);
        titleScene.addChild(titleButton);

        var titleCroquette = new Sprite(256, 256);
        titleCroquette.image = game.assets[IMG_LIST[2]];
        titleCroquette.scale(0.65, 0.65);
        moveCenterWithPercent(titleCroquette, 0.27, 0.5);
        titleScene.addChild(titleCroquette);

        var titlePlute = new Sprite(256, 256);
        titlePlute.image = game.assets[IMG_LIST[3]];
        titlePlute.scale(0.65, 0.65);
        moveCenterWithPercent(titlePlute, 0.73, 0.5);
        titleScene.addChild(titlePlute);

        // play scene ----------------------------------------

        var firstFrame = 0;
        playScene.onenter = function () {
            firstFrame = game.frame;
        }

        var timerLabel = new Label();
        timerLabel.font = "32px Contrail One";
        timerLabel.color = 'white';
        timerLabel.onenterframe = function () {
            timerLabel.text = ((game.frame - firstFrame) / FPS).toFixed(2);
        }
        playScene.addChild(timerLabel);

        var scoreLabel = new Label();
        scoreLabel.font = "32px Contrail One";
        scoreLabel.color = 'white';
        // TODO: Use a custom event which is triggered when the score chenges.
        scoreLabel.onenterframe = function () {
            scoreLabel.text = score + ' / ' + MAX_SCORE;

            // Set x & y manually HERE because:
            //  * scoreLabel._boundWidth changes depending on the text length.
            //  * put scoreLabel at upper right (moveCenterWithPercent() is not suitable.)
            scoreLabel.x = WIDTH - scoreLabel._boundWidth;
            scoreLabel.y = 0.0;

            if (score >= MAX_SCORE) {
                score = 0;
                resultTime = ((game.frame - firstFrame) / FPS).toFixed(2);
                game.replaceScene(resultScene);
            }
        }
        playScene.addChild(scoreLabel);

        var stuff = new Sprite(256, 256);
        croquetteOrPluto(stuff);
        moveCenterWithPercent(stuff, 0.5, 0.4);
        playScene.addChild(stuff);

        var left = new Sprite(100, 100);
        moveCenterWithPercent(left, 0.1, 0.8);
        left.image = game.assets[IMG_LIST[4]];
        left.ontouchstart = onGetLeft;
        playScene.onleftbuttondown = onGetLeft;
        playScene.addChild(left);

        var right = new Sprite(100, 100);
        moveCenterWithPercent(right, 0.9, 0.8);
        right.image = game.assets[IMG_LIST[5]];
        right.ontouchstart = onGetRight;
        playScene.onrightbuttondown = onGetRight;
        playScene.addChild(right);

        // result scene ----------------------------------------
        var resultLabel = new Label("Result");
        resultLabel.textAlign = "center";
        resultLabel.font = "32px Contrail One";
        resultLabel.color = 'white';
        moveCenterWithPercent(resultLabel, 0.5, 0.2);
        resultScene.addChild(resultLabel);

        var resultTimeLabel = new Label();
        resultTimeLabel.text = String(resultTime);
        resultTimeLabel.textAlign = "center";
        resultTimeLabel.font = "48px Contrail One";
        resultTimeLabel.color = 'white';
        moveCenterWithPercent(resultTimeLabel, 0.5, 0.5);
        resultScene.addChild(resultTimeLabel);

        var retryButton = new Button("Restart", "light", 32, 80);
        retryButton.font = "24px Contrail One";
        retryButton.ontouchend = function() {
            lastActionFrame = game.frame;
            game.replaceScene(playScene);
        }
        moveCenterWithPercent(retryButton, 0.28, 0.8);
        resultScene.addChild(retryButton);

        var tweetButton = new Button("Tweet", "light", 32, 80);
        tweetButton.font = "24px Contrail One";
        tweetButton.ontouchend = tweet;
        moveCenterWithPercent(tweetButton, 0.68, 0.8);
        resultScene.addChild(tweetButton);

        resultScene.onenter = function() {
            resultTimeLabel.text = resultTime + ' Sec.';
        }

        //  --------------------------------------------------
        function onGetLeft() {
            nowShowing.match(/croquette/) ? score += 1 : score -= 1;
            croquetteOrPluto(stuff);
        };

        function onGetRight() {
            nowShowing.match(/pluto/) ? score += 1 : score -= 1;
            croquetteOrPluto(stuff);
        }

        //  --------------------------------------------------
        game.pushScene(titleScene);
    };

    game.start();

    function moveCenterWithPercent(obj, x, y) {
        obj.x = x * WIDTH - obj.width * 0.5;
        obj.y = y * HEIGHT - obj.height * 0.5;
    }

    function croquetteOrPluto(sprite) {
        nowShowing = IMG_LIST[Math.floor(Math.random()*2)];
        sprite.image = game.assets[nowShowing];
    }

    function tweet(){
        var score = resultTime;
        var t = encodeURIComponent("私はコロッケと冥王星を見分けるのに " + score + " 秒かかりました。 #コロッケと冥王星を見極めるゲーム #ahoge");
        var f = "http://twitter.com/intent/tweet?url=" + location.href + "&text=" + t;
        window.open(f, "null");
    }
};
