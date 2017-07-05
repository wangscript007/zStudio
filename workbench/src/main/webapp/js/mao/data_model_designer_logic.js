/**
 * 数据模型设计缓存数据对象
 */
var dataModelDesigner = {
    currentIndex: 0,/* 当前步骤 */
    previousIndex: 0,/* 上一步骤 */
    isClick: true,/* 是否点击导航栏步骤 */
    modelItemGroups: {},/* 面板分组对象 */
    isExecute: false,/* 第三种场景时，需要判断是否已经执行了自定义SQL，在场景切换或修改时需要清理自定义SQL生成的表或者视图 */
    toTab: false,/* 是否跳转到下一个导航步骤 */
    isTwoTabInit: false,/* 在场景一或者三时，判断是否是第二个导航步骤的初始化，如果是初始化需要向后台获取表字段信息或者执行自定义SQL，如果不是就从缓存对象直接获取并初始化 */
    operator: '',//add,edit,view
    dataModelDesignerBaseInfo: {},/* 数据模型基础信息缓存对象 */
    dataModelDesignerAssociatedInformation: {/* 数据模型相关信息缓存对象 */
        dataItems: [],/* 数据项缓存对象 */
        globalizationSelectVal: '',/* 保存已选择的国际化文件 */
        uploadFileVal: '',/* 保存上传的国际化文件值 */
        dataModelStep: '1'/* 第三种场景，导航第二步的步骤，值为“1”时是编辑自定义SQL，值为“2”时是根据自定义SQL生成的表或视图，初始化或编辑数据项 */
    }
};

var DataModelDesignerLogic = function () {
};

DataModelDesignerLogic.prototype = {
    dataModelInfoVm: 'vm1474438052605',
    dataModelDesignVm: 'vm1474438053626',
    dataModelDetailVm: 'vm1474438053628',
    dataModelInfoUrl: '',
    dataModelDesignUrl: '',
    dataModelDetailUrl: '',
    /**
     * 初始化路径
     */
    initUrl: function () {
        var baseUrl = '/' + $base_url + '/';
        this.dataModelInfoUrl = baseUrl + 'data_model_info.html';
        this.dataModelDesignUrl = baseUrl + 'data_model_design.html';
        this.dataModelDetailUrl = baseUrl + 'data_model_detail_operate.html';
    },
    /**
     * 根据id获取html元素对象
     */
    getComponentById: function (id) {
        return $('#' + id);
    },
    /**
     * 页面初识话
     */
    init: function () {
        this.initUrl();
        this.initdataModelInfo();
    },
    /**
     *初始化数据模型基本信息界面
     */
    initdataModelInfo: function () {
        this.htmlByVm(this.dataModelInfoVm, this.ajaxHtml(this.dataModelInfoUrl));
    },
    /**
     *初始化数据模型设计界面
     */
    initdataModelDesign: function () {
        this.htmlByVm(this.dataModelDesignVm, this.ajaxHtml(this.dataModelDesignUrl));
    },
    /**
     *初始化数据模型详细信息界面
     */
    initdataModelDetail: function () {
        this.htmlByVm(this.dataModelDetailVm, this.ajaxHtml(this.dataModelDetailUrl));
        dataModelDetailLogic.init();
    },
    /**
     *根据vmId添加html元素
     */
    appendHtmlByVm: function (vmId, data) {
        this.getComponentById(vmId).append(data);
    },
    /**
     *根据vmId设置html元素
     */
    htmlByVm: function (vmId, data) {
        this.getComponentById(vmId).html(data);
    },
    /**
     *请求html数据
     */
    ajaxHtml: function (url) {
        var result = '';
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'text',
            async: false,
            cache: false,
            success: function (data) {
                result = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("textStatus " + textStatus + " errorThrown "
                    + errorThrown + " url "  + url);
                tipBox.showMessage('请求错误。','error');
            }
        });
        return result;
    },
    /**
     * 显示导航进度
     */
    showByIndex: function (index) {
        if (index == 0) {
            $("#mi").removeClass('done').addClass('active');
            $("#md").removeClass('active','done');
            $("#mo").removeClass('active','done');
            $(".progress-bar-success").css("width", (1 / 3 * 100) +"%");
            this.getComponentById(this.dataModelInfoVm).show();
            this.getComponentById(this.dataModelDesignVm).hide();
            this.getComponentById(this.dataModelDetailVm).hide();
            return;
        }
        if (index == 1) {
            $("#mi").removeClass('active').addClass('done');
            $("#md").removeClass('done').addClass('active');
            $("#mo").removeClass('active').removeClass('done');
            $(".progress-bar-success").css("width", (2 / 3 * 100) + "%");
            this.getComponentById(this.dataModelInfoVm).hide();
            this.getComponentById(this.dataModelDesignVm).show();
            this.getComponentById(this.dataModelDetailVm).hide();
            return;
        }
        if (index == 2) {
            $("#mi").removeClass('active').addClass('done');
            $("#md").removeClass('active').addClass('done');
            $("#mo").removeClass('done').removeClass('active');
            $(".progress-bar-success").css("width", 100 +"%");
            this.getComponentById(this.dataModelInfoVm).hide();
            this.getComponentById(this.dataModelDesignVm).hide();
            this.getComponentById(this.dataModelDetailVm).show();
        }
    },
    /**
     * 获取数据模型基本信息
     */
    getDataModelDesignerBaseInfo: function () {
        return dataModelDesigner.dataModelDesignerBaseInfo;
    },
    /**
     *跳转到导航第一步
     */
    toTabClickZore: function () {
        var clickedIndex = 0;
        this.showByIndex(clickedIndex);
        this.initdataModelInfo();
        dataModelDesigner.currentIndex = 0;
        dataModelDesigner.previousIndex = 0;
    },
    /**
     *点击导航第一步
     */
    onTabClickZore: function (e, clickedPreviousIndex) {
        if (dataModelDesigner.isClick == false) {
            this.toTabClickZore();
            return;
        }
        if (clickedPreviousIndex == 0) {
            return;
        }
        if (clickedPreviousIndex == 1) {
            var scene = this.getDataModelDesignerBaseInfo().SCENE;
            if (scene == '3'
                    && dataModelDesigner.dataModelDesignerAssociatedInformation.dataModelStep == '2'
                    && dataModelDesigner.operator) {
                dataModelDesignLogic.previousStepInitDataModelDesigner();
                this.toTabClickZore();
                return;
            }
            this.getComponentById('button14815327374600').click();
            return;
        }
        if (clickedPreviousIndex == 2) {
            this.toTabClickZore();
        }
    },
    /**
     *跳转到导航第二步
     */
    toTabClickOne: function (e) {
        var clickedIndex = 1;
            this.showByIndex(clickedIndex);
            this.initdataModelDesign();
            dataModelDesigner.currentIndex = 1;
            dataModelDesigner.previousIndex = 1;
        if (e) {
            e.preventDefault();
        }
    },
    /**
     *点击导航第二步
     */
    onTabClickOne: function (e, clickedPreviousIndex) {
        if (dataModelDesigner.isClick == false) {
            this.toTabClickOne(e);
            return;
        }

        if (clickedPreviousIndex == 0) {
            this.getComponentById('button14816092528980').click();
            if (e) {
                e.preventDefault();
            }
            return;
        }

        if (clickedPreviousIndex == 1) {
            return;
        }

        if (clickedPreviousIndex == 2) {
            this.getComponentById('button14815327374600b').click();
        }
    },
    /**
     *跳转到导航第三步
     */
    toTabClickTwo: function (e) {
        var clickedIndex = 2;
        this.showByIndex(clickedIndex);
        dataModelDesigner.currentIndex = 2;
        dataModelDesigner.previousIndex = 2;
        this.initdataModelDetail();
        if (e) {
            e.preventDefault();
        }
    },
    /**
     *点击导航第三步
     */
    onTabClickTwo: function (e, clickedPreviousIndex) {
        if (dataModelDesigner.isClick == false) {
            this.toTabClickTwo(e);
            return;
        }

        if (clickedPreviousIndex == 0) {
            if (dataModelInfo.verificationSenceOrBindTableIsChange()) {
                dataModelInfo.getData();
                this.toTabClickTwo(e);
                return;
            }
            this.showByIndex(0);
            if (e) {
                e.preventDefault();
            }
            return;
        }

        if (clickedPreviousIndex == 1) {
            var scene = this.getDataModelDesignerBaseInfo().SCENE;
            if (scene == '3'
                && dataModelDesigner.dataModelDesignerAssociatedInformation.dataModelStep == '1') {
                tipBox.showMessage('您可能对数据有进一步的操作。','info');
            }
            this.getComponentById('button14815327398760').click();
            if (scene != '3'
                || (scene == '3'
                    && dataModelDesigner.dataModelDesignerAssociatedInformation.dataModelStep == '2')) {
                this.toTabClickTwo(e);
            }
        }
    },
    /**
     * 点击导航
     */
    onTabClick: function (e, clickedIndex, clickedPreviousIndex) {
        if(clickedIndex == 0) {
            this.onTabClickZore(e, clickedPreviousIndex);
            return;
        }
        if(clickedIndex == 1) {
            this.onTabClickOne(e, clickedPreviousIndex);
            return;
        }
        if(clickedIndex == 2) {
            this.onTabClickTwo(e, clickedPreviousIndex);
        }
    }
};

var dataModelDesignerLogic = new DataModelDesignerLogic();
var pageDocumentReadyAfter = function () {
    dataModelDesignerLogic.init();
};