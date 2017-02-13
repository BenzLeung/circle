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

            ctor     :function () {
                this._super();

                var me = this;
                var keyListener = cc.EventListener.create({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (keyCode) {
                        if (!me.isInit) {
                            me.initGame();
                            return;
                        }
                        if (keyCode === cc.KEY.enter) {
                            if (me.isOver) {
                                me.resetGame();
                            }
                            if (me.isPaused) {
                                me.resumeGame();
                            } else {
                                me.pauseGame();
                            }
                        }
                    }
                });
                cc.eventManager.addListener(keyListener, this);

                if (cc.sys.capabilities['touches']) {
                    var touchListener = cc.EventListener.create({
                        prevTouchId: -1,
                        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                        moveFrameCount: 0,
                        tipsHasShown: false,
                        onTouchesBegan:function () {
                            if (!me.isInit) {
                                me.initGame();
                            }
                        },
                        onTouchesMoved:function (touches, event) {
                            if (me.isPaused || me.isOver) {
                                return;
                            }
                            var touch = touches[0];
                            if (this.prevTouchId != touch.getID()) {
                                this.prevTouchId = touch.getID();
                            } else {
                                var touchPos = touch.getLocation();

                                // 若移动20帧，手指都在主角之上，则显示提示，提示手指不需要挡住主角
                                if (!this.tipsHasShown) {
                                    if (this.moveFrameCount >= 20) {
                                        var myRect = me.myCircle.getBoundingBox();
                                        // 把判断区域扩大一点以容错
                                        myRect.x -= 50;
                                        myRect.y -= 50;
                                        myRect.width += 50;
                                        myRect.height += 50;
                                        if (cc.rectContainsPoint(myRect, touchPos)) {
                                            me.fingerTipsLabel.setVisible(true);
                                            me.fingerTipsLabel.runAction(cc.sequence([cc.delayTime(2), cc.fadeOut(3)]));
                                        }
                                        this.tipsHasShown = true;
                                    } else {
                                        this.moveFrameCount ++;
                                    }

                                }

                                // 若控制主角时手指要移出屏幕了，则显示提示
                                var myPos = me.myCircle.getPosition();
                                if (touchPos.y <= cc.visibleRect.bottom.y + 50 && myPos.y > cc.visibleRect.bottom.y + 100) {
                                    var tipsPos = cc.p(touchPos.x, cc.visibleRect.bottom.y + 100);
                                    var tipsSize = me.fingerOutLabel.getContentSize();
                                    if (tipsPos.x + tipsSize.width / 2 > cc.visibleRect.right.x) {
                                        tipsPos.x = cc.visibleRect.right.x - tipsSize.width / 2;
                                    }
                                    if (tipsPos.x - tipsSize.width / 2 < cc.visibleRect.left.x) {
                                        tipsPos.x = cc.visibleRect.left.x + tipsSize.width / 2;
                                    }
                                    me.fingerOutLabel.setPosition(tipsPos);
                                    me.fingerOutLabel.setVisible(true);
                                    me.fingerOutLabel.cleanup();
                                    me.fingerOutLabel.runAction(
                                        cc.sequence(
                                            [
                                                cc.repeat(
                                                    cc.sequence(
                                                        [cc.tintTo(0.1, 255, 255, 255), cc.tintTo(0.1, 255, 0, 0)]
                                                    ), 5
                                                ),
                                                cc.delayTime(3),
                                                cc.hide()
                                            ]
                                        )
                                    );
                                } else {
                                    me.fingerOutLabel.setVisible(false);
                                }
                            }
                        }
                    });
                    cc.eventManager.addListener(touchListener, this);
                }

                var winSize = cc.director.getWinSize();

                this.scoreLabel = new cc.LabelTTF(i18n('Score: ') + '0', i18n.defaultFont, 40);
                var scoreColor = new cc.Color(0, 255, 0);
                this.scoreLabel.setPosition(winSize.width / 2, winSize.height - cc.visibleRect.bottom.y - 100);
                this.scoreLabel.setColor(scoreColor);
                this.addChild(this.scoreLabel, 1);

                this.myCircle = new MasterCircle();
                this.addChild(this.myCircle, 5);

                // guideLabel
                if (cc.sys.isMobile && cc.sys.capabilities['touches']) {
                    this.guideLabel = new cc.LabelTTF(i18n(
                            'Drag on touch screen to control the main circle, ' +
                            'let it collect the red circles ' +
                            'and don\'t touch the other circles.'),
                        i18n.defaultFont, 40, cc.size(cc.visibleRect.width - 60, 0), cc.TEXT_ALIGNMENT_CENTER);
                } else {
                    this.guideLabel = new cc.LabelTTF(i18n(
                            'Using arrow keys in keyboard to control the main circle, ' +
                            'let it collect the red circles ' +
                            'and don\'t touch the other circles.'),
                        i18n.defaultFont, 40, cc.size(winSize.width / 2, 0), cc.TEXT_ALIGNMENT_CENTER);
                }
                this.guideLabel.setPosition(winSize.width / 2, winSize.height / 2 - 100);
                this.guideLabel.setColor(new cc.Color(255, 255, 255));
                this.guideLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                this.addChild(this.guideLabel, 100);

                // tips label for finger
                if (cc.sys.capabilities['touches']) {
                    this.fingerTipsLabel = new cc.LabelTTF(i18n(
                        'Tips: Your finger don\'t need to cover the main circle. ' +
                        'You can control it anywhere.'),
                        i18n.defaultFont, 40, cc.size(cc.visibleRect.width - 60, 0), cc.TEXT_ALIGNMENT_CENTER);
                    this.fingerTipsLabel.setPosition(winSize.width / 2, winSize.height - cc.visibleRect.bottom.y - 200);
                    this.fingerTipsLabel.setColor(new cc.Color(128, 128, 128));
                    this.fingerTipsLabel.setVisible(false);
                    this.addChild(this.fingerTipsLabel, 1);
                }

                // tips label for finger out of screen
                if (cc.sys.capabilities['touches']) {
                    this.fingerOutLabel = new cc.LabelTTF(i18n('Out of screen!'),
                        i18n.defaultFont, 40);
                    this.fingerOutLabel.setColor(new cc.Color(255, 0, 0));
                    this.fingerOutLabel.setVisible(false);
                    this.addChild(this.fingerOutLabel, 1);
                }

                return true;
            },
            initGame: function () {
                var winSize = cc.director.getWinSize();

                var i;
                var tmp;
                this.redCircle = [];
                this.enemyCircle = [];
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
                this.pauseLabel.setPosition(winSize.width / 2, winSize.height / 2);
                this.pauseLabel.setColor(new cc.Color(128, 255, 128));
                this.pauseLabel.enableStroke(new cc.Color(10, 10, 10), 3);
                this.addChild(this.pauseLabel, 100);
                this.pauseLabel.setVisible(false);
                this.gameOverLabel = new cc.LabelTTF('Game Over', 'Arial Black', 100);
                this.gameOverLabel.setPosition(winSize.width / 2, winSize.height / 2 + 100);
                this.gameOverLabel.setColor(new cc.Color(128, 255, 128));
                this.gameOverLabel.enableStroke(new cc.Color(10, 10, 10), 3);
                this.addChild(this.gameOverLabel, 100);
                this.gameOverLabel.setVisible(false);
                this.finalScoreLabel = new cc.LabelTTF(i18n('Your score: ') + '0', i18n.defaultFont, 50);
                this.finalScoreLabel.setPosition(winSize.width / 2, winSize.height / 2);
                this.finalScoreLabel.setColor(new cc.Color(255, 255, 255));
                this.finalScoreLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                this.addChild(this.finalScoreLabel, 100);
                this.finalScoreLabel.setVisible(false);
                this.guideLabel.setVisible(false);

                // qrcode if in mobile
                this.qrcode = new cc.Sprite('res/qrcode.png');
                if (cc.sys.isMobile) {
                    this.qrcode.setPosition(winSize.width / 2, cc.visibleRect.bottom.y + this.qrcode.getContentSize().height / 2 + 50);
                    this.qrcode.setVisible(false);
                    this.addChild(this.qrcode, 100);
                }

                // menu when game over
                var replayLabel = new cc.LabelTTF(i18n('Play again'), i18n.defaultFont, 50);
                replayLabel.setColor(new cc.Color(0, 255, 0));
                replayLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                var replayItem = new cc.MenuItemLabel(replayLabel, this.resetGame, this);
                var exitLabel = new cc.LabelTTF(i18n('Back to Main menu'), i18n.defaultFont, 50);
                exitLabel.setColor(new cc.Color(0, 255, 0));
                exitLabel.enableStroke(new cc.Color(10, 10, 10), 2);
                var exitItem = new  cc.MenuItemLabel(exitLabel, this.exitGame, this);
                this.replayMenu = new cc.Menu(replayItem, exitItem);
                this.replayMenu.setPosition(winSize.width / 2, cc.visibleRect.height * 0.375 + cc.visibleRect.bottom.y);
                this.replayMenu.alignItemsVerticallyWithPadding(15);
                this.replayMenu.setVisible(false);
                this.addChild(this.replayMenu, 100);

                this.isInit = true;

                // 百度统计
                if (window['_hmt']) {
                    window['_hmt'].push(['_trackEvent', 'circleWar' + (cc.sys.isMobile ? 'Mobile' : 'Desktop'), 'playStart']);
                }
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

                this.gameOverLabel.setVisible(false);
                this.finalScoreLabel.setVisible(false);
                this.guideLabel.setVisible(false);
                this.replayMenu.setVisible(false);
                this.qrcode.setVisible(false);
                this.isOver = false;
                this.resumeGame();

                // 百度统计
                if (window['_hmt']) {
                    window['_hmt'].push(['_trackEvent', 'circleWar' + (cc.sys.isMobile ? 'Mobile' : 'Desktop'), 'playStart']);
                }

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
                this.pauseLabel.setVisible(true);
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
                this.pauseLabel.setVisible(false);
                this.isPaused = false;
            },
            gameOver:function () {
                this.finalScoreLabel.setString(i18n('Your score: ') + this.score);
                this.gameOverLabel.setVisible(true);
                this.finalScoreLabel.setVisible(true);
                this.replayMenu.setVisible(true);
                this.qrcode.setVisible(true);
                this.myCircle.setDisplayFrame(this.myCircle.lostFrame);

                var i, len;
                this.myCircle.pause();
                for (i = 0, len = this.enemyCircle.length; i < len; i ++) {
                    this.enemyCircle[i].pause();
                }
                for (i = 0, len = this.redCircle.length; i < len; i ++) {
                    this.redCircle[i].pause();
                }

                document.title = i18n('I got %d points in Circle War!').replace('%d', this.score + '');

                // 百度统计
                if (window['_hmt']) {
                    window['_hmt'].push(['_trackEvent', 'circleWar' + (cc.sys.isMobile ? 'Mobile' : 'Desktop'), 'playFinish', this.score + '', this.score]);
                }

                this.isOver = true;
            },
            exitGame:function () {
                require(['scenes/titleScene'], function (TitleScene) {
                    cc.director.runScene(new cc.TransitionFade(0.1, new TitleScene()));
                });
            },
            checkCirclesHit:function (objCircle1, objCircle2) {
                var circle1 = {
                    p: objCircle1.getPosition(),
                    r: objCircle1.getBoundingBox().width / 2
                };
                var circle2 = {
                    p: objCircle2.getPosition(),
                    r: objCircle2.getBoundingBox().width / 2
                };
                var d = cc.pDistance(circle1.p, circle2.p);
                return (d < circle1.r + circle2.r);
            },
            update:function () {
                var i, len;
                var tmp;
                if (this.isInit && !this.isOver && !this.isPaused) {
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

            }
        });
    }
);