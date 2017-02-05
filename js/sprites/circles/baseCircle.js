/**
 * @file 基本的圈
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/3
 * @class BaseCircle
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(['cocos'], function (cc) {
    return cc.Sprite.extend({
        speedX: 0,
        speedY: 0,
        SPEED: 200,
        ctor: function (pngName) {
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
        update: function (dt) {
            this._super(dt);
            var winSize = cc.director.getWinSize();
            var thisSize = this.getContentSize();
            var radius = thisSize.width / 2;
            var x = this.getPositionX();
            var y = this.getPositionY();
            x += this.speedX * this.SPEED * dt;
            y += this.speedY * this.SPEED * dt;
            if (x < radius) {
                this.speedX = Math.abs(this.speedX);
            }
            if (y < radius) {
                this.speedY = Math.abs(this.speedY);
            }
            if (x > winSize.width - radius) {
                this.speedX = -Math.abs(this.speedX);
            }
            if (y > winSize.height - radius) {
                this.speedY = -Math.abs(this.speedY);
            }
            this.setPosition(x, y);
        }
    });
});