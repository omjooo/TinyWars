/**
 * 玩家数据
 */
var Player = (function () {
    function Player() {
        /**
         * 最大建造按钮索引
         * @type {number}
         */
        this.buildNumberIndex = 0;
        this._vo = new UserVo();
        /**
         * ============================== 资源仓库大小，资源上限 ===============================
         */
        /**
         * 资源上限
         * @type {HashMap<number, number>}
         */
        this.resourceCapacity = new HashMap();
        /**
         * ============================== 资源获得速率 ===============================
         */
        /**
         * 点击资源可以获得的数量
         * //TODO 登录后需要根据科技来刷新值
         * @type {number}
         */
        this.clickResCount = 1;
        /**
         * 资源增加速率
         * @type {HashMap<number, number>}
         */
        this.resourceAddRate = new HashMap();
        if (Player._instance) {
            throw new Error("Player使用单例");
        }
    }
    var d = __define,c=Player;p=c.prototype;
    d(Player, "instance"
        ,function () {
            if (!Player._instance) {
                Player._instance = new Player();
            }
            return Player._instance;
        }
    );
    d(p, "buildMax"
        /**
         * 获取最大建造数量
         * @returns {number}
         */
        ,function () {
            return Math.pow(10, this.buildNumberIndex);
        }
    );
    d(p, "vo"
        ,function () {
            return this._vo;
        }
    );
    p.dealLoginSuccess = function (data) {
        this._vo.resource.reset(data["resource"]);
        this._vo.building.reset(data["building"]);
        //建筑队列
        var arr = data["buildQueue"] || [];
        for (var i = 0; i < arr.length; i++) {
            this._vo.buildQueue.push(new BuildQueueVo(arr[i]));
        }
    };
    /**
     * 当网络加载和本地数据都初始化完成后，调用这个方法
     */
    p.init = function () {
        //计算各种速率
        this.calResourceAddRate();
        this.calStoreCapacity();
    };
    /**
     * 网络保存
     */
    p.saveToNet = function () {
        UserNet.instance.save(JSON.stringify(this._vo));
    };
    p.calStoreCapacity = function () {
        var buildingKeys = BuildingCategory.storeGroup;
        for (var i = 0; i < buildingKeys.length; i++) {
            var bvo = BuildingDataManager.instance.buildingDataBaseMap.get(buildingKeys[i]);
            if (bvo.ptype == BuildingProduct.STORE) {
                var lv = this.vo.building.get(bvo.id, 0) + 1;
                this.resourceCapacity.set(bvo.pValueId, lv * bvo.value);
            }
        }
    };
    /**
     * 获取资源上限
     * @param type
     * @returns {number}
     */
    p.getResourceCapacity = function (type) {
        return this.resourceCapacity.get(type, 1000);
    };
    /**
     * ============================== 资源等级相关 ===============================
     */
    /**
     * 获取资源数量
     * @param type
     * @returns {number}
     */
    p.getResourceCount = function (type) {
        return this._vo.resource.get(type) || 0;
    };
    /**
     * 添加资源数量 (也可能是减少)
     * @param type 资源类型
     * @param num 数量
     * @param force 超过了上限是否也强制增加
     */
    p.addResourceCount = function (type, num, force) {
        if (force === void 0) { force = false; }
        var count = this._vo.resource.get(type, 0);
        var max = this.resourceCapacity.get(type);
        if (count < max || num < 0 || force) {
            if (force) {
                this._vo.resource.set(type, count + num);
            }
            else {
                if (num < 0) {
                    this._vo.resource.set(type, count + num);
                }
                else {
                    this._vo.resource.set(type, Math.min(count + num, max));
                }
            }
            EventManager.instance.dispatch(EventName.RESOURCE_CHANGE, [type]);
        }
    };
    /**
     * 避免过多事件，所以批量更新资源数据
     * @param types
     * @param numArr
     */
    p.addResourceCountBatch = function (types, numArr) {
        if (types.length != numArr.length) {
            throw new Error("数量不匹配");
        }
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var num = numArr[i];
            var max = this.resourceCapacity.get(type);
            var count = this._vo.resource.get(type, 0);
            if (count < max || num < 0) {
                if (num < 0) {
                    this._vo.resource.set(type, count + num);
                }
                else {
                    this._vo.resource.set(type, Math.min(count + num, max));
                }
            }
        }
        EventManager.instance.dispatch(EventName.RESOURCE_CHANGE, types);
    };
    /**
     * 计算资源增加速率
     */
    p.calResourceAddRate = function () {
        //建筑这块
        var buildingKeys = this.vo.building.keys();
        for (var i = 0; i < buildingKeys.length; i++) {
            var bvo = BuildingDataManager.instance.buildingDataBaseMap.get(buildingKeys[i]);
            if (bvo.ptype == BuildingProduct.PRODUCT) {
                this.resourceAddRate.set(bvo.pValueId, this.vo.building.get(bvo.id, 0) * bvo.value);
            }
        }
        //TODO 科技这一块
        //TODO 工厂
    };
    /**
     * 获取某一资源的增加速率
     * @param type
     * @returns {number}
     */
    p.getResourceAddRate = function (type) {
        return this.resourceAddRate.get(type, 0);
    };
    /**
     * 自动产生资源
     */
    p.autoOutputResource = function () {
        var addRateKeys = this.resourceAddRate.keys();
        var addRateIds = [];
        var addResValues = [];
        for (var i = 0; i < addRateKeys.length; i++) {
            var resId = addRateKeys[i];
            var num = this.resourceAddRate.get(resId);
            if (num > 0) {
                addRateIds.push(int(resId));
                addResValues.push(num);
            }
        }
        addRateKeys = null;
        this.addResourceCountBatch(addRateIds, addResValues);
    };
    /**
     * ============================== 建筑等级相关 ===============================
     */
    /**
     * 建筑等级变化
     * @param id 建筑id
     * @param addLv 增加的等级
     */
    p.buildingLevelChang = function (id, addLv) {
        this.vo.building.add(id, addLv);
        //不同类型等级变化会造成不同的变化
        if (Util.isElinArr(id, BuildingCategory.resGroup)) {
            this.calResourceAddRate();
        }
        else if (Util.isElinArr(id, BuildingCategory.storeGroup)) {
            this.calStoreCapacity();
        }
    };
    /**
     * ============================== 建筑队列 ===============================
     */
    /**
     * 获取某一个建筑队列
     * @param moudleId
     * @param id
     * @returns {any}
     */
    p.getBuildQueue = function (moudleId, id) {
        for (var i = 0; i < this.vo.buildQueue.length; i++) {
            var vo = this.vo.buildQueue[i];
            if (vo.module == moudleId && vo.id == id) {
                return vo;
            }
        }
        return null;
    };
    /**
     * 添加建造队列
     * @param module
     * @param id
     * @param cd
     * @param value
     * @param needPush 是否需要入栈
     */
    p.addBuidQueue = function (module, id, cd, value, needPush) {
        if (needPush === void 0) { needPush = true; }
        var startTime = DateTimer.instance.now;
        var endTime = startTime + cd;
        var vo = new BuildQueueVo(module, id, startTime, endTime, value);
        if (cd > 1000 && needPush) {
            this.vo.buildQueue.push(vo);
            this.saveToNet();
        }
        else {
            this.onBuildQueueComplete(vo);
        }
    };
    /**
     * 刷新建造队列
     */
    p.updateBuildQueue = function () {
        var buildQueue = this.vo.buildQueue;
        if (buildQueue.length > 0) {
            for (var i = buildQueue.length - 1; i >= 0; i--) {
                var vo = buildQueue[i];
                if (DateTimer.instance.now >= vo.endTime) {
                    //移除建造
                    buildQueue.splice(i, 1);
                    //并且增加相应的资源
                    this.onBuildQueueComplete(vo);
                }
            }
        }
    };
    /**
     * 当建造队列完成后进行的操作
     * @param vo
     */
    p.onBuildQueueComplete = function (vo) {
        switch (vo.module) {
            case GameModule.BUILDING:
                this.buildingLevelChang(vo.id, vo.value);
                break;
        }
    };
    return Player;
})();
egret.registerClass(Player,"Player");
