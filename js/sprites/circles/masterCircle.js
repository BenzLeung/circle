/**
 * @file 您所控制的主角圆
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/3
 * @class MasterCircle
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(['cocos', 'sprites/circles/baseCircle'], function (cc, BaseCircle) {
    return BaseCircle.extend({
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
});