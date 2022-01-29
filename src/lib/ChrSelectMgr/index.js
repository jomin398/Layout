class ChrSelectMgr {
    constructor() {
        this.requester = new requester();
        this.theme = {
            no: 0,
            selNo: 0,
            selLimit: 1,
            key: null,
            selKeys: null,
            textList: null,
            db: null
        };
        this.dataRaw = null;
        this.gui = {
            elms: [],
            keys: [],
            keyFns: []
        },
        this.onSelect = console.log; //default callBack.
    };
    getThemeText() {
        return this.theme.textList[this.theme.no];
    };
    init(elms) {
        this.gui.elms = elms;
        return new Promise(async function (resolve, reject) {
            this.dataRaw = await this.requester.req('./json/chrPreviewData.json').then(xhr => JSON.parse(xhr.response));
            this.theme.textList = this.dataRaw[0].tt[langNo];
            this.theme.db = this.dataRaw[1];
            this.theme.selKeys = Object.keys(this.theme.db);
            this._view();
            resolve(this.dataRaw);
        }.bind(this));
    };

    /**
    * @param {boolean} i init?
    * @param {string} t title/name
    * @param {string} y player prefix;
    * @returns {string} string.
    */
    questionDesc(i, t, y) {
        return (i ? `${t}에서
          ${y}어떤 아이를` : `${t}를(을)`) + " 선택하실건가요?";
    };
    cycle() {
        const qElm = this.gui.elms[0];
        const ccElm = this.gui.elms[1];
        ccElm.style.display = "none";
        qElm.querySelectorAll('p').forEach((e, i) => qElm.removeChild(e));
        qElm.append(
            (() => {
                let p = document.createElement("p");
                p.innerText = this.questionDesc(true, this.theme.db[this.theme.key].kn, this.getThemeText());
                return p;
            })()
        );
        qElm.style.display = "flex";
        ccElm.querySelectorAll('.fw .fc').forEach(e =>
            ccElm.querySelector('.fw').removeChild(e));
        this._list(this.theme.db[this.theme.key]);
        this.gui.keys = ccElm.querySelectorAll('.btn.wrapper button i');
        this.gui.keyFns = [
            (ev) => {
                if (this.theme.selNo > 0) {
                    this.theme.selNo--;
                };
                console.log(this.theme.selNo);
                // console.log(ev.target.parentNode.className);
                this.theme.key = this.theme.selKeys[this.theme.selNo];
                this.cycle();
            },
            (ev) => {
                if (this.theme.selNo < this.theme.selLimit) {
                    this.theme.selNo++;
                };
                console.log(this.theme.selNo);
                // console.log(ev.target.parentNode.className);
                this.theme.key = this.theme.selKeys[this.theme.selNo];
                this.cycle();
            }
        ];
        const fwc = (t, d) => {
            // console.log(t);
            if (ccElm) ccElm.style.display = "none";
            if (qElm) {
                qElm.style.display = "flex";
                qElm.querySelector('p').innerText = this.questionDesc(false, d.d[t].n[langNo]);
                qElm.append((() => {
                    let y = document.createElement('p');
                    y.className = 'choose';
                    y.innerText = ['Yes', '네'][langNo];
                    y.onclick = () => {
                        qElm.querySelectorAll('p').forEach((e, i) => qElm.removeChild(e));
                        this.onSelect(t, d.d[t].n[langNo], this.theme.key, this.theme.db[this.theme.key].kn)
                    };
                    return y;
                })(), (() => {
                    let n = document.createElement('p');
                    n.className = 'choose';
                    n.innerText = ['No', '아니요'][langNo];
                    n.onclick = () => {
                        qElm.style.display = "none";
                        //qElm.querySelectorAll('p').forEach((e, i) => qElm.removeChild(e));
                        // qElm.querySelector('p').innerText = questionDesc(true, d.kn, themeT);

                        // ccElm.style.display = "none";
                        this.theme.key = this.theme.selKeys[this.theme.selNo];
                        this.cycle();
                    };
                    return n;
                })())
            }
        };
        ccElm.querySelector('.fw').childNodes.forEach(e => {
            let cr = new ClickEventRouther(e);
            const d = this.theme.db[this.theme.key];
            cr.init();
            cr.callBack = (t) => fwc(t, d);
        });
        // console.log(this.gui.keyFns)
        this.gui.keys.forEach((e, i) => e.onclick = this.gui.keyFns[i]);
        setTimeout(() => {
            qElm.style.display = "none";
            ccElm.style.display = "block";
        }, 3000);
    };
    _list(themeData) {
        const ccElm = this.gui.elms[1];
        Object.keys(themeData.d).map(e => {
            const elm = document.createElement('div');
            elm.className = 'fc';
            const d = themeData.d[e];
            if (d.p) elm.classList.add(d.p);

            const img = document.createElement('img');
            img.src = `${themeData.f}/${e}.png`;
            img.alt = e;
            const desc = (() => {
                let r = document.createElement('div');
                r.className = 'fd';
                for (let i = 0, a = ['n', 'u', 'cv']; i < a.length; i++) {
                    r.appendChild((() => {
                        let s = document.createElement('span');
                        s.innerText = '';
                        if (d[a[i]]) s.innerText = i != 2 ? d[a[i]][langNo] : `CV : ${d[a[i]][langNo]}`;
                        return s;
                    })())
                };
                return r;
            })();

            elm.append(img, desc)
            ccElm.querySelector('.fw').append(elm);
        });
    };
    _view() {
        this.theme.key = this.theme.selKeys[this.theme.selNo];
        this.cycle(this.theme.key);
    }
};