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
        'cocos',
        'layers/startMenu'
    ],
    function (cc, StartMenu) {
        return cc.Layer.extend({
            ctor:function () {
                this._super();

                var winSize = cc.director.getWinSize();

                var menu = new StartMenu();
                this.addChild(menu, 1);

                var title = new cc.LabelTTF('Circle War', 'Arial Black', 200);
                title.setColor(new cc.Color(255, 64, 64, 1));
                title.setPosition(winSize.width / 2, winSize.height * 0.75);
                this.addChild(title, 2);

                var benzLeung = new cc.LabelTTF('©Benz Leung (https://github.com/BenzLeung)', 'Tahoma', 30);
                benzLeung.setColor(new cc.Color(128, 128, 128, 1));
                benzLeung.setPosition(winSize.width / 2, 60);
                this.addChild(benzLeung, 2);
            }
        });
    }
);
