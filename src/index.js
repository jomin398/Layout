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
            this.theme = {
                no: 1,
                noVoice: true,
                name: null,
                data: null
            };
            this.asset = {
                loaded: {
                    char: {
                        tree: null
                    },
                    loadingPage: null,
                    data: null,
                    audio: []
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

            //load external AssetData 's metadata.;
            this.loader.add(async () => {
                const assetLink = 'https://mega.nz/folder/gpJETZgD#JLfnT9zCoKEEn-b9k1crjw';
                let d = await this.reqMgr.megaMgr.req(assetLink);
                console.log(d)
                this.asset.loaded.data = d;
            });
            this.loader.add(() => {
                //Make chr Tree;

                const searchWorld = 'characters';
                const tree = this.reqMgr.megaMgr.reTreeMaker(this.asset.loaded.data.tree, searchWorld, j => j.replace('.zip', ''));
                console.log(tree)
                this.asset.loaded.char.tree = tree.t;

                const chrTree = this.asset.loaded.char.tree;
                const tnum = this.theme.no;
                const noVoice = this.theme.noVoice;
                this.theme.data = this.asset.loaded.data.children[tnum];
                this.theme.name = this.theme.data.name;

                // console.log(o);
                let stds = [];
                Object.keys(chrTree).map(e => stds = stds.concat(chrTree[e]));
                let stdCt = stds.length;
                console.log(stds)
                console.log(`sum of all students.. they are ${stdCt} students.`)

                //select blue;
                console.log(`Theme is ${this.theme.name}`)
                console.log('student list', chrTree[Object.keys(chrTree)[tnum]])
                console.log(this.theme.data.children.filter(e => {
                    return noVoice ? e.name.toLowerCase() == 'characters' : e;
                }));
                //bg img array.
                const bgimgArr = this.theme.data.children.filter(e => e.name.toLowerCase() == 'bgi' && e.parent.name == this.theme.name)[0].children.filter(e=>e.name.includes('BG_View'));
                console.log(bgimgArr);
                
                //filterout BG_View_
                // console.log(d.children[tnum].children.find(e=>e.name=="characters"));
            });

            //append loading page.
            this.loader.add(async () => {
                //including loadingBar from external html file;
                let d = await this.reqMgr.req(`./asset/blue/loading.html`);
                let e = this.elmMgr.strHTML2Elm(d.response);
                e.style.display = 'block';
                this.progressMgr.init(e.querySelector('.progress'));
                this.loader.progress = this.progressMgr;
                this.asset.loaded.loadingPage = e;
                this.display[1].append(e);
                const tree = this.reqMgr.megaMgr.reTreeMaker(this.asset.loaded.data.tree, 'bgi', j => j);
                console.log(tree)
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
            this.loader.add(() => {
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
                //random descript Select Num
                const descSelNum = 0;
                let d = await this.reqMgr.req('./asset/blue/bg/info.json');
                this.elmMgr.displayInfo(d, descSelNum);
            })


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