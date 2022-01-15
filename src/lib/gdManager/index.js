/**
 * @class gdMgr
 * a google drive link Manager
 */
class gdMgr {
    constructor() { };
    /**
     * @param {string} url 
     * @returns {string} drive id string.
     */
    getID(url) {
        //파일 마다 고유의 아이디가 있는데 그걸 잘라준다.
        return url.split("/d/")[1].split("/")[0];
    }
    /**
     * @property {Array} preurls
     */
    preUrls = ["https://drive.google.com/uc?export=download&id=", "https://docs.google.com/document/d/"];
    /**
     * 
     * @param {string} url input param to convert
     * @param {string} format a file format
     * @returns {string}
     * @example
     * getLink('http://www.example.com/','txt');
     */
    getLink(url, format) {
        /* 구글 드라이브의 일반적인 공유 링크를 다이렉트 다운로드 URL로 변경하는 소스 */
        let preUrlend = "/export?format=" + format ? format : "txt";
        if (url.search("document") == -1) {
            //파일이 문서가 아니고 미디어일 경우, 그냥 반환
            return this.preUrls[0] + this.getID(url);
        } else {
            //파일이 문서가 일경우 txt 파일로 저장한다는 확장자를 붙힌다.
            return this.preUrls[1] + this.getID(url) + preUrlend;
        }
    }
};