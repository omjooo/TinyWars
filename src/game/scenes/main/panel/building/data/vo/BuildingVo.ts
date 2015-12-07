class BuildingVo {
    /**
     * id
     */
    id:number;
    /**
     * 名称
     */
    name:string;
    /**
     * 秒杀
     */
    desc:string;
    /**
     * 建筑类型
     */
    stype:number;
    /**
     * 产出类型
     */
    ptype:number;
    /**
     * 产出效果值
     */
    pValueId:number;
    /**
     * 效果值
     */
    value:number;
    /**
     * 升级消耗公式
     */
    cost:BuildingCostVo[];
    /**
     * 升级1级所需时间
     */
    cd_time:number;
    /**
     * 获得经验
     */
    exp:number;
    /**
     * 消耗比例
     */
    rate:number;
    /**
     * 效果描述
     */
    eff_desc:string;
    /**
     * 消耗道具id的数组
     */
    costIdArr:number[];
    /**
     * 工厂需要的原材料
     */
    costBaseResIdArr:number[];
    /**
     * 如果是工厂，缓存的工厂产出数量
     */
    factoryCacheOutputNumber:number;

    public constructor(obj) {
        this.id = obj["id"];
        this.name = obj["name"];
        this.desc = obj["desc"];
        this.stype = obj["stype"];
        this.ptype = obj["ptype"];
        this.pValueId = obj["pValueId"];
        this.value = obj["value"];
        this.cost = this.getCost(obj["cost"]);
        this.cd_time = obj["cd_time"];
        this.exp = obj["exp"];
        this.rate = obj["rate"];
        this.eff_desc = obj["eff_desc"];
        if (this.stype == BuildingCategory.FACTORY) {
            this.getCostBaseRes(obj["costBaseRes"]);
        }
    }

    private getCostBaseRes(str:string):void {
        var arr = str.split("|");
        this.costBaseResIdArr = [];
        for (var i = 0; i < arr.length; i++) {
            this.costBaseResIdArr.push(int(arr[i]));
        }
    }

    private getCost(arr:any[]):BuildingCostVo[] {
        var costArr:BuildingCostVo[] = [];
        this.costIdArr = [];
        for (var i = 0; i < arr.length; i++) {
            var vo = new BuildingCostVo(arr[i], this.id);
            costArr.push(vo);
            this.costIdArr.push(vo.propId);
        }
        return costArr;
    }

    public get costCacheValue():number[] {
        var arr = [];
        for (var i = 0; i < this.cost.length; i++) {
            arr.push(-this.cost[i].cacheCostCount);
        }
        return arr;
    }
}
