/**
 * 用户各种数据
 */
var UserVo = (function () {
    function UserVo() {
        /****** 资源 *******/
        this.resource = new HashMap();
        /****** 建筑 *******/
        this.building = new HashMap();
        /****** 建筑队列 *******/
        this.buildQueue = [];
    }
    var d = __define,c=UserVo;p=c.prototype;
    return UserVo;
})();
egret.registerClass(UserVo,"UserVo");
