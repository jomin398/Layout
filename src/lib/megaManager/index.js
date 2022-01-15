class megaManager {
    constructor() { }

    /**
     * @typedef file
     * @prop {boolean} directory is folder or file?
     * @prop {string} name
     * @prop {number} size
     * @prop {array<file>} children
     * @prop {string} downloadId - Link ID to file. Only if created from link.
     * @prop {number} timestamp - File creation time (unix timestamp in seconds)
     * @prop {string} nodeId
     */
    /**
     * @param {string} url
     * @return {Promise<file>}
     */
    preReq(url) {
        return new Promise((resolve, reject) => {
            const file = mega.file(url);
            file.loadAttributes((error, file) => {
                if (error) reject(error);
                resolve(file);
            });
        })
    }
    treeMaker(o, p, t){
        let r={};
        o.map(e => {
            // r[e[p]] = [];
            if (e[t]){
                r[e[p]] = this.treeMaker(e[t],p,t)
            }else{
                r[e[p]] = null;
            }
        })
        return r;
    };
    wrapper(f) {
        let isfolder = false; //f.directory;
        let o = {tree:null};
        return new Promise((resolve, reject) => {
            if (!f) reject(new Error('file is can not be null'));
            isfolder = f.directory;
            o = Object.assign(f, o);
            if (!isfolder) {
                o.directory = true;
                o.tree = o.name;
                o.children = [];
                o.children.push(f);
                // delete o.download;
            }else{
                o.tree =this.treeMaker(o.children,'name','children');
            }
            resolve(o);
        });
    }

    /**
     * @param {*} url a mega url link
     */
    async req(url) {
        const f = await this.preReq(url);
        return this.wrapper(f);
    }
}