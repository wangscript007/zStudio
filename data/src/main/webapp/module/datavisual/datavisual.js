/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
	var LOCAL_STORAGE_KEY_GUIDE_VIEWS = 'guide_data_views';
    var LOCAL_STORAGE_KEY_GUIDE_DRAG_COMPONENT = 'guide_data_drag_comp';

	function _showGuide() {
        var steps = [];
		
		if (storage.isStorage && !storage.get(LOCAL_STORAGE_KEY_GUIDE_VIEWS)) {
			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".navbar-header",
				text: '这里是<span class="guide-highlight">工具视图</span>'
			});

			var pageHeight = $(window).height();
			steps.push({
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#zstudio-component"],
				tipPosition: {
					top: pageHeight / 2,
					left: 200
				},
				text: '这里是<span class="guide-highlight">组件视图</span>，是存放页面设计器组件的面板'
			});
			
			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".demo",
				text: '这里是<span class="guide-highlight">设计区视图</span>，请将组件拖曳到此区域'
			});
			
			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".form-layout-east",
				text: '这里是<span class="guide-highlight">属性视图</span>，是设置组件属性的区域'
			});
			
			if (storage.isStorage) {
                storage.put(LOCAL_STORAGE_KEY_GUIDE_VIEWS, true);
            }
		}
		
        if (storage.isStorage && !storage.get(LOCAL_STORAGE_KEY_GUIDE_DRAG_COMPONENT)) {
            var to_demo = _getDemoRegion();

            steps.push({
                type: cranberry.TYPE_FROM_TO,
                from: "#zstudio-component",
                to: to_demo,
                text: '现在就试试把<span class="guide-highlight">组件</span>拖到页面中吧！'
            });

            if (storage.isStorage) {
                storage.put(LOCAL_STORAGE_KEY_GUIDE_DRAG_COMPONENT, true);
            }
        }

        cranberry(steps).start();
    }

    function _getDemoRegion() {
        var d = $(".demo");
        var w = d.width();
        var h = d.height();
        var t = d.offset().top;
        var l = d.offset().left;

        var x = l + w / 2;
        var y = t + h / 2;

        w = w * 0.6;
        h = h * 0.6;

        x = x - w / 2;
        y = y - h / 2;
        return {
            x : x,
            y : y,
            width : w,
            height: h
        }
    }

    ///////////////////

    var ID = "datavisual";

    var DataVisual = function() {
    };

    /**
     * api
     * @public
     */
    DataVisual.prototype.init = function(afterInitCallback) {
        window.datavisual.pluginManager.loadPlugins(afterInitCallback);	// xh 数据可视化模块加载插件
    };

    /**
     * api
     * @public
     */
    DataVisual.prototype.onInitFrame = function() {
        //加载数据源
        window.workbench.datasourceManager.loadDataSourceInfo();
        window.datavisual.pluginManager.onInitFrame();
        _showGuide();
    };

    /**
     * api
     * @public
     */
    DataVisual.prototype.onRestoreDesignView = function(designFileContent) {
        //当刚刚新建的设计文件被打开时，其内容是空的
        var data = {};

        if (designFileContent != "" && designFileContent != null && designFileContent != undefined) {
            data = JSON.parse(designFileContent);
        }

        // 恢复设计区域的显示
        window.datavisual.pluginManager.restoreDesignView(data);
    };

    /**
     * api
     * @public
     */
    DataVisual.prototype.onCloseDesignView = function() {
        window.datavisual.pluginManager.closeDesignView();
    };

    /**
     * api
     * @public
     */
    DataVisual.prototype.onDesignViewResized = function() {
        window.datavisual.pluginManager.redrawDesignContent();
    };

    /**
     * api
     * @public
     */
    DataVisual.prototype.getSaveData = function() {
        var runtimeHtml = window.datavisual.pluginManager.getRuntimeHtml();
        var designFileContent = window.datavisual.pluginManager.getDesignFileContent();

        var worksetConfig = window.workbench.worksetManager.getWorksetConfigById(ID);
        var runtimeReference = new RuntimeReference(worksetConfig.runtime);
        var data = new DesignFileInfo(runtimeReference).getHtmlObject(designFileContent, runtimeHtml);

        return data;
    };

    win.workbench = win.workbench || {};
    win.workbench.workset = win.workbench.workset || {};
    win.workbench.workset.DataVisual = win.workbench.workset.DataVisual || function () {
        return new DataVisual();
    };
    
}(jQuery, window));