/**
 * @file 开始画面层
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/7
 * @class TitleLayer
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos'
    ],
    function (cc) {

        // 相对于中央点的位置
        var CIRCLE_X = -203;
        var CIRCLE_Y = 0;
        var WAR_X = 292;
        var WAR_Y = 0;

        /* // 竖版的位置
         CIRCLE_X = 0;
         CIRCLE_Y = -141;
         WAR_X = 89;
         WAR_Y = 139;
         */

        return cc.Layer.extend({
            ctor:function () {
                this._super();

                this.isAnimationFinished = false;
                this.finishCallbackFn = function () {};
                this.finishCallbackFnThisArg = undefined;

                this.titleCircle = new cc.Sprite('res/title-circle.png');
                this.titleWar = new cc.Sprite('res/title-war.png');
                this.addChild(this.titleCircle, 11);
                this.addChild(this.titleWar, 12);

                this.flashBg = new cc.LayerColor(new cc.Color(128, 128, 128));
                this.flashBg.setVisible(false);
                this.addChild(this.flashBg);

                this.playAnimation();

                var me = this;
                cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (keyCode) {
                        me.skipAnimation();
                    }
                }, this);
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseDown: function () {
                        me.skipAnimation();
                    }
                }, this);

            },

            playAnimation:function () {
                var winSize = cc.director.getWinSize();

                var titleCircleSize = this.titleCircle.getContentSize();
                var titleWarSize = this.titleWar.getContentSize();

                this.titleCircle.setPosition(0 - titleCircleSize.width, winSize.height / 2 + CIRCLE_Y);
                this.titleWar.setPosition(winSize.width + titleWarSize.width, winSize.height / 2 + WAR_Y);

                this.titleCircle.runAction(cc.moveTo(0.3, winSize.width / 2 + CIRCLE_X, winSize.height / 2 + CIRCLE_Y));
                this.titleWar.runAction(cc.moveTo(0.3, winSize.width / 2 + WAR_X, winSize.height / 2 + WAR_Y));
                this.flashBg.runAction(cc.sequence([
                    cc.delayTime(0.3),
                    cc.show(),
                    cc.blink(0.5, 5),
                    cc.hide()
                ]));
                this.runAction(cc.sequence([
                    cc.delayTime(1),
                    cc.moveTo(0.4, 0, winSize.height * 0.25),
                    cc.delayTime(0.3),
                    cc.callFunc(function () {
                        this.isAnimationFinished = true;
                        if (typeof this.finishCallbackFn === 'function') {
                            this.finishCallbackFn.call(this.finishCallbackFnThisArg);
                        }
                    }, this)
                ]));
            },

            skipAnimation:function () {
                if (this.isAnimationFinished) {
                    return;
                }
                var winSize = cc.director.getWinSize();

                this.titleCircle.cleanup();
                this.titleWar.cleanup();
                this.flashBg.cleanup();
                this.cleanup();

                this.titleCircle.setPosition(winSize.width / 2 + CIRCLE_X, winSize.height / 2 + CIRCLE_Y);
                this.titleWar.setPosition(winSize.width / 2 + WAR_X, winSize.height / 2 + WAR_Y);
                this.flashBg.setVisible(false);

                this.setPosition(0, winSize.height * 0.25);

                this.isAnimationFinished = true;
                if (typeof this.finishCallbackFn === 'function') {
                    this.finishCallbackFn.call(this.finishCallbackFnThisArg);
                }
            },

            finishCallback:function (cb, thisArg) {
                if (this.isAnimationFinished) {
                    cb.call(thisArg);
                } else {
                    this.finishCallbackFn = cb;
                    this.finishCallbackFnThisArg = thisArg;
                }
            }
        });
    }
);
