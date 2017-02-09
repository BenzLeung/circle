/**
 * @file 中文语言文件
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/5
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

(function () {
    var dict = {
        'Score: ': '得分：',
        'Using arrow keys in keyboard to control the main circle, let it collect the red circles and don\'t touch the other circles.': '用键盘方向键或者ASDW移动主角，收集红色圈圈，躲开蓝色圈圈。',
        'Drag on touch screen to control the main circle, let it collect the red circles and don\'t touch the other circles.': '用触摸屏拖拽移动主角，收集红色圈圈，躲开蓝色圈圈。',
        '- Press ENTER to play -': '- 按Enter开始游戏 -',
        'Your score: ': '最后得分：',
        '- Press ENTER to replay -': '- 按Enter重新开始 -',
        'Start Game': '开始游戏',
        'Full Screen': '全屏',
        'Exit Full Screen': '退出全屏',
        'Language': '语言(Language)',
        'About': '关于',
        'Visit my Github' : '访问我的Github',
        'Visit the project\'s site' : '访问项目主页',
        '<< Go back' : '<< 返回',
        'Play again' : '再玩一次',
        'Back to Main menu' : '返回主菜单',
        'I got %d points in Circle War!' : '我在圆圈大战获得了%d分！'
    };

    dict['This is a small small small game that invented by myself. I made it for learning cocos2d-js.\n\n' +
    'There are many circles in this game. ' +
    'Using arrow keys on keyboard or drag on touch screen to control the main circle to control the main circle, ' +
    'let it collect the red circles and don\'t touch the other circles.']
        = '这是一个我自己发明的小小小游戏，开发这个游戏的目的是学习 cocos2d-js 游戏开发。\n\n' +
        '游戏里包含大量圆圈，玩家用键盘方向键或者触摸屏控制主角，收集红色圆圈、躲开其他圆圈。';

    define({
        author: {
            name: '',
            site: ''
        },
        defaultFont: 'Microsoft Yahei',
        dictionary: dict
    });
})();
