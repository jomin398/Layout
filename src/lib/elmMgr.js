class elmMgr {
    constructor() {
        this.client = null;
        this.callDone = null;
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
    async displayInfo(d, name, type, imageUrl) {
        console.log(this)
        // const e = JSON.parse(d.response);
        let doc = this.client.asset.loaded.loadingPage;
        this.client.display[1] = doc;
        //detect type
        if (type && type == 1) {
            this.switchEleType();
            this.client.display[1].querySelector('.loading').classList.add('t1');
        }
        doc = this.client.display[1];
        doc.querySelector('.loading').id = type ? ['bg', 'chr'][type] : 'bg';
        const telms = [doc.querySelector('.left'), doc.querySelector('.right')];
        let o = d.find(e => e.f.toLowerCase() == name) || null;
        let tArr = null;
        if (o) {
            tArr = [o.n[1][0] ? o.n[1][0] : '', o.n[1][1] ? o.n[1][1] : ''];
            if (o.ns) {
                o.ns.map((e, i) => {
                    if (e) {
                        Object.assign(telms[i].style, e)
                    }
                })
            }
            telms[0].innerText = tArr ? tArr[0] : '';
            telms[1].innerText = tArr ? tArr[1] : '';
            doc.querySelector('#desc').innerText = o.d[1];
            if (type == 1) doc.querySelector('.if').dataset.chrname = o.f.split('.')[0];
        }
        doc.querySelector('img').src = imageUrl;
        console.log('descriptData', d);
        console.log([
            "image name : " + name.split('.')[0],
            "image type : " + type + " (0 is bg, i is chr.)",
            "image path(src) : " + imageUrl
        ].join('\n'));
        if(this.callDone) setTimeout(()=>this.callDone(),4000)
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