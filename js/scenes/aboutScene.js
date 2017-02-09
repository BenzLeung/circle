/**
 * @file 关于游戏
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/7
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos',
        'i18n/i18n'
    ],
    function (cc, i18n) {
        return cc.Scene.extend({
            ctor:function () {
                this._super();

                var bg = new cc.LayerColor(cc.color.BLACK);
                this.addChild(bg, 1);

                var winSize = cc.director.getWinSize();

                var about = new cc.LabelTTF(
                    i18n('This is a small small small game that invented by myself. I made it for learning cocos2d-js.\n\n' +
                    'There are many circles in this game. ' +
                    'Using arrow keys on keyboard or drag on touch screen to control the main circle, ' +
                    'let it collect the red circles and don\'t touch the other circles.'),
                    i18n.defaultFont, 50, cc.size(cc.visibleRect.width - 100, 0), cc.TEXT_ALIGNMENT_CENTER);
                about.setPosition(winSize.width / 2, winSize.height * 0.6875);
                //about.setContentSize(winSize.width / 2, winSize.height * 0.375);
                about.setColor(new cc.Color(192, 192, 192, 1));
                bg.addChild(about, 1);


                var MENU_FONT_SIZE = 50;
                var MENU_COLOR = new cc.Color(0, 255, 0);

                var benzLeung = new cc.LabelTTF(i18n('Visit my Github'), i18n.defaultFont, MENU_FONT_SIZE);
                benzLeung.setColor(MENU_COLOR);
                var benzLeungMenuItem = new cc.MenuItemLabel(benzLeung, function () {
                    window.open('https://github.com/BenzLeung');
                });

                var site = new cc.LabelTTF(i18n('Visit the project\'s site'), i18n.defaultFont, MENU_FONT_SIZE);
                site.setColor(MENU_COLOR);
                var siteMenuItem = new cc.MenuItemLabel(site, function () {
                    window.open('https://github.com/BenzLeung/circle');
                });

                var goBack = new cc.LabelTTF(i18n('<< Go back'), i18n.defaultFont, MENU_FONT_SIZE);
                goBack.setColor(MENU_COLOR);
                var goBackMenuItem = new cc.MenuItemLabel(goBack, function () {
                    cc.director.popScene();
                });

                var menu = new cc.Menu(siteMenuItem, benzLeungMenuItem, goBackMenuItem);
                menu.setContentSize(winSize.width / 2, winSize.height / 2);
                menu.setPosition(winSize.width / 2, winSize.height / 4);
                menu.alignItemsVerticallyWithPadding(15);

                bg.addChild(menu);
            }
        });
    }
);
