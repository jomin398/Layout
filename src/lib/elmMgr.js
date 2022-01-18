class elmMgr {
    constructor() {

    }
    displayInfo(d) {
        const e = JSON.parse(d.response);

        //random descript Select Num
        const descSelNum = 1;
        const data = e[descSelNum];

        const doc= this.display[1];
        doc.querySelector('.loading').id = data.t?['bg','chr'][data.t]:'bg';
        const telms = [doc.querySelector('.left'),doc.querySelector('.right')];
        const tArr = [data.n[1][0]?data.n[1][0]:'',data.n[1][1]?data.n[1][1]:''];
        // if(data.ns){
        //     data.ns.map((e,i)=>{
        //         if(e){
        //             Object.assign(telms[i].style,e)
        //         }
        //     })
        // }
        telms[0].innerText = tArr[0];
        telms[1].innerText = tArr[1];
        
        // doc.querySelector('.descC #desc').innerText = data.d[1];
        
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