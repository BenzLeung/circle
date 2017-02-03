/**
 * @file 红色（得分）的圆
 * @author liangweibin@baidu.com
 * @date 2017/2/3
 * @class RedCircle
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(['cocos', 'sprites/circles/baseCircle'], function (cc, BaseCircle) {
    return BaseCircle.extend({
        ctor: function () {
            this._super('res/circle-red.png');
        }
    });
});