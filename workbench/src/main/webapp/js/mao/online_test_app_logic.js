;(function($,win){
    var AppListTable = function(){
        this.queryDataTableUrl = bcp + "table/view_processpackage";
        this.limit = 10000;
        this.totalId =  "app_total";
        this.tableId = "app_table";
        this.totalRecord = 0;
    };

    AppListTable.prototype = {
        init: function() {
            this.updateTableUI(this.getUIModel());
            this.initEvent();
            var hostname = window.location.hostname;
            $("#onlineTest").attr("href","http://"+hostname+":9080/server").attr('target', '_black');
            $("#localDownload").attr("href","http://"+hostname+"/resources/download/zServer-distro-0.5.0-SNAPSHOT.zip");
        },
        updateTableUI: function (model) {
            $('#' + this.totalId).html(model.total);
            $('#' + this.tableId + ' tbody').html(this.getTableBody(model));
            this.resizeDiv();
        },

        initEvent: function(){
            var that = this;
            $('button.ict-userDispatch').on('click',function(event){
                that.userDispatchClick(event.currentTarget)
            });

            $('button.ict-export').on('click',function(event){
                that.exportClick(event.currentTarget);
            });

            $('.app-name-span').on('click', function(event){
                window.location.href = 'app-design-main.html?appid='+ $(event.currentTarget).attr('param');
            })

            $('tr').on('click', function(event){
               that.trClick(event.currentTarget);
            })
        },

        checkContainListAndChart: function(param){
            var paramArr = param.split('||');
            var total =  parseInt(paramArr[3]) + parseInt(paramArr[4]);
            return total < 1;
        },

        userDispatchClick: function(e){
            if(this.checkContainListAndChart($(e).attr('param'))){
                tipBox.showMessage('应用中不包含列表或图表页面，不能在线测试。', 'error');
                return ;
            }

            $(this).attr("param",$(e).attr('param'));
            packageProcessLogic.mockClick(this);
        },

        exportClick: function(e){
            if(this.checkContainListAndChart($(e).attr('param'))){
                tipBox.showMessage('应用中不包含列表或图表页面，不能导出。', 'error');
                return ;
            }

            $(this).attr("param",$(e).attr('param'));
            packageProcessLogic.exportClick(this);
        },

        trClick: function (e) {
            var clz = $(e).attr('class');
            $('tr').attr('class', '');
            if(clz != 'app-onlineTestTrSelected'){
                //取消选中
                $(e).attr('class', 'app-onlineTestTrSelected');
            }
        },

        initAttachedEvent:function(){
            var that = this;
            $('#onlineTestBtn').on('click',function(event){
                that.userDispatchClick(event.currentTarget)
            });

            $('#exportBtn').on('click',function(event){
                that.exportClick(event.currentTarget)
            });
        },

        getUIModel: function () {
            var modelObj = {};
            modelObj.title = '应用列表';
            modelObj.total = 0;
            modelObj.headDatas = [
                {field:'PACKAGENAME', title:'应用名称', width: 200},
                {field:'FORMNUM', title:'表单', width: 150},
                {field:'LISTNUM', title:'列表', width: 150},
                {field:'CHARTNUM', title:'图表', width: 150},
                {field:'CREATOR', title:'创建人', width: 100},
                {field:'CREATETIME', title:'创建时间', width: 150},
                {field:'operate', title:'操作', width: 176}
            ];

            var result = this.getAppDataInfo();
            modelObj.total = result.total;
            this.totalRecord = result.total;
            return this.handleBodyData( modelObj, result, this.bodyDataBuilder_dataModel);
        },

        handleBodyData: function(model, result, bodyDataBuilder) {
            var datas = [];
            if (result.status == MaoOrmBase.STATUS_SUCCESS) {
                datas = result.rows;
            }
            var bodyDatas = [];
            for (var i = 0, len = datas.length; i < len; i++) {
                bodyDatas.push(bodyDataBuilder.call(this, datas[i], model));
            }
            model.bodyDatas = bodyDatas;
            return model;
        },

        getAppDataInfo: function () {

            //读表格数据
            var param = {
                columns: [
                    {cname: 'ID'},
                    {cname: 'PACKAGENAME'},
                    {cname: 'CREATETIME'},
                    {cname: 'MODIFYTIME'},
                    {cname: 'CREATOR'},
                    {cname: 'DESC'},
                    {cname: 'CHARTNUM'},
                    {cname: 'LISTNUM'},
                    {cname: 'FORMNUM'}
                ],
                isDistinct: true,
                condition: {
                },
                orders: [
                    {
                        field: 'MODIFYTIME',
                        order: 'desc'
                    }
                ]
            };
            var urlAndParam = this.queryDataTableUrl;
            urlAndParam += '?param=' + JSON.stringify(param) + '&offset=0&limit=' + this.limit;
            return $.designerAjax('GET', urlAndParam);
        },

        bodyDataBuilder_dataModel : function(data, model) {
            var bodyData = {};
            var interceptPackName = commonUtil.interceptName(data.PACKAGENAME.trim(),20);
            bodyData.PACKAGENAME = this.handleNameValue(interceptPackName, data.PACKAGENAME, data.ID);
            bodyData.CREATETIME = data.CREATETIME;
            bodyData.CREATOR = data.CREATOR.split('@')[0];
            bodyData.DESC = this.handleValueIsTooLong('app-descValueToLong', data.DESC);
            bodyData.FORMNUM = this.handleNumValue(data.FORMNUM);
            bodyData.LISTNUM = this.handleNumValue(data.LISTNUM);
            bodyData.CHARTNUM = this.handleNumValue(data.CHARTNUM);
            var operate = '';
            operate += this.getOperate('userDispatch', data.ID, data.PACKAGENAME, data.FORMNUM, data.LISTNUM, data.CHARTNUM); //在线测试
            operate += this.getOperate('export', data.ID, data.PACKAGENAME, data.FORMNUM, data.LISTNUM, data.CHARTNUM); //导出
            bodyData.operate = operate;
            return bodyData;
        },

        handleNameValue: function(shortName, value, appid) {
            if (value) {
                return '<span class="app-name-span " style="cursor: pointer;" title="' + value + '" param="'+ appid +'">' + shortName + '</span>';
            }
            return '';
        },

        handleValueIsTooLong: function(style, value) {
            if (value) {
                return '<span class="' + style + '" title="' + value + '">' + value + '</span>';
            }
            return '';
        },

        handleNumValue: function(value){
            if(value !== undefined){
                return '<span btn="white" class="badge total">' + value + '</span>'
            }
            return '';
        },

        resizeDiv: function(){
            var bodyHeight = $(window).height() - 15;
            var $tbody = $('#' + this.tableId + ' tbody');
            var $div = $tbody.parentsUntil('.row');
            if($div.hasClass("mCustomScrollbar")){
                $div.mCustomScrollbar("destroy");
            }
            //考虑换行：
            var  total = this.totalRecord;
            if(($(window).width()-70)*0.72 < 815){
                total = total * 2;
            }
            //div 最小高度570 - 表头高度110
            if(Math.floor((570-110)/45) < total ){
                //加滚动条
                $div.mCustomScrollbar({ setHeight: (570-130), theme: "dark" });
                $tbody.find('.first-td').attr('style','padding-left:8px;');
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
                htmlStr += '<tr';
                if($(bodyData.PACKAGENAME).attr('param') == getUrlParam("appid",window.location.search)){
                    htmlStr += ' class="app-onlineTestTrSelected"';
                }
                htmlStr += '>'
                for (var j = 0, len2 = headDatas.length; j < len2; j++) {
                    var headData = headDatas[j];
                    for (var field in bodyData) {
                        if (field == headData.field) {
                            htmlStr += '<td class="app-onlineTestTableTd';
                            if(j == 0){
                               htmlStr += ' first-td'; 
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

        getOperate : function(operate, id, name, formNum, listNum, chartNum) {
            var title = "导出";
            if (operate == 'userDispatch') {
                title = "在线测试";
            }

            var htmlStr = '';
            htmlStr += '<button class="ict-'+ operate +' btn btn-default btn-sm headBtn" ';
            htmlStr += ' param="' + id + '||' + name + '||' + formNum + '||' + listNum + '||' + chartNum + '"';
            htmlStr += ' title="' + title + '"';
            htmlStr += '>&nbsp;' + title;
            htmlStr += '</button>&nbsp;&nbsp;';
            return htmlStr;
        }
    };

    win.appListTable = new AppListTable();

    $(win).resize(function () {
        appListTable.resizeDiv();
    });
}(jQuery, window));

$(document).ready(function(){
    appListTable.init();
})