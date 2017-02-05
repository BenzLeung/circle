/**
 * @file 主要游戏场景
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/3
 * @class MainScene
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos',
        'layers/gameLayer'
    ],
    function (cc, GameLayer) {
        return cc.Scene.extend({
            onEnter:function () {
                this._super();

                var bg = new cc.LayerColor(cc.color.BLACK);
                this.addChild(bg, 1);

                var game = new GameLayer();
                this.addChild(game, 2);
            }
        });
    }
);
