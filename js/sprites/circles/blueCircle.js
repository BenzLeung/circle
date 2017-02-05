/**
 * @file 蓝色（敌人）的圆
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/3
 * @class BlueCircle
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(['cocos', 'sprites/circles/baseCircle'], function (cc, BaseCircle) {
    return BaseCircle.extend({
        ctor: function () {
            this._super('res/circle-blue.png');
        }
    });
});