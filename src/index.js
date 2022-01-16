var client;
(() => {
    client = new class client {
        constructor() {
            this.app = null;
            this.doc = null;
            this.elmMgr = new elmMgr();
            this.reqMgr = new requester();
            this.soundEl = null;
            this.display = [];
            this.asset = {
                preload: {
                    audio: [
                        'Theme_01.ogg',
                        'Theme_02.ogg'
                    ]
                }
            }
        }
        init() {
            window.onload = () => {
                const d = document;
                this.doc = d.body.querySelector('.main_client');
                //append theme cssfile;
                d.head.append((() => {
                    let c = d.createElement('link');
                    c.rel = 'stylesheet';
                    c.href = './asset/blue/css/index.css';
                    return c;
                })());
                this.app = new PIXI.Application();
                this.soundEl = d.body.querySelector('audio.mein#bgm');
                this.display.push(this.app.view);
                this.display.push(this.elmMgr.makecover((() => {
                    let b = this.elmMgr.makeButton('clickMe');
                    b.className = 'blue main';
                    b.onclick = () => {
                        b.remove();
                        this.onStart()
                    };
                    return b;
                })(), { className: 'meinCover' }))
                this.doc.append(this.display[0]);
                this.doc.append(this.display[1]);
            };
        };
        loader = {
            quene: [],
            add: function (add) {
                this.quene.push(add);
            },
            load: async function () {
                for(let i=0;i<this.quene.length;i++){
                    let r = null;
                    r = await this.quene[i](r);
                    if(i==this.quene.length-1){
                        this.onload(r);
                    }
                }
            },
            onload: function (c) {
                console.log(c);
            }
        }
        async onStart() {
            let n = Math.floor(Math.random() * 2);
            let mSrc = `./asset/blue/audio/${this.asset.preload.audio[n]}`;
            console.log('onplay', mSrc)
            this.soundEl.src = mSrc;
            this.soundEl.addEventListener("load", function () {
                this.soundEl.play();
            });
            this.soundEl.load();

            this.display[1].style.backgroundImage = 'url(./asset/blue/bg/CaffeeBG.png)';
            //including loadingBar from external html file;
            await this.reqMgr.req('./asset/blue/loading.html').then(d => {
                let e = this.elmMgr.strHTML2Elm(d.response);
                e.style.display = 'block';
                e.querySelector('img').src = './asset/blue/bg/BG_View_Kivotos2.jpg';
                this.display[1].append(e)
            });
            this.loader.add(async () => {
                const assetLink = 'https://mega.nz/folder/gpJETZgD#JLfnT9zCoKEEn-b9k1crjw';
                let d = await new megaManager().req(assetLink);
                return Promise.resolve(d);
            });
            this.loader.add((d)=>{
                console.log(d)
            });
            this.loader.load();
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