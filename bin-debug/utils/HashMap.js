var HashMap = (function () {
    function HashMap() {
        this.data = {};
    }
    var d = __define,c=HashMap;p=c.prototype;
    p.set = function (K, V) {
        this.data[K] = V;
    };
    p.put = function (K, V) {
        this.set(K, V);
    };
    /**
     * 根据Key获得数据，可以传入默认值
     * @param K
     * @param V
     * @returns {any}
     */
    p.get = function (K, V) {
        if (arguments.length == 1) {
            return this.data[K];
        }
        else {
            if (this.has(K)) {
                return this.data[K];
            }
            else {
                return V;
            }
        }
    };
    p.has = function (K) {
        return this.data.hasOwnProperty(K);
    };
    p.remove = function (K) {
        this.data[K] = undefined;
        delete this.data[K];
    };
    p.keys = function () {
        var arr = [];
        for (var key in this.data) {
            arr.push(key);
        }
        return arr;
    };
    /**
     * 重新设置
     * @param obj
     */
    p.reset = function (obj) {
        this.data = obj.data || obj;
    };
    /**
     * 将toJSON后的str数据转化回来
     * @param str
     */
    p.parse = function (str) {
        var obj = JSON.parse(str);
        this.data = obj.data;
    };
    p.toString = function () {
        return JSON.stringify(this.data);
    };
    return HashMap;
})();
egret.registerClass(HashMap,"HashMap");
