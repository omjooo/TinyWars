class StoreBuildingItem extends BuildingItemBase {
    public constructor(type) {
        super(type);

        this.skinName = new StoreBuildingItemSkin();
    }


    protected createChildren() {
        super.createChildren();

    }

    /**
     * @override
     */
    protected updateView(){
        super.updateView();

        var num:number = Player.instance.getResourceCapacity(this.vo.pValueId);
        this.effectTF.text = "存储上限:" + Util.getBigNumberShow(num);
    }
}