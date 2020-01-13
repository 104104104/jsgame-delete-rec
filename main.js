/*
 * シンプルな風船割りゲーム
 */

phina.globalize(); // おまじない(phina.jsをグローバルに展開)


// 定数
const RECTANGLE_DIAMETER = 60; // 正方形の一辺の長さ
const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅

var SCORE = 0; //スコアはグローバルで管理する(その方が簡単なので…)

/*
 * 四角の定義
 */
phina.define('Rec', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.fill = 'red'; // 四角の塗りつぶし色
        this.stroke = 'red'; // 四角のふちの色
        this.width = RECTANGLE_DIAMETER; //四角の縦幅
        this.height = RECTANGLE_DIAMETER; //四角の横幅

        //四角をクリックできるようにする
        this.setInteractive(true); //四角をクリック可能に

        this.onpointstart = () => { //クリックが始まった瞬間の処理
            SCORE += 1; //スコアを1追加
            this.remove();
        };
    },


    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var p = app.pointer; //マウスの情報を取得

        //マウスから、四角がじわじわ離れていく
        var speed = 2; //四角の動く速度
        var recCenterX = this.x + RECTANGLE_DIAMETER / 2; //四角の中心のx座標
        var recCenterY = this.y + RECTANGLE_DIAMETER / 2; //四角の中心のy座標

        if (p.x <= recCenterX && p.y >= recCenterY) { //マウスの右上に、四角がある時
            this.x += speed;
            this.y -= speed;
        } else if (p.x < recCenterX && p.y < recCenterY) { //マウスの右下に、四角がある時
            this.x += speed;
            this.y += speed;
        } else if (p.x > recCenterX && p.y > recCenterY) { //マウスの左上に、四角がある時
            this.x -= speed;
            this.y -= speed;
        } else { //マウスの左下に、四角がある時
            this.x -= speed;
            this.y += speed;
        }
    },
});


/*
 * スコア表示用Labalの定義
 */
phina.define('scoreLabel', {
    superClass: 'Label',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.text = "0"; //最初のtextは 0
        this.fontsize = 64; //フォントの大きさ
        this.x = DISPLAY_WIDTH / 2; //表示位置(x座標)
        this.y = DISPLAY_HEIGHT - (DISPLAY_HEIGHT / 9); //表示位置(y座標)
        this.fill = '#111'; //文字の色
    },


    //毎フレームごとに、どうふるまうか
    update: function(app) {
        this.text = SCORE; //textに現在のSCOREを代入
    }
});


/*
 * ゲームのメインシーンの定義
 */
phina.define("MainScene", {
    superClass: 'DisplayScene',

    // 初期化
    init: function() {
        this.superInit(); //初期化のおまじない

        this.backgroundColor = '#1ee'; // 背景色

        //score表示用Labelを、シーンに追加
        scoreLabel({}).addChildTo(this);

        // グループを生成
        this.recGroup = DisplayElement().addChildTo(this);
    },


    //毎フレームごとに、どう振る舞うか
    update: function(app) {
        if (app.frame % 30 == 0) { //1秒に一回、四角を追加する

            var tempRec = Rec({}); //tempRecに四角を一旦代入し、初期値を設定する
            tempRec.x = getRandomInt(DISPLAY_WIDTH); //表示位置(x座標)を画面内でランダムに設定する
            tempRec.y = getRandomInt(DISPLAY_HEIGHT); //表示位置(y座標)を画面内でランダムに設定する

            tempRec.addChildTo(this.recGroup); //グループに追加する

            console.log(SCORE); //コンソールに、1秒に一回SCOREを表示
        }
    },

    onkeydown: function(e) { //スペースキーが押されると、強制終了
        if (e.keyCode === 32) { //32がスペースキー
            this.app.stop();
        }
    },
});


/*
 * メイン処理
 */
phina.main(function() {
    // アプリケーションを生成
    var app = GameApp({
        startLabel: 'main', // MainScene から開始
        width: DISPLAY_WIDTH, //画面の横幅
        height: DISPLAY_HEIGHT, //画面の縦幅
        fps: 30, //fps
    });

    // 実行
    app.run();
});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}