class ProgressManager {
    constructor() {
        this.elm = null;
        this.pelm = null;
    }
    init(elm) {
        if (!elm) throw new ReferenceError('element can not be null');
        this.elm = elm;
        this.pelm = this.elm.querySelector('progress');
    }
    progressUPdate(ps, notAcc) {
        ps = ps ? ps : 0;
        if (!notAcc) {
            this.pelm.value += ps;
        } else {
            this.pelm.value = ps;
        }
        let _text = this.pelm.value.toFixed(1) + "%";
        // this.elm.innerText = _text;
        this.elm.parentElement.querySelector('#ps').innerText = _text;
    };
}