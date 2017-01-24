/**
 * @file 用于学习cocos
 * @author liangweibin@baidu.com
 * @date 2016/12/20
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

window.onload = function(){
    cc.game.onStart = function(){
        cc.LoaderScene.preload(['res/circle-red.png', 'res/circle-blue.png', 'res/me.png'], function () {

            var Circle = cc.Sprite.extend({
                speedX: 0,
                speedY: 0,
                SPEED: 200,
                ctor:function (pngName) {
                    this._super(pngName);

                    this.initPosition();
                    this.initSpeed();
                    this.scheduleUpdate();
                },
                initPosition: function () {
                    var winSize = cc.director.getWinSize();
                    var thisSize = this.getContentSize();
                    var radius = thisSize.width / 2;
                    this.setPosition(winSize.width + radius * 6, winSize.height + radius * 6);
                },
                initSpeed: function () {
                    this.speedX = cc.randomMinus1To1();
                    this.speedY = cc.randomMinus1To1();
                },
                update:function (dt) {
                    this._super(dt);
                    var winSize = cc.director.getWinSize();
                    var thisSize = this.getContentSize();
                    var radius = thisSize.width / 2;
                    var x = this.getPositionX();
                    var y = this.getPositionY();
                    x += this.speedX * this.SPEED * dt;
                    y += this.speedY * this.SPEED * dt;
                    if (x < radius) {this.speedX = Math.abs(this.speedX);}
                    if (y < radius) {this.speedY = Math.abs(this.speedY);}
                    if (x > winSize.width - radius) {this.speedX = - Math.abs(this.speedX);}
                    if (y > winSize.height - radius) {this.speedY =  - Math.abs(this.speedY);}
                    this.setPosition(x, y);
                }
            });

            var CircleMe = Circle.extend({
                normalFrame: null,
                lostFrame: null,
                SPEED: 300,
                ctor:function () {
                    this.normalFrame = new cc.SpriteFrame('res/me.png', cc.rect(0, 0, 80, 80));
                    this.lostFrame = new cc.SpriteFrame('res/me-lost.png', cc.rect(0, 0, 80, 80));
                    this._super(this.normalFrame);
                    this.initKeyboard();
                },
                initPosition: function () {
                    var winSize = cc.director.getWinSize();
                    this.setPosition(winSize.width / 2, winSize.height / 2);
                },
                initSpeed: function () {
                    this.speedX = 0;
                    this.speedY = 0;
                },
                initKeyboard: function () {
                    var me = this;
                    var keyListener = cc.EventListener.create({
                        event: cc.EventListener.KEYBOARD,
                        onKeyPressed: function (keyCode) {
                            switch (keyCode) {
                                case cc.KEY.w:
                                case cc.KEY.up:
                                    me.speedX = 0;
                                    me.speedY = 1;
                                    break;
                                case cc.KEY.s:
                                case cc.KEY.down:
                                    me.speedX = 0;
                                    me.speedY = 0 - 1;
                                    break;
                                case cc.KEY.a:
                                case cc.KEY.left:
                                    me.speedX = 0 - 1;
                                    me.speedY = 0;
                                    break;
                                case cc.KEY.d:
                                case cc.KEY.right:
                                    me.speedX = 1;
                                    me.speedY = 0;
                                    break;
                                case cc.KEY.space:
                                    me.speedX = 0;
                                    me.speedY = 0;
                                    break;
                                case cc.KEY.shift:
                                    me.SPEED = 600;
                                    break;
                            }
                        },
                        onKeyReleased: function (keyCode) {
                            switch (keyCode) {
                                case cc.KEY.shift:
                                    me.SPEED = 300;
                                    break;
                            }
                        }
                    });
                    cc.eventManager.addListener(keyListener, this);
                }
            });


            var CircleRed = Circle.extend({
                ctor: function () {
                    this._super('res/circle-red.png');
                }
            });

            var CircleBlue = Circle.extend({
                ctor: function () {
                    this._super('res/circle-blue.png');
                }
            });


            var GameLayer = cc.Layer.extend({
                scoreLabel : null,
                /**
                 * @type CircleMe
                 */
                myCircle   : null,
                redCircle  : [],
                enemyCircle: [],
                score      : 0,
                isPaused   : false,
                isOver     : false,
                isInit     : false,

                pauseLabel : null,
                gameOverLabel: null,
                finalScoreLabel: null,
                guideLabel : null,
                readyLabel : null,

                ctor     :function () {
                    this._super();

                    var me = this;
                    var keyListener = cc.EventListener.create({
                        event: cc.EventListener.KEYBOARD,
                        onKeyPressed: function (keyCode) {
                            if (keyCode === cc.KEY.enter) {
                                if (!me.isInit) {
                                    me.initGame();
                                    return;
                                }
                                if (me.isOver) {
                                    me.resetGame();
                                    me.gameOverLabel.runAction(cc.hide());
                                    me.finalScoreLabel.runAction(cc.hide());
                                    me.guideLabel.runAction(cc.hide());
                                    me.readyLabel.runAction(cc.hide());
                                }
                                if (me.isPaused) {
                                    me.resumeGame();
                                    me.pauseLabel.runAction(cc.hide());
                                } else {
                                    me.pauseGame();
                                    me.pauseLabel.runAction(cc.show());
                                }
                            }
                        }
                    });
                    cc.eventManager.addListener(keyListener, this);

                    var size = cc.director.getWinSize();

                    this.scoreLabel = new cc.LabelTTF("得分：0", "Arial Black", 40);
                    var scoreColor = new cc.Color(0, 255, 0);
                    this.scoreLabel.setPosition(size.width / 2, size.height -100);
                    this.scoreLabel.setColor(scoreColor);
                    this.addChild(this.scoreLabel, 1);

                    /*var flashAction = cc.RepeatForever(cc.Sequence([cc.Show(), cc.delayTime(0.5), cc.Hide(), cc.delayTime(0.5)]));
                     this.myLabel.runAction(flashAction);*/

                    this.myCircle = new CircleMe();
                    this.addChild(this.myCircle, 5);
                    this.guideLabel = new cc.LabelTTF("用键盘方向键或者ASDW移动主角，收集红色圈圈，躲开蓝色圈圈。", "Microsoft Yahei", 30);
                    this.guideLabel.setPosition(size.width / 2, size.height / 2 - 100);
                    this.guideLabel.setColor(new cc.Color(255, 255, 255));
                    this.guideLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                    this.addChild(this.guideLabel, 100);
                    this.readyLabel = new cc.LabelTTF("- 按Enter开始游戏 -", "Microsoft Yahei", 30);
                    this.readyLabel.setPosition(size.width / 2, size.height / 2 - 140);
                    this.readyLabel.setColor(new cc.Color(128, 255, 128));
                    this.readyLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                    this.addChild(this.readyLabel, 100);

                    return true;
                },
                initGame: function () {

                    var size = cc.director.getWinSize();

                    var i;
                    var tmp;
                    for (i = 0; i < 8; i ++) {
                        tmp = new CircleRed();
                        this.redCircle.push(tmp);
                        this.addChild(tmp, 2);
                    }
                    for (i = 0; i < 15; i ++) {
                        tmp = new CircleBlue();
                        this.enemyCircle.push(tmp);
                        this.addChild(tmp, 3);
                    }


                    this.scheduleUpdate();

                    this.pauseLabel = new cc.LabelTTF("- PAUSE -", "Arial Black", 100);
                    this.pauseLabel.setPosition(size.width / 2, size.height / 2);
                    this.pauseLabel.setColor(new cc.Color(128, 255, 128));
                    this.pauseLabel.enableStroke(new cc.Color(10, 10, 10), 3);
                    this.addChild(this.pauseLabel, 100);
                    this.pauseLabel.runAction(cc.hide());
                    this.gameOverLabel = new cc.LabelTTF("Game Over", "Arial Black", 60);
                    this.gameOverLabel.setPosition(size.width / 2, size.height / 2 + 40);
                    this.gameOverLabel.setColor(new cc.Color(128, 255, 128));
                    this.gameOverLabel.enableStroke(new cc.Color(10, 10, 10), 3);
                    this.addChild(this.gameOverLabel, 100);
                    this.gameOverLabel.runAction(cc.hide());
                    this.finalScoreLabel = new cc.LabelTTF("最后得分：0", "Microsoft Yahei", 30);
                    this.finalScoreLabel.setPosition(size.width / 2, size.height / 2 - 30);
                    this.finalScoreLabel.setColor(new cc.Color(255, 255, 255));
                    this.finalScoreLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                    this.addChild(this.finalScoreLabel, 100);
                    this.finalScoreLabel.runAction(cc.hide());
                    this.guideLabel.runAction(cc.hide());
                    this.readyLabel.runAction(cc.hide());

                    this.isInit = true;
                },
                resetGame: function () {
                    var i, len;
                    this.myCircle.initPosition();
                    this.myCircle.initSpeed();

                    for (i = 0, len = 15; i < len; i ++) {
                        this.enemyCircle[i].initPosition();
                        this.enemyCircle[i].initSpeed();
                    }
                    for (i = this.enemyCircle.length - 1, len = 15; i >= len; i --) {
                        this.enemyCircle.pop().removeFromParent(true);
                    }
                    for (i = 0, len = this.redCircle.length; i < len; i ++) {
                        this.redCircle[i].initPosition();
                        this.redCircle[i].initSpeed();
                    }
                    this.myCircle.setDisplayFrame(this.myCircle.normalFrame);

                    this.score = 0;
                    this.scoreLabel.setString("得分：0");
                    this.isOver = false;
                },
                pauseGame:function () {
                    var i, len;
                    this.myCircle.pause();
                    for (i = 0, len = this.enemyCircle.length; i < len; i ++) {
                        this.enemyCircle[i].pause();
                    }
                    for (i = 0, len = this.redCircle.length; i < len; i ++) {
                        this.redCircle[i].pause();
                    }
                    this.isPaused = true;
                },
                resumeGame:function () {
                    var i, len;
                    this.myCircle.resume();
                    for (i = 0, len = this.enemyCircle.length; i < len; i ++) {
                        this.enemyCircle[i].resume();
                    }
                    for (i = 0, len = this.redCircle.length; i < len; i ++) {
                        this.redCircle[i].resume();
                    }
                    this.isPaused = false;
                },
                gameOver:function () {
                    this.finalScoreLabel.setString('最后得分：' + this.score);
                    this.readyLabel.setString('- 按Enter重新开始 -');
                    this.gameOverLabel.runAction(cc.show());
                    this.finalScoreLabel.runAction(cc.show());
                    this.readyLabel.runAction(cc.show());
                    this.myCircle.setDisplayFrame(this.myCircle.lostFrame);

                    this.pauseGame();
                    this.isOver = true;
                },
                checkCirclesHit:function (objCircle1, objCircle2) {
                    var circle1 = {
                        p: objCircle1.getPosition(),
                        r: objCircle1.getContentSize().width / 2
                    };
                    var circle2 = {
                        p: objCircle2.getPosition(),
                        r: objCircle2.getContentSize().width / 2
                    };
                    var d = cc.pDistance(circle1.p, circle2.p);
                    return (d < circle1.r + circle2.r);
                },
                update:function () {
                    var i, len;
                    var tmp;
                    for (i = 0, len = this.redCircle.length; i < len; i ++) {
                        if (this.checkCirclesHit(this.myCircle, this.redCircle[i])) {
                            this.redCircle[i].initPosition();
                            this.score ++;
                            this.scoreLabel.setString("得分：" + this.score);

                            if (this.score % 2 === 0) {
                                tmp = new CircleBlue();
                                this.enemyCircle.push(tmp);
                                this.addChild(tmp, 3);
                            }
                        }
                    }
                    for (i = 0, len = this.enemyCircle.length; i < len; i ++) {
                        if (this.checkCirclesHit(this.myCircle, this.enemyCircle[i])) {
                            this.gameOver();
                        }
                    }
                }
            });
            var MyScene = cc.Scene.extend({
                onEnter:function () {
                    this._super();

                    var bg = new cc.LayerColor(cc.color.BLACK);
                    this.addChild(bg, 1);

                    var game = new GameLayer();
                    this.addChild(game, 2);
                }
            });
            cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);
            cc.screen.requestFullScreen();
            cc.director.runScene(new MyScene());
        }, this);
    };
    cc.game.run("gameCanvas");
    document.getElementById("gameCanvas").focus();
};