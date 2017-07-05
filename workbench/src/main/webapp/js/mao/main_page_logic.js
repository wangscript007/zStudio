;(function($, win) {
    function handleBodyData(model, result, bodyDataBuilder) {
        var datas = [];
        if (result.status == MaoOrmBase.STATUS_SUCCESS) {
            model.total = result.total;
            datas = result.rows;
        }
        var bodyDatas = [];
        for (var i = 0, len = datas.length; i < len; i++) {
            bodyDatas.push(bodyDataBuilder.call(this, datas[i], model));
        }
        model.bodyDatas = bodyDatas;
        return model;
    }

    function getOperate(tableId, operate, id, mark, name) {
        var colorStr = '499FD6';
        var btn = 'blue';
        if (operate == 'delete') {
            colorStr = 'F47676';
            btn = 'red';
        }

        var title = '';
        if (operate == 'modify') {
            title = '编辑';
        } else if (operate == 'export') {
            title = '导出';
        } else if (operate == 'delete') {
            title = '删除';
        } else if(operate == 'palette'){
            title = '设计';
        }
        var htmlStr = '';
        htmlStr += '<span btn="' + btn + '" class="ict-' + operate + '" style="cursor:pointer;color: #' + colorStr + ';padding-right: 10px;padding-left: 10px;"';
        htmlStr += ' onclick="' + tableId + '.operate(\'' + operate + '\',\'' + id + '\',\'' + mark + '\',\'' + name + '\');"';
        htmlStr += ' title="' + title + '"';
        htmlStr += '>';
        htmlStr += '</span>';
        return htmlStr;
    }

    function handleValueIsTooLong(value) {
        if (value) {
            return '<span class="app-valueToLong" title="' + value + '">' + value + '</span>';
        }
        return '';
    }

    function initBtn() {
        var that = this;
        $('[btn="black"]').hover(function(){
            $(this).css('color', '#499FD6');
        },function(){
            $(this).css('color', '#333');
        });

        $('[btn="blue"]').hover(function(){
            $(this).css('color', '#295977');
        },function(){
            $(this).css('color', '#4c95c3');
        });

        $('[btn="red"]').hover(function(){
            $(this).css('color', '#a94442');
        },function(){
            $(this).css('color', '#F47676');
        });

        $('[item="step"]').hover(function(){
            $(this).find('div[item="title"]').css('color', '#000033');
        },function(){
            $(this).find('div[item="title"]').css('color', '#499FD6');
        });

        $(".app-edit-input").off('blur').on('blur',function(event){
            that.changePageName(event.currentTarget);
        });
    };

    var Model_DataModel = function(infoTable) {
        this.SENCE_MARKS = {};
        this.SENCE_MARKS["1"] = "table";
        this.SENCE_MARKS["2"] = "more-line";
        this.SENCE_MARKS["3"] = "sql";

        this.limit = 10000;

        this.dataModelDataUrl = bcp + 'table/data_model_info_table';

        var modelBaseUrl = '/' + $base_url + '/model/';
        this.validateDataModelUrl = modelBaseUrl + 'validate';
        this.deleteDataModelUrl = modelBaseUrl + 'delete';

        win.modelTable = infoTable;
    };

    Model_DataModel.prototype = {
        init: function() {
            // TODO
            this.packageId = mainIndexLogic.packageId;

            win.modelTable.updateTableUI(this.getUIModel());
            initBtn();
        },

        getUIModel: function () {
            var modelObj = {};
            modelObj.title = '数据模型';
            modelObj.mark = 'one';
            modelObj.total = 0;
            modelObj.headDatas = [
                {field:'SCENE', title:'场景', width: 45},
                {field:'NAME', title:'模型名称', width: 202},
                {field:'CREATOR', title:'创建人', width: 167},
                {field:'UPDATE_TIME', title:'更新时间', width: 155},
                {field:'operate', title:'操作', width: 102}
            ];

            var result = this.getDataModelInfo();
            win.modelTable.total = result.total;
            return handleBodyData.call(this, modelObj, result, this.bodyDataBuilder_dataModel);
        },

        getDataModelInfo: function () {
            var param = {
                columns: [
                    {cname: 'ID'},
                    {cname: 'NAME'},
                    {cname: 'UPDATE_TIME'},
                    {cname: 'SCENE'},
                    {cname: 'CREATOR'}
                ],
                isDistinct: true,
                condition: {
                    "cname":"PACKAGE_ID",
                    "value" : this.packageId,
                    "compare":"="
                },
                orders: [
                    {
                        field: 'UPDATE_TIME',
                        order: 'desc'
                    }
                ]
            };
            var urlAndParam = this.dataModelDataUrl;
            urlAndParam += '?param=' + JSON.stringify(param) + '&offset=0&limit=' + this.limit;
            return $.designerAjax('GET', urlAndParam);
        },

        bodyDataBuilder_dataModel : function(data, model) {
            var bodyData = {};
            bodyData.SCENE = this.getScene(data.SCENE);
            bodyData.NAME = this.handleModelName(data.ID, model.mark, data.NAME);
            bodyData.CREATOR = handleValueIsTooLong(data.CREATOR.split('@')[0]);
            bodyData.UPDATE_TIME = data.UPDATE_TIME;
            var operate = '';
            operate += this.getOperate('model_DataModel', 'modify', data.ID, data.NAME);
            operate += this.getOperate('model_DataModel', 'delete', data.ID, data.NAME);
            bodyData.operate = operate;
            return bodyData;
        },

        getScene: function (scene) {
            var title = '';
            if (scene == 1) {
                title = '绑定已有表';
            } else if (scene == 2) {
                title = '在线设计';
            } else if (scene == 3) {
                title = '自定义SQL';
            }
            return '<span title="' + title + '" class="ict-' + this.getSceneMark(scene) + ' modelScene"></span>';
        },

        getSceneMark: function(scene) {
            return this.SENCE_MARKS['' + scene] || '';
        },

        getOperate : function(tableId, operate, id, name) {
            var colorStr = '499FD6';
            var btn = 'blue';
            if (operate == 'delete') {
                colorStr = 'F47676';
                btn = 'red';
            }

            var title = '';
            if (operate == 'modify') {
                title = '编辑';
            } else if (operate == 'export') {
                title = '导出';
            } else if (operate == 'delete') {
                title = '删除';
            } else if(operate == 'palette'){
                title = '设计';
            }
            var htmlStr = '';
            htmlStr += '<span btn="' + btn + '" class="ict-' + operate + '" style="cursor:pointer;color: #' + colorStr + ';padding-right: 10px;padding-left: 10px;"';
            htmlStr += ' onclick="' + tableId + '.operate(\'' + operate + '\',\'' + id + '\',\'' + name + '\');"';
            htmlStr += ' title="' + title + '"';
            htmlStr += '>';
            htmlStr += '</span>';
            return htmlStr;
        },

        /////////
        operate: function (operate, id) {
			if (maoEnvBase.isCurrentDemoTenant() && 
				(operate == 'new' || operate == 'modify' || operate == 'delete')) {
				tipBox.showMessage(TIP_MSG_DEMO_TENANT_LIMITED, 'info');
				return;
			}
			
            if (operate == 'new') {
                this.newOneModel();
                return;
            }

            if (operate == 'modify') {
                this.modifyOneModel(id);
                return;
            }

            if (operate == 'delete') {
                this.deleteOneModel(id);
                return;
            }

            if(operate == 'query'){
                window.location.href = "data_model_detail.html?operator=view&modelId=" + id + '&packageId=' + this.packageId;
            }
            return false;
        },

        newOneModel : function(){
            if(this.packageId == undefined){
                tipBox.showMessage('请先新增应用。', 'info');
                return false;
            }
            var url = 'data_model_designer.html?';
            url += 'operator=add&packageId=' + this.packageId;
            window.location.href = url;
        },

        modifyOneModel : function(id){
            if(this.validateDataModel('update', encodeURIComponent(JSON.stringify([id])))){
                var url = 'data_model_designer.html?';
                url += 'operator=edit&modelId=' + id + '&packageId=' + this.packageId;
                window.location.href = url;
                return;
            }
            win.modelTable.updateTableUI(this.getUIModel());
        },

        deleteOneModel : function(id){
            var that = this;
            if(this.validateDataModel('delete', encodeURIComponent(JSON.stringify([id])))){
                bootbox.confirm('数据模型删除后不可恢复，确认删除吗？', function(result) {
                    if (result) {
                        var ids = [];
                        ids.push(id);
                        var url = that.deleteDataModelUrl;
                        url += '?modelId=' + encodeURIComponent(JSON.stringify(ids));

                        var resultReturn = $.designerAjax('DELETE', url);
                        if (resultReturn.status == MaoOrmBase.STATUS_SUCCESS) {
                            tipBox.showMessage('删除数据模型成功。', 'info');
                            win.modelTable.updateTableUI(that.getUIModel());
                            return;
                        }
                        tipBox.showMessage('删除数据模型失败。' + resultReturn.message,'error');
                    }
                });
                return;
            }
            this.infoTable.updateTableUI(this.getUIModel());
        },

        validateDataModel : function(validateType, modelId){
            var url = this.validateDataModelUrl;
            url += '?validateType=' + validateType;
            url += '&modelId=' + modelId;

            var result = $.designerAjax('GET', url);
            if(result.status == MaoOrmBase.STATUS_SUCCESS) {
                return true;
            }

            tipBox.showMessage(result.message, 'error');
            return false;
        },

        handleModelName: function (id, mark, name) {
            if (name) {
                var htmlStr = '<span class="app-name-span app-valueToLong" style="cursor:pointer;" class="app-valueToLong" ';
                htmlStr += ' onclick="model_DataModel.operate(\'query\',\'' + id + '\',\'' + mark + '\',\'' + name + '\');"';
                htmlStr += ' title="' + name + '"';
                htmlStr += '>';
                htmlStr += name;
                htmlStr += '</span>';
                return htmlStr;
            }
            return '';
        }
    };

    var InfoTable = function(config) {
        this.totalId = config.totalId;
        this.tableId = config.tableId;
        this.total = config.total;
    };

    InfoTable.prototype = {
        constructor : InfoTable,

        updateTableUI: function (model,successCallBack) {
            $('#' + this.totalId).html(model.total);
            $('#' + this.tableId + ' tbody').html(this.getTableBody(model));
            this.resizeDiv();
            if(successCallBack){
                successCallBack();
            }
        },

        getTableBody: function (model) {
            var bodyDatas = model.bodyDatas;
            if (bodyDatas.length == 0) {
                return "";
            }
            var htmlStr = '';
            var headDatas = model.headDatas;
            for (var i = 0, len = bodyDatas.length; i < len; i++) {
                var bodyData = bodyDatas[i];
                htmlStr += '<tr>';
                for (var j = 0, len2 = headDatas.length; j < len2; j++) {
                    var headData = headDatas[j];
                    for (var field in bodyData) {
                        if (field == headData.field) {
                            htmlStr += '<td class="app-tableTd" style="';
                            var tdStyle = 'font-size:14px;';

                            if (model.mark == 'one') {
                                if (j == 0) {
                                    htmlStr += 'font-size:20px;';
                                } else if (j == 1) {
                                    htmlStr += tdStyle;
                                }
                            } else {
                                if (j == 0) {
                                    htmlStr += tdStyle;
                                }
                                if(j == headDatas.length - 1){
                                    htmlStr += "display:inline-block;"
                                }
                            }

                            if(j == headDatas.length - 1){
                                //最后操作列字体大小16px
                                htmlStr += "font-size:16px;"
                            }

                            htmlStr += '">';
                            htmlStr += bodyData[field];
                            htmlStr += '</td>';
                        }
                    }
                }
                htmlStr += '</tr>';
            }
            return htmlStr;
        },

        resizeDiv: function(){
            var bodyHeight = $(window).height() - 15;
            var $div = $('#' + this.tableId + ' tbody').parentsUntil('.row');
            if($div.hasClass("mCustomScrollbar")){
                $div.mCustomScrollbar("destroy");
            }
            //考虑换行的问题 476px--换行临界点
            var  total = this.total;
            if(($(window).width()-250)/2 < 476){
                total = total * 2;
            }
            if(Math.floor((bodyHeight-400)/70) < total ){
                //加滚动条
                var scrollHeight = (bodyHeight-350)/2;
                if(scrollHeight < 55){
                    scrollHeight = 55;
                }
                $div.mCustomScrollbar({ setHeight: scrollHeight, theme: "dark"});
            }
        }
    };

    var MainIndexLogic = function () {
        this.packageId = '';    // TODO !!!!
        this.pageDataUrl = bcp + 'table/view_bcp_re_form_model';
        this.limit = 10000;

        this.MARK_FORM = "two";
        this.MARK_LIST = "three";
        this.MARK_CHART = "four";

        this.PAGE_TYPES = {};
        this.PAGE_TYPES[this.MARK_FORM] = '表单';
        this.PAGE_TYPES[this.MARK_LIST] = '列表';
        this.PAGE_TYPES[this.MARK_CHART] = '图表';
    };

    MainIndexLogic.prototype = {
        init: function () {
            this.initUI();
            initBtn();
        },
        initUI: function () {
            this.mark2table = {};
            this.mark2table[this.MARK_FORM] = tableForm;
            this.mark2table[this.MARK_LIST] = tableList;
            this.mark2table[this.MARK_CHART] = tableChart;

            tableForm.updateTableUI(this.getUIModel(this.MARK_FORM),mainIndexLogic.initEvent);
            tableList.updateTableUI(this.getUIModel(this.MARK_LIST),mainIndexLogic.initEvent);
            tableChart.updateTableUI(this.getUIModel(this.MARK_CHART),mainIndexLogic.initEvent);
        },

        initEvent: function(){
            $(".app-edit-input").off('blur').on('blur',function(event){
                mainIndexLogic.changePageName(event.currentTarget);
            });
        },

        getPageInfo: function (packageId, type) {
            var param = {
                columns: [
                    {cname: 'ID'},
                    {cname: 'NAME'},
                    {cname: 'FORMURL'},
                    {cname: 'CREATOR'},
                    {cname: 'CREATETIME'},
                    {cname: 'MODELID'},
                    {cname: 'MODELNAME'}
                ],
                isDistinct: true,
                condition: {
                    "and" :[
                        {
                            "cname":"PACKAGEID",
                            "value" : packageId,
                            "compare":"="
                        },{
                            "cname":"TYPE",
                            "value" : type,
                            "compare":"="
                        }
                    ]
                },
                orders: [
                    {
                        field: 'CREATETIME',
                        order: 'desc'
                    }
                ]
            };

            var urlAndParam = this.pageDataUrl;
            urlAndParam += '?param=' + JSON.stringify(param) + '&offset=0&limit=' + this.limit;
            return $.designerAjax('GET', urlAndParam);
        },

        getUIModel: function (mark) {
            var title = this.PAGE_TYPES[mark];
            var modelObj = {};
            modelObj.title = title;
            modelObj.mark = mark;
            modelObj.total = 0;
            modelObj.headDatas = [
                {field:'NAME', title:title + '名称', width: 200},
                {field:'MODELNAME', title:'模型名称', width: 94},
                {field:'CREATOR', title:'创建人', width: 100},
                {field:'CREATETIME', title:'创建时间', width: 220},
                {field:'operate', title:'操作', width: 76}
            ];

            var result = this.getPageInfo(this.packageId, modelObj.title);
            this.mark2table[mark].total = result.total;
            return handleBodyData.call(this, modelObj, result, this.bodyDataBuilder_page);
        },

        bodyDataBuilder_page : function(data, model) {
            var bodyData = {};
            bodyData.NAME = this.handlePageName(data.ID, model.mark, data.NAME, data.FORMURL);
            bodyData.MODELNAME = this.handleModelIdValueIsTooLong(data.MODELNAME);
            bodyData.FORMURL = handleValueIsTooLong(data.FORMURL);
            bodyData.CREATOR = this.handleNull(data.CREATOR);
            bodyData.CREATETIME = this.handleNull(data.CREATETIME);
            var operate = '';
            operate += getOperate('mainIndexLogic', 'palette', data.MODELID, model.mark, data.FORMURL); //设计
            operate += getOperate('mainIndexLogic', 'modify', data.ID, model.mark, data.NAME);
            operate += getOperate('mainIndexLogic', 'delete', data.ID, model.mark, data.NAME);
            bodyData.operate = operate;
            return bodyData;
        },

        operate: function (operate, id, mark, name) {
            this.pageModelOperate(operate, id, name, mark, this.packageId);
        },
        newPageModel : function(mark, packageId) {
            if(packageId == undefined){
                tipBox.showMessage('请先新增应用。', 'info');
                return false;
            }

            //检查是否创建了数据模型
            var columns = ["ID"];
            var conditions = [];
            var condition = new QueryCondition();
            condition.setCName("PACKAGE_ID").setCompare("=").setValue(packageId);
            conditions.push(condition);
            var dataModelObj = maoOrmBase.query("data_model_info_table",JSON.stringify(columns),generateCondition(conditions, 'and'));
            if(dataModelObj.rows.length < 1){
                tipBox.showMessage('请先新增数据模型。', 'info');
                return false;
            }

            showModalDialog("dialogApp",'新建页面','add_package_page.html?operator=add&packageId='+packageId+'&type='+mark);
        },
        modifyPageModel : function(id){
            $('#spanName_'+id).hide();
            var t=$('#inputName_'+id).val();
            $('#inputName_'+id).removeClass('hide').focus().val(t);
        },
        deletePageModel : function(id,mark){
            var that = this;
            bootbox.confirm(('确定要删除吗?'),function(result){
                if(result){
                    var condition = new QueryCondition();
                    condition.setCName("id");
                    condition.setValue(id);
                    condition.setCompare("=");
                    maoOrmBase.delete("bcp_re_form", condition, function(){});

                    that.mark2table[mark].updateTableUI(that.getUIModel(mark),mainIndexLogic.initEvent);
                    tipBox.showMessage("删除页面成功。", 'info');
                }
            })
        },

        pageModelOperate: function (operate, id, name, mark, packageId) {
			if (maoEnvBase.isCurrentDemoTenant() && 
				(operate == 'new' || operate == 'modify' || operate == 'delete')) {
				tipBox.showMessage(TIP_MSG_DEMO_TENANT_LIMITED, 'info');
				return;
			}
			
            if(operate == 'view'){
                showModalDialog("dialogApp", "页面详情", "add_package_page.html?operator=view&packageId=" + packageId + '&id=' + id);
                return;
            }

            if (operate == 'new') {
                this.newPageModel(mark, packageId);
                return;
            }

            if (operate == 'modify') {
                this.modifyPageModel(id);
                return;
            }

            if (operate == 'delete') {
                this.deletePageModel(id, mark);
                return;
            }

            if (operate == 'palette') { //设计
                this.designClick(id, name, mark);
            }
        },

        handlePageName: function(id, mark, name){
            if (name) {
                var htmlStr = '<input id="inputName_' + id + '" type="text" class="app-edit-input hide" value="' + name + '" param="' + id + '||' + name + '||'+mark+'"><span class="app-name-span app-valueToLong" id="spanName_' + id + '" style="cursor:pointer;" class="app-valueToLong" ';
                htmlStr += ' onclick="mainIndexLogic.operate(\'view\',\'' + id + '\',\'' + mark + '\',\'' + name + '\');"';
                htmlStr += ' title="' + name + '"';
                htmlStr += '>';
                htmlStr += name;
                htmlStr += '</span>';
                return htmlStr;
            }
            return '';
        },
        handleModelIdValueIsTooLong:function(value) {
            if (value) {
                return '<span class="app-modelValueToLong" title="' + value + '">' + value + '</span>';
            }
            return '';
        },
        handleNull: function (value) {
            return '<span class="app-descValueToLong">'+ value + '</span>'; //value || '';  //
        },

        changePageName: function(param) {
            //formUrl,pageName,i
            var paramArr = $(param).attr('param').split("||");
            var id = paramArr[0];
            var oldPageName = paramArr[1];
            var mark = paramArr[2];
            var newPageName = $(param).val();

            //判断是否修改过
            if (oldPageName == newPageName) {
                $('#spanName_'+id).show();
                $('#inputName_'+id).addClass('hide');
                return;
            }

            if (newPageName == "") {
                $(param).parent().parent().find('.app-edit-input').addClass('hide').val(oldPageName);
                $(param).parent().parent().find('#spanName_'+id).val(oldPageName).removeClass('hide').css('display','block');
                $("#spanModifyBtn_"+id).removeClass("hide");
                return;
            }

            //验证输入合法性
            var reg = /^(?!_)(?!.*?_$)[-a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/;///^(?!_)(?!.*?_$)[-a-zA-Z0-9_\u4e00-\u9fa5]{1,50}$/;
            if(!reg.test(newPageName)) {
                tipBox.showMessage('名称不能使用特殊字符或下划线开头结尾,长度不能超过20个字符。', 'error');
                return;
            }

            //验证名称是否已经使用
            if(this.checkValueExist(newPageName,mark)){
                tipBox.showMessage('该名称已经被使用。', 'error');
                return;
            }

            maoOrmBase.update('bcp_re_form', '["name"]', '["' + newPageName + '"]', {
                "cname": "id",
                "compare": "=",
                "value": id
            }, function () {
                tipBox.showMessage('修改成功', 'info');
                $('#spanName_' + id).removeClass('hide');
                $('#inputName_' + id).addClass('hide');
            });

            this.mark2table[mark].updateTableUI(this.getUIModel(mark),mainIndexLogic.initEvent);
        },

        designClick: function(id,name,mark){
            var url = "";
            if(mark ==='four'){
                url = url +'/datavisual/index.html?file='+ encodeURIComponent(name+'&pname=default&version=1.0');
            }else{
                url = url +'/designer/index.html?file='+encodeURIComponent(name+'&pname=default&version=1.0')+'&dmid='+id;
            }
            window.open(url + '&appid='+ this.packageId);
        },

        checkValueExist: function(value,mark) {
            var conditions = [];
            var con = new QueryCondition();
            con.setCName("name").setCompare("=").setValue(value);

            var conType = new QueryCondition();
            conType.setCName("type").setCompare("=").setValue(this.PAGE_TYPES[mark]);

            var conditionsName = [];
            conditionsName.push(con);
            conditionsName.push(conType);
            conditions.push(generateCondition(conditionsName,"and"));
            
            var obj = maoOrmBase.query("bcp_re_form",'["type"]', generateCondition(conditions,"or"));
            if(obj && obj.rows.length > 0){
                return true;
            }else{
                return false;
            }
        }
    };

    $(win).resize(function () {
        win.modelTable.resizeDiv();
        win.tableForm.resizeDiv();
        win.tableList.resizeDiv();
        win.tableChart.resizeDiv();
    })

    var model_DataModel = new Model_DataModel();
    var mainIndexLogic = new MainIndexLogic();

    win.model_DataModel = model_DataModel;
    win.mainIndexLogic = mainIndexLogic;
    win.tableForm = new InfoTable({
        totalId: 'form_total',
        tableId: 'form_table',
        total: 0
    });
    win.tableList = new InfoTable({
        totalId: 'list_total',
        tableId: 'list_table',
        total: 0
    });
    win.tableChart = new InfoTable({
        totalId: 'chart_total',
        tableId: 'chart_table',
        total: 0
    });

    win.modelTable = new InfoTable({
        totalId: 'one_total_454545221155321',
        tableId: 'one_454545221155321',
        total: 0
    });

    $(document).ready(function(){
        model_DataModel.init();
        mainIndexLogic.init();
    });
}(jQuery, window));

