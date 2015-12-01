class MainScene extends SceneBase {
    public constructor() {
        super();

        this.skinName = new MainSceneSkin();


    }

    private btnHome:eui.Button;
    private btnBuilding:eui.Button;
    private btnTechnology:eui.Button;
    private btnCamp:eui.Button;
    private btnAlliance:eui.Button;
    private btnShop:eui.Button;
    private btnSetting:eui.Button;
    private topGroup:eui.Group;

    private menuTab:SimpleTab;
    private resItemArr:ResItemBase[];
    private landscape:Landscape;
    private viewPanel:SlidePanelBase;


    protected createChildren() {
        super.createChildren();

        this.initMenuTab();
        this.initResItem();
        this.initLandscape();
    }

    private initMenuTab() {
        var arr = [
            new MenuTabButton(this.btnHome, "menu_food_png"),
            new MenuTabButton(this.btnBuilding, "menu_build_png"),
            new MenuTabButton(this.btnTechnology, "menu_technology_png"),
            new MenuTabButton(this.btnCamp, "menu_war_png"),
            new MenuTabButton(this.btnAlliance, "menu_union_png"),
            new MenuTabButton(this.btnShop, "menu_shop_png"),
            new MenuTabButton(this.btnSetting, "menu_setting_png")
        ];
        this.menuTab = new SimpleTab(arr);
        this.menuTab.itemChangeCallback = this.onMenuTabItemChange.bind(this);
        this.menuTab.selectIndex = 0;
    }

    private initResItem() {
        this.resItemArr = [];
        for (var i = 1; i <= 3; i++) {
            var item:ResItemBase = new FirstResItem(i);
            item.x = 10 + (i - 1) * 210;
            item.y = 5;
            this.topGroup.addChild(item);
            this.resItemArr.push(item);
        }
        for (var i = 4; i <= 7; i++) {
            var item:ResItemBase = new SecondResItem(i);
            item.x = 10 + ((i - 4) % 2) * 315;
            item.y = 56 + int((i - 4) / 2) * 39;
            this.topGroup.addChild(item);
            this.resItemArr.push(item);
        }
        for (var i = 8; i <= 10; i++) {
            var item:ResItemBase = new ThirdResItem(i);
            item.x = 10 + (i - 8) * 210;
            item.y = 134;
            this.topGroup.addChild(item);
            this.resItemArr.push(item);
        }
    }

    /**
     * 创建连环场景
     */
    private initLandscape() {
        this.landscape = new Landscape();
        this.landscape.y = 174;
        this.addChild(this.landscape);
    }

    private onMenuTabItemChange(index:number) {
        var arr = [ClickResPanel];
        if(this.viewPanel){
            this.viewPanel.hide();
        }
        this.viewPanel = new arr[index]();
        this.viewPanel.y = 300;
        this.viewPanel.viewParent = this;
    }


    protected destroy() {
        this.menuTab.destroy();
        this.landscape.destroy();
    }
}