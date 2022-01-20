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
                loaded: {
                    char: {
                        tree: null
                    },
                    loadingPage: null,
                    data: null,
                    audio:[]
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
            //random descript Select Num
            const descSelNum = 0;
            let n = Math.floor(Math.random() * 2);

            //append loading page.
            this.loader.add(async () => {
                //including loadingBar from external html file;
                let d = await this.reqMgr.req(`./asset/blue/loading.html`);
                let e = this.elmMgr.strHTML2Elm(d.response);
                e.style.display = 'block';
                this.progressMgr.init(e.querySelector('.progress'));
                this.loader.progress = this.progressMgr;
                this.asset.loaded.loadingPage = e;
                this.display[1].append(e)
            });
            //load external AssetData 's metadata.;
            this.loader.add(async () => {
                const assetLink = 'https://mega.nz/folder/gpJETZgD#JLfnT9zCoKEEn-b9k1crjw';
                let d = await this.reqMgr.megaMgr.req(assetLink);
                console.log(d)
                this.asset.loaded.data = d;
            });

            //req sound.
            this.loader.add(async () => {
                const tl = this.asset.loaded.data.children.map(e => e.name);
                // const tree = this.reqMgr.megaMgr.reTreeMaker(this.asset.loaded.data.tree, 'sound', j => j);
                const soundarr = this.asset.loaded.data.children
                    .find(e => e.name == tl[1]).children
                    .find(e => e.name == 'sound').children;
                const sflink = soundarr[n];
                let u = await this.reqMgr.megaMgr.downloadPromise(sflink, { type: "audio/ogg" });
                this.asset.loaded.audio.push(u);
            });
            //append sound.
            this.loader.add(()=> {
                let u = this.asset.loaded.audio[0];
                this.soundEl.src = u;
                this.soundEl.addEventListener("load", function () {
                    console.log('onplay', u);
                    this.soundEl.play();
                });
                this.soundEl.load();
            })
            //req bg info.
            this.loader.add(async () => {
                let d = await this.reqMgr.req('./asset/blue/bg/info.json');
                this.elmMgr.displayInfo(d, descSelNum);
            })

            //Make chr Tree;
            this.loader.add(() => {
                const searchWorld = 'characters';
                const tree = this.reqMgr.megaMgr.reTreeMaker(this.asset.loaded.data.tree, searchWorld, j => j.replace('.zip', ''));
                console.log(tree)
                this.asset.loaded.char.tree = tree.t;
            })
            this.loader.add(() => {
                const d = this.asset.loaded.data;
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