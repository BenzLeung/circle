/**
 * @file 游戏标题
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/7
 * @class TitleScene
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos',
        'layers/titleLayer'
    ],
    function (cc, TitleLayer) {
        return cc.Scene.extend({
            ctor:function () {
                this._super();

                var bg = new cc.LayerColor(cc.color.BLACK);
                this.addChild(bg, 1);

                var menu = new TitleLayer();
                this.addChild(menu, 2);
            }
        });
    }
);
