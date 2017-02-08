/**
 * @file 用于标题画面的背景
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/8
 * @class DemoLayer
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos',
        'sprites/circles/redCircle',
        'sprites/circles/blueCircle'
    ],
    function (cc, RedCircle, BlueCircle) {
        return cc.Layer.extend({
            redCircle  : [],
            enemyCircle: [],

            ctor     :function () {
                this._super();

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
                return true;
            }
        });
    }
);