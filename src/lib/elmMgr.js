class elmMgr {
    constructor() {

    }
    displayInfo(d) {
        const e = JSON.parse(d.response);
        const doc= this.display[1];
        doc.querySelector('.descC #title').innerText = e[0].n[1];
        doc.querySelector('.descC #desc').innerText = e[0].d[1];
        let ip = `./asset/blue/bg/${e[0].f}`;
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