class ClickEventRouther {
    constructor(elm) {
      this.elm = elm;
      this.callBack = console.log;
    }
    init() {
      if (!this.elm) throw new ReferenceError('elm is can not be null');
      this.elm.addEventListener('click', this.onclick.bind(this));
    }
    onclick(ev) {
      let t = ev.target.alt;
      //click reroute;
      if (!t) t = ev.target.parentNode.firstElementChild.alt;
      if (!t) t = ev.target.parentNode.parentNode.firstElementChild.alt;
      if (!t) t = ev.target.firstElementChild.alt;
      if (!t) t = null;
      this.callBack(t)
    }
  };