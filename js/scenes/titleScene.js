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
        'layers/titleLayer',
        'layers/startMenu',
        'layers/demoLayer'
    ],
    function (cc, TitleLayer, StartMenu, DemoLayer) {
        return cc.Scene.extend({
            ctor:function () {
                this._super();

                var winSize = cc.director.getWinSize();

                var bg = new cc.LayerColor(cc.color.BLACK);
                this.addChild(bg, 1);

                var title = new TitleLayer();
                this.addChild(title, 3);

                title.finishCallback(function () {
                    var menu = new StartMenu();
                    this.addChild(menu, 5);

                    var benzLeung = new cc.LabelTTF('©Benz Leung (https://github.com/BenzLeung)', 'Tahoma', 30);
                    benzLeung.setColor(new cc.Color(128, 128, 128, 1));
                    benzLeung.setPosition(winSize.width / 2, 60);
                    this.addChild(benzLeung, 3);

                    var demoLayer = new DemoLayer();
                    this.addChild(demoLayer, 2);
                }, this);
            }
        });
    }
);
