/**
 * a request handler
 * @class
 * @name requester
 * @method req
 */
class requester {
  /**
   * xhr to promise.
   * @param {string} url target url
   * @param {Object} option on load process object.
   * @param {string} option.method method to get, post.
   * @param {number} option.reqEtype req engine type.
   * @param {string} option.type a response type.
   * @param {Object} option.process on load process object.
   * @param {function(e)} option.process.loading a loading function
   * @param {function(e)} option.process.loadStart a loadStart function
   * @param {boolean} option.usefetch use feach
   * @param {*} data a post data.
   * @returns {Promise}
   * @example
   * req('get','http://www.example.com/',null,null,{loadStart:e=>console.log(`now onstart Downloading ${e.total} bytes`),loading:e=>console.log(`${Math.round(100 * e.loaded / e.total)}% Complete`)})
   */
  req(url, option, data) {
    option = option ? option : {};
    let xhr = null;
    if (data) {
      option.body = data;
    };

    option.reqEtype = option.reqEtype ? option.reqEtype : 0;
    switch (option.reqEtype) {
      case 0:
        xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
          if (option.type) {
            xhr.responseType = option.type;
          }
          if (option.process) {
            if (option.process.loadStart) {
              xhr.onloadstart = option.process.loadStart;
            }
            if (option.process.loading) {
              xhr.onprogress = option.process.loading;
            }
          }

          xhr.open(option.method ? option.method : 'get', url, true);
          xhr.onload = () => resolve(xhr);
          xhr.onerror = () => reject(xhr);
          data != {} ? xhr.send(JSON.stringify(data)) : xhr.send();
        });
      case 1:
        return fetch(url, option);
      case 2:
        let gdMgr = new gdMgr();
        if (!gdMgr) throw new Error('unsupported method.');
        url = gdMgr.getLink(url);
        option.reqEtype = 0;
        return this.req(url, option, data);
    }
  };
};