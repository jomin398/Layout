var client;
(() => {
    client = new class client {
        constructor() {
            this.app = null;
            this.doc = null;
            this.elmMgr = new elmMgr();
            this.soundEl = null;
            this.display = [];
            this.asset={
                preload:{audio:[
                    'Theme_01.ogg',
                    'Theme_02.ogg'
                ]}
            }
        }
        init() {
            console.log('init')
            window.addEventListener('load', this.onloadPage.bind(this));
        };
        loader(onload){
            
        }
        onloadPage() {
            const d = document;
            const clickStart = ()=>{
                let n = Math.floor(Math.random() * 2);
                console.log(n)
                this.soundEl.src = `./asset/blue/audio/${this.asset.preload.audio[n]}`;
                this.soundEl.addEventListener("load", function() {
                    this.soundEl.play();
                });
                this.soundEl.load();
                
                this.display[1].style.backgroundImage='url(./asset/blue/bg/CaffeeBG.png)';
                console.log('hi')
            };
            this.doc = d;
            this.app = new PIXI.Application();
            this.soundEl = d.body.querySelector('audio.mein#bgm');
            this.display.push(this.app.view);
            this.display.push(this.elmMgr.makecover((() => {
                let b = this.elmMgr.makeButton('clickMe');
                b.className = 'clickMe';
                b.onclick = () => {
                    b.remove();
                    clickStart()};
                return b;
            })(), { className: 'meinCover' }))
            d.body.append(this.display[0]);
            d.body.append(this.display[1]);
            
            // let app = null;


            // let tstyle = { fontFamily: 'Arial', fontSize: 24, fill: 'white', align: 'center' };
            // let text = new PIXI.Text('This is a PixiJS text',tstyle);
            // //text.updateText();
            // //text to center.
            // // text.anchor.set(0.5);
            // let pos={center:(app.view.width/2 - (text.width/4)),left:0}; 
            // text.x = pos.center;
            // text.y = app.view.height - text.height;
            // app.stage.addChild(text);

            // //stage.removeChild
            // console.log(app.stage.children)

            // text.text = 'download....';
            // text.updateText();
        }
    };
    client.init();
    return client;
})(client = {})