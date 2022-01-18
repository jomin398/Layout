var client;
(() => {
    client = new class client {
        constructor() {
            this.app = null;
            this.doc = null;
            this.elmMgr = new elmMgr();
            this.reqMgr = new requester();
            this.progressMgr = new ProgressManager();
            this.soundEl = null;
            this.display = [];
            this.asset = {
                preload: {
                    audio: [
                        'Theme_01.ogg',
                        'Theme_02.ogg'
                    ]
                },
                loaded: {
                    char: {
                        tree: null
                    },
                    loadingPage: null
                }
            }
        };
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
                this.elmMgr.init(this);
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
            progress: null,
            quene: [],
            add: function (add) {
                this.quene.push(add);
            },
            load: async function () {
                let r = null;
                for (let i = 0, l = this.quene, n = l.length - 1; i < n + 1; i++) {
                    r = await l[i](r);
                    if (this.progress) {
                        this.progress.progressUPdate((i / l.length) * 100);
                    };
                    if (i == n) {
                        if (this.progress) {
                            this.progress.progressUPdate((i + 1) / l.length * 100);
                        };
                        this.onload(r);
                    }
                }
            },
            onload: function (c) {
                this.quene = [];
                console.log('onload done.')
                console.log(c);
            }
        };
        async onStart() {
            let n = Math.floor(Math.random() * 2);
            let mSrc = `./asset/blue/audio/${this.asset.preload.audio[n]}`;
            console.log('onplay', mSrc)
            this.soundEl.src = mSrc;
            this.soundEl.addEventListener("load", function () {
                this.soundEl.play();
            });
            this.soundEl.load();
            //random descript Select Num
            const descSelNum = 1;

            //including loadingBar from external html file;
            this.loader.add(() => this.reqMgr.req(`./asset/blue/loading.html`))
            this.loader.add(d => {
                let e = this.elmMgr.strHTML2Elm(d.response);
                e.style.display = 'block';
                this.progressMgr.init(e.querySelector('.progress'));
                this.loader.progress = this.progressMgr;
                this.asset.loaded.loadingPage = e;
                this.display[1].append(e)
            });

            this.loader.add(async () => {
                let d = await this.reqMgr.req('./asset/blue/bg/info.json');
                this.elmMgr.displayInfo(d, descSelNum);
            })
            this.loader.add(async () => {
                const assetLink = 'https://mega.nz/folder/gpJETZgD#JLfnT9zCoKEEn-b9k1crjw';
                let d = await new megaManager().req(assetLink);
                let o = d.tree;
                let k = Object.keys(o);
                let c = {};
                k.map(e => {
                    c[e] = Object.keys(o[e].characters).map(j => j.replace('.zip', ''))
                })
                this.asset.loaded.char.tree = c;
                return d;
            });
            this.loader.add(d => {
                let o = this.asset.loaded.char.tree;
                const tnum = 1;
                const noVoice = true;
                let theme = null;
                // console.log(o);
                let ct = Object.keys(o).map(e => Object.keys(o[e]).length).reduce((p, c) => p + c);
                console.log(`sum of all students.. they are ${ct} students.`)

                //select blue;
                theme = d.children[tnum];
                console.log(`Theme is ${theme.name}`)
                console.log('student list', o[Object.keys(o)[tnum]])
                console.log(d.children[tnum].children.filter(e => {
                    return noVoice ? e.name.toLowerCase() == 'characters' : e;
                }));
                // console.log(d.children[tnum].children.find(e=>e.name=="characters"));
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
        };
    };
    client.init();
    return client;
})(client = {})