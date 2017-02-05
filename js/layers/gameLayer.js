/**
 * @file 游戏进行中的层
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/3
 * @class GameLayer
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos',
        'sprites/circles/masterCircle',
        'sprites/circles/redCircle',
        'sprites/circles/blueCircle',
        'i18n/i18n'
    ],
    function (cc, MasterCircle, RedCircle, BlueCircle, i18n) {
        return cc.Layer.extend({
            scoreLabel : null,
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

                this.scoreLabel = new cc.LabelTTF(i18n('Score: ') + '0', i18n.defaultFont, 40);
                var scoreColor = new cc.Color(0, 255, 0);
                this.scoreLabel.setPosition(size.width / 2, size.height -100);
                this.scoreLabel.setColor(scoreColor);
                this.addChild(this.scoreLabel, 1);

                this.myCircle = new MasterCircle();
                this.addChild(this.myCircle, 5);
                this.guideLabel = new cc.LabelTTF(i18n('Using arrow keys in keyboard to control the main circle, let it collect the red circles and don\'t touch the other circles.'), i18n.defaultFont, 30);
                this.guideLabel.setPosition(size.width / 2, size.height / 2 - 100);
                this.guideLabel.setColor(new cc.Color(255, 255, 255));
                this.guideLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                this.addChild(this.guideLabel, 100);
                this.readyLabel = new cc.LabelTTF(i18n('- Press ENTER to play -'), i18n.defaultFont, 30);
                this.readyLabel.setPosition(size.width / 2, size.height / 2 - 140);
                this.readyLabel.setColor(new cc.Color(128, 255, 128));
                this.readyLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                this.addChild(this.readyLabel, 100);
                /*var flashAction = cc.RepeatForever(cc.Sequence([cc.Show(), cc.delayTime(0.5), cc.Hide(), cc.delayTime(0.5)]));
                this.readyLabel.runAction(flashAction);*/

                return true;
            },
            initGame: function () {

                var size = cc.director.getWinSize();

                var i;
                var tmp;
                for (i = 0; i < 8; i ++) {
                    tmp = new RedCircle();
                    this.redCircle.push(tmp);
                    this.addChild(tmp, 2);
                }
                for (i = 0; i < 15; i ++) {
                    tmp = new BlueCircle();
                    this.enemyCircle.push(tmp);
                    this.addChild(tmp, 3);
                }


                this.scheduleUpdate();

                this.pauseLabel = new cc.LabelTTF('- PAUSE -', 'Arial Black', 100);
                this.pauseLabel.setPosition(size.width / 2, size.height / 2);
                this.pauseLabel.setColor(new cc.Color(128, 255, 128));
                this.pauseLabel.enableStroke(new cc.Color(10, 10, 10), 3);
                this.addChild(this.pauseLabel, 100);
                this.pauseLabel.runAction(cc.hide());
                this.gameOverLabel = new cc.LabelTTF('Game Over', 'Arial Black', 60);
                this.gameOverLabel.setPosition(size.width / 2, size.height / 2 + 40);
                this.gameOverLabel.setColor(new cc.Color(128, 255, 128));
                this.gameOverLabel.enableStroke(new cc.Color(10, 10, 10), 3);
                this.addChild(this.gameOverLabel, 100);
                this.gameOverLabel.runAction(cc.hide());
                this.finalScoreLabel = new cc.LabelTTF(i18n('Your score: ') + '0', i18n.defaultFont, 30);
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
                this.scoreLabel.setString(i18n('Score: ') + 0);
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
                this.finalScoreLabel.setString(i18n('Your score: ') + this.score);
                this.readyLabel.setString(i18n('- Press ENTER to replay -'));
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
                        this.scoreLabel.setString(i18n('Score: ') + this.score);

                        if (this.score % 2 === 0) {
                            tmp = new BlueCircle();
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
    }
);