var client;
(() => {
    function shuffle(array) {
        for (let index = array.length - 1; index > 0; index--) {
            const randomPosition = Math.floor(Math.random() * (index + 1));
            const temporary = array[index];
            array[index] = array[randomPosition];
            array[randomPosition] = temporary;
        }
        return array;
    };
    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }
    function pickone(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }
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
                    loadingPagePics: null,
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
            client: null,
            progress: null,
            quene: [],
            finish: false,
            resolveData: null,
            init: function (client) {
                this.client = client;
            },
            add: function (add) {
                this.quene.push(add);
            },
            load: async function () {
                let r = null;
                for (let i = 0, l = this.quene, n = l.length - 1; i < n + 1; i++) {
                    r = await l[i](r);
                    if (this.progress) {
                        console.log(`program ${i + 1} done.`)
                        this.progress.progressUPdate((i / l.length) * 100, true);
                    };
                    if (i == n) {
                        if (this.progress) {
                            this.progress.progressUPdate((i + 1) / l.length * 100, true);
                        };
                        this.resolveData = r;
                        this.finish = true;
                        this.client.onload();
                    }
                }
            }
        };
        async dumyLongLoad() {
            await sleep(10000);
            console.log('done')
            return;
        }
        onStart() {
            const funcs = {
                assetMetaLoader: async () => {
                    const assetLink = 'https://mega.nz/folder/gpJETZgD#JLfnT9zCoKEEn-b9k1crjw';
                    let d = await this.reqMgr.megaMgr.req(assetLink);
                    console.log(d)
                    this.asset.loaded.data = d;
                },
                assetMetaParse: () => {
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
                },
                pageDomLoader: async () => {
                    //including loadingBar from external html file;
                    let d = await this.reqMgr.req(`./asset/blue/loading.html`);
                    let e = this.elmMgr.strHTML2Elm(d.response);
                    e.style.display = 'block';
                    this.progressMgr.init(e.querySelector('.progress'));
                    this.loader.progress = this.progressMgr;
                    this.asset.loaded.loadingPage = e;
                    this.display[1].append(e);
                },
                bgLoader0: async () => {
                    // let d = await this.reqMgr.req('./asset/blue/bg/info.json');

                    //bg img array.
                    //filterout BG_View_
                    const bgimgArr = this.theme.data.children.filter(e => {
                        return e.name.toLowerCase() == 'bgi' && e.parent.name == this.theme.name;
                    })[0].children.filter(e => e.name.includes('BG_View'));
                    // console.log(bgimgArr);
                    const chrPrePicsArr = this.theme.data.children.filter(e => {
                        return e.name.toLowerCase() == 'chrprepics' && e.parent.name == this.theme.name;
                    })[0].children;
                    //merge then shuffle;
                    this.asset.loaded.loadingPagePics = shuffle(chrPrePicsArr.concat(bgimgArr));
                    const descPic = pickone(this.asset.loaded.loadingPagePics);
                    const isbg = bgimgArr.map(e => e.name).includes(descPic.name);
                    const ischr = chrPrePicsArr.map(e => e.name).includes(descPic.name);
                    const name = (isbg ? descPic.name.toLowerCase().replace('bg_view_', '') : descPic.name.toLowerCase());
                    const type = isbg == true ? 0 : ischr == true ? 1 : 0;
                    return [name, type, descPic];
                },
                bgLoader1: async a => {
                    let link = await this.reqMgr.megaMgr.downloadPromise(a[2], { type: `image/${a[2].name.split('.')[1]}` });
                    return [a[0], a[1], link];
                },
                bgLoader2: async a => {
                    let d = await this.reqMgr.req(`./asset/${this.theme.name.toLowerCase().substring(0, 4)}/descriptData.json`);
                    return [d, a];
                },
                bgLoader3: d => {
                    const a = d[1];
                    d[0] = JSON.parse(d[0].response.replace('][object Object]', ']'));
                    // this.elmMgr.callDone = this.onload.bind(this);
                    this.elmMgr.displayInfo(d[0][a[1]], a[0], a[1], a[2])
                },
                reqSound: async () => {
                    const tl = this.asset.loaded.data.children.map(e => e.name);
                    // const tree = this.reqMgr.megaMgr.reTreeMaker(this.asset.loaded.data.tree, 'sound', j => j);
                    const soundarr = this.asset.loaded.data.children
                        .find(e => e.name == tl[1]).children
                        .find(e => e.name == 'sound').children;
                    const sflink = pickone(soundarr);
                    let u = await this.reqMgr.megaMgr.downloadPromise(sflink, { type: "audio/ogg" });
                    this.asset.loaded.audio.push(u);
                },
                appendSound: () => {
                    let u = this.asset.loaded.audio[0];
                    this.soundEl.src = u;
                    this.soundEl.addEventListener("load", function () {
                        console.log('onplay', u);
                        this.soundEl.play();
                    });
                    this.soundEl.load();
                }
            };

            this.loader.init(this);
            //load external AssetData 's metadata.;
            this.loader.add(funcs.assetMetaLoader);
            this.loader.add(funcs.assetMetaParse);

            //append loading page.
            this.loader.add(funcs.pageDomLoader);

            //req sound. append sound.
            this.loader.add(funcs.reqSound);
            this.loader.add(funcs.appendSound);

            //req bg info.
            this.loader.add(funcs.bgLoader0);
            this.loader.add(funcs.bgLoader1);
            this.loader.add(funcs.bgLoader2);
            this.loader.add(funcs.bgLoader3);
            this.loader.add(this.dumyLongLoad);
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
        onload() {
            this.loader.quene = [];
            console.log('onload done.');
        }
    };
    client.init();
    return client;
})(client = {})