class elmMgr {
    constructor() {

    }
    strHTML2Elm(str){
       let d = new DOMParser();
       return d.parseFromString(str,'text/html').body.firstChild;
    }
    makeButton(innerHtml,option){
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