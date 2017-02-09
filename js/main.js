/**
 * @file 用于学习cocos
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2016/12/20
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

require(['cocos', 'scenes/titleScene'], function (cc, TitleScene) {

    cc.game.config = {
        "debugMode"     : 0,
        "frameRate"     : 60,
        "showFPS"       : false,
        "id"            : "gameCanvas",
        "renderMode"    : 1
    };

    cc.game.onStart = function(){
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.NO_BORDER);
        } else {
            cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.SHOW_ALL);
        }
        cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);
        cc.view.resizeWithBrowserSize(true);
        cc.LoaderScene.preload(['res/title-circle.png', 'res/title-war.png', 'res/circle-red.png', 'res/circle-blue.png', 'res/me.png'], function () {
            cc.director.runScene(new TitleScene());
        }, this);
    };

    cc.game.run("gameCanvas");
    document.getElementById("gameCanvas").focus();

});
