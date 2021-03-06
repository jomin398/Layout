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
        keyFns: [],
        langNo: 0
      },
      this.onSelect = console.log; //default callBack.
  };
  getThemeText() {
    return this.theme.textList[this.theme.no];
  };
  async _parseChrDescDB(resolve, reject) {
    this.dataRaw = await this.requester.req('./json/chrPreviewData.json').then(xhr => JSON.parse(xhr.response));
    this.theme.textList = this.dataRaw[0].tt[this.gui.langNo];
    this.theme.db = this.dataRaw[1];
    this.theme.selKeys = Object.keys(this.theme.db);
    this._view();
    resolve(this.dataRaw);
  }
  init(elms) {
    this.gui.elms = elms;
    let l = navigator.language.toLocaleLowerCase();
    this.gui.langNo = l.includes('ko') ? 1 : l.includes('ja') ? 2 : 0;
    return new Promise((res, rej) => this._parseChrDescDB(res, rej));
  };

  /**
   * @param {boolean} i init?
   * @param {string} t title/name
   * @param {string} y player prefix;
   * @returns {string} string.
   */
  questionDesc(i, t, y) {
    if (this.gui.langNo == 1) {
      return (i ? `${t}에서
          ${y}어떤 아이를` : `${Josa(t,'을')}`) + " 선택하실건가요?";
    } else {
      i ? `if you as ${y},
            Who are you going to choose? from ${t}` : `Are you Sure to choose
            ${t}?`;
    }
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
        qElm.querySelector('p').innerText = this.questionDesc(false, d.d[t].n[this.gui.langNo]);
        let option = {
          className: 'choose',
          innerText: ['Yes', '네'][this.gui.langNo],
          onclick: () => {
            qElm.querySelectorAll('p').forEach((e, i) => qElm.removeChild(e));
            this.onSelect(t, d.d[t].n[this.gui.langNo], this.theme.key, this.theme.db[this.theme.key].kn)
          }
        };
        let op2 = Object.assign(Object.assign({}, option), {
          innerText: ['No', '아니요'][this.gui.langNo],
          onclick: () => {
            qElm.style.display = "none";
            this.theme.key = this.theme.selKeys[this.theme.selNo];
            this.cycle();
          }
        });
        new elmMgr().promptQA(qElm, 'p', [option, op2]);
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
            if (d[a[i]]) s.innerText = i != 2 ? d[a[i]][this.gui.langNo] : `CV : ${d[a[i]][this.gui.langNo]}`;
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