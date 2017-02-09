/**
 * @file 游戏开始菜单
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/7
 * @class StartMenu
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

define(
    [
        'cocos',
        'scenes/mainScene',
        'scenes/languageScene',
        'scenes/aboutScene',
        'i18n/i18n'
    ],
    function (cc, MainScene, LanguageScene, AboutScene, i18n) {
        return cc.Menu.extend({
            ctor : function () {
                var MENU_FONT_SIZE = 50;
                var MENU_COLOR = new cc.Color(0, 255, 0);

                var startGameLabel = new cc.LabelTTF(i18n('Start Game'), i18n.defaultFont, MENU_FONT_SIZE);
                startGameLabel.setColor(MENU_COLOR);
                var startGameMenuItem = new cc.MenuItemLabel(startGameLabel, this.doStartGame, this);

                if (!cc.sys.isMobile) {
                    var fullScreenLabel = new cc.LabelTTF(i18n('Full Screen'), i18n.defaultFont, MENU_FONT_SIZE);
                    fullScreenLabel.setColor(MENU_COLOR);
                    this.fullScreenItem = new cc.MenuItemLabel(fullScreenLabel, this.doFullScreen, this);
                    if (cc.screen.fullScreen()) {
                        this.fullScreenItem.setString(i18n('Exit Full Screen'));
                    } else {
                        this.fullScreenItem.setString(i18n('Full Screen'));
                    }
                }

                var languageLabel = new cc.LabelTTF(i18n('Language'), i18n.defaultFont, MENU_FONT_SIZE);
                languageLabel.setColor(MENU_COLOR);
                var languageMenuItem = new cc.MenuItemLabel(languageLabel, this.doLanguage, this);

                var aboutLabel = new cc.LabelTTF(i18n('About'), i18n.defaultFont, MENU_FONT_SIZE);
                aboutLabel.setColor(MENU_COLOR);
                var aboutMenuItem = new cc.MenuItemLabel(aboutLabel, this.doAbout, this);

                if (cc.sys.isMobile) {
                    this._super(startGameMenuItem, languageMenuItem, aboutMenuItem);
                } else {
                    this._super(startGameMenuItem, this.fullScreenItem, languageMenuItem, aboutMenuItem);
                }

                var winSize = cc.director.getWinSize();
                this.setContentSize(winSize.width / 2, winSize.height * 0.375);
                this.setPosition(winSize.width / 2, cc.visibleRect.height * 0.3125 + cc.visibleRect.bottom.y);
                this.alignItemsVerticallyWithPadding(15);
            },

            doStartGame : function () {
                cc.LoaderScene.preload(['res/circle-red.png', 'res/circle-blue.png', 'res/me.png'], function () {
                    cc.director.runScene(new MainScene());
                }, this);
            },

            doFullScreen : function () {
                var me = this;
                if (!cc.screen.fullScreen()) {
                    cc.screen.requestFullScreen(undefined, function () {
                        if (cc.screen.fullScreen()) {
                            me.fullScreenItem.setString(i18n('Exit Full Screen'));
                        } else {
                            me.fullScreenItem.setString(i18n('Full Screen'));
                        }
                    });
                } else {
                    cc.screen.exitFullScreen();
                }
            },

            doLanguage : function () {
                cc.director.runScene(new LanguageScene());
            },

            doAbout : function () {
                cc.director.pushScene(new AboutScene());
            }
        });
    }
);
