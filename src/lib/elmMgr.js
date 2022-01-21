class elmMgr {
    constructor() {
        this.client = null;
    }
    init(client) {
        this.client = client;
    }
    switchEleType() {
        let a = this.client.display[1].querySelector('.descC');
        let b = this.client.display[1].querySelector('.bg');
        this.client.display[1].querySelector('.left').insertAdjacentElement('afterend', a);
        a.insertAdjacentElement('afterbegin', b);
    }
    displayInfo(d, descSelNum) {
        console.log(this)
        const e = JSON.parse(d.response);
        const data = e[descSelNum];
        let doc = this.client.asset.loaded.loadingPage;
        this.client.display[1] = doc;
        //detect type
        if (data.t && data.t == 1) {
            this.switchEleType();
            this.client.display[1].querySelector('.loading').classList.add('t1');
        }
        doc = this.client.display[1];
        doc.querySelector('.loading').id = data.t ? ['bg', 'chr'][data.t] : 'bg';
        const telms = [doc.querySelector('.left'), doc.querySelector('.right')];
        const tArr = [data.n[1][0] ? data.n[1][0] : '', data.n[1][1] ? data.n[1][1] : ''];
        if (data.ns) {
            data.ns.map((e, i) => {
                if (e) {
                    Object.assign(telms[i].style, e)
                }
            })
        }
        telms[0].innerText = tArr[0];
        telms[1].innerText = tArr[1];

        doc.querySelector('#desc').innerText = data.d[1];
        doc.querySelector('.if').dataset.chrname = data.f.split('.')[0];
        let ip = `./asset/blue/bg/${data.f}`;
        doc.querySelector('img').src = ip;
    }
    strHTML2Elm(str) {
        let d = new DOMParser();
        return d.parseFromString(str, 'text/html').body;
    }
    makeButton(innerHtml, option) {
        let c = document.createElement('button');
        if (innerHtml) c.innerHTML = innerHtml;
        if (option) {
            if (option.className) {
                c.className = option.className;
            }
            if (option.id) {
                c.id = option.id;
            }
        }
        return c;
    }
    makecover(btnEle, option) {
        let c = document.createElement('div');
        if (btnEle) c.append(btnEle);
        if (option) {
            if (option.className) {
                c.className = option.className;
            }
            if (option.id) {
                c.id = option.id;
            }
        }
        return c;
    }
}