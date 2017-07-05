var DATA_MODEL = {};
DATA_MODEL.FIELD_TYPE_DIMENSION = "dimension";
DATA_MODEL.FIELD_TYPE_METRIC = "metric";

DATA_MODEL.DATATYPE_INT = "int";
DATA_MODEL.DATATYPE_DECIMAL = "decimal";
DATA_MODEL.DATATYPE_DOUBLE = "double";
DATA_MODEL.DATATYPE_STRING = "string";

/////////
(function($, win) {
	function drawDataSourceSelect(dom, selectedDataSourceId) {
		dom.find(".datasources-select").empty();

		var datasources = $.bfd.datasource().getDataSources();
		var $ds = dom.find(".datasources-select");
		for (var i = 0; i < datasources.length; i++) {
			var dsItem = datasources[i];

			var selected = selectedDataSourceId == dsItem.id ? " selected" : "";
			$ds.append('<option value="' + dsItem.id + '"' + selected + '>' + dsItem.name + '</option>');
		}
	}

	function drawDataSetSelect(dom, selectedDatasetName) {
		dom.find(".datasets-select").empty();

		var datasourceId = dom.find(".datasources-select").val();
		var datasource = $.bfd.datasource().getDataSourceById(datasourceId);

		if (datasource == undefined || datasource == null) {
			return;
		}

		var datasets = $.bfd.datasource().getDataSets(datasource.id, datasource.id);
		if (datasets == undefined || datasets == null) {
			return;
		}

		var $datasets = dom.find(".datasets-select");
		for (var i = 0; i < datasets.length; i++) {
			var dsItem = datasets[i];

			var selected = selectedDatasetName == dsItem.name ? " selected" : "";
			$datasets.append('<option value="' + dsItem.name + '"' + selected + '>' + dsItem.name + '</option>');
		}
	}

	function drawDataSetField(dom) {
		var datasourceId = dom.find(".datasources-select").val();
		var tableName = dom.find(".datasets-select").val();
		if (datasourceId == undefined || datasourceId == null || datasourceId == ""
			|| tableName == undefined || tableName == null || tableName == "") {
			return;
		}

		var fields = $.bfd.datasource().getDataSetFields(datasourceId, datasourceId, tableName);

		var dimensions = [];
		var metrics = [];
		$.each(fields, function(index, item) {
			if (item.type == DATA_MODEL.DATATYPE_DOUBLE || item.type == DATA_MODEL.DATATYPE_INT || item.type == DATA_MODEL.DATATYPE_DECIMAL) {
				metrics.push(item);
			} else {
				dimensions.push(item);
			}
		});

		dom.find(".data-dimension").html("").append($(getDimensionHtml(dimensions)));
		dom.find(".data-metric").html("").append($(getMetricHtml(metrics)));

		//组件拉动事件注册
		initDraggableComponent(dom);
	}

	var TYPE_2_ICON = {};
	TYPE_2_ICON[DATA_MODEL.DATATYPE_STRING] = "z3-character";
	TYPE_2_ICON[DATA_MODEL.DATATYPE_DECIMAL] = "z3-number";
	TYPE_2_ICON[DATA_MODEL.DATATYPE_DOUBLE] = "z3-number";
	TYPE_2_ICON[DATA_MODEL.DATATYPE_INT] = "z3-number";

	function getDimensionHtml(dimensions) {
		var html = [];

		$.each(dimensions, function(index, item) {
			html.push('<div class="group-item group-item-dimension" data-ctrltype="' + DATA_MODEL.FIELD_TYPE_DIMENSION + '" data-field-name="' + item.name + '" data-field-data-type="' + item.type + '">');
			html.push('<div class="item-icon">');
			html.push('<span class="' + TYPE_2_ICON[item.type] + '"></span>');
			html.push('</div>');
			html.push('<div class="item-text">');
			html.push('<span>' + item.name + '(' + item.type + ')</span>');
			html.push('</div>');
			html.push('</div>');
		});

		return html.join("");
	}

	function getMetricHtml(metrics) {
		var html = [];

		$.each(metrics, function(index, item) {
			html.push('<div class="group-item group-item-metric" data-ctrltype="' + DATA_MODEL.FIELD_TYPE_METRIC + '" data-field-name="' + item.name + '" data-field-data-type="' + item.type + '">');
			html.push('<div class="item-icon">');
			html.push('<span class="' + TYPE_2_ICON[item.type] + '"></span>');
			html.push('</div>');
			html.push('<div class="item-text">');
			html.push('<span>' + item.name + '(' + item.type + ')</span>');
			html.push('</div>');
			html.push('</div>');
		});

		return html.join("");
	}

	function registerSelectChangeEvent(dom, view) {
		dom.find(".datasources-select").change(function() {
			drawDataSetSelect(dom);
			drawDataSetField(dom);

			view._onSelectionChanged();
		});

		dom.find(".datasets-select").change(function() {
			drawDataSetField(dom);

			view._onSelectionChanged();
		});
	}

	function initDraggableComponent(dom) {
		dom.find(".group-item").draggable({
			connectToSortable: ".droppable",
			helper: "clone",
			cursor: "move",
			cursorAt: {left: 5 },
			start: function (e, t) {
				// 暂时没有作用
			},
			drag: function (e, t) {
				t.helper.width(100);
			},
			stop: function (e, t) {
				// 暂时没有作用
			}
		});
	}

	//////////////////////////////////////////////

	/**
	 *
	 * @param config
	 * {
	 * 		selectedDatasourceId: "",
	 * 		selectedDatasetName: "",
	 * 		datasourceChangedCallback: function
	 * }
	 *
	 * @constructor
	 */
	var DataSourceView = function(config) {
		this.config = config || {
				selectedDatasourceId: "",
				selectedDatasetName: "",
				datasourceChangedCallback: false
			};

		this.getHtml();
	};

	/**
	 * @public
	 * @returns {*|HTMLElement}
	 */
	DataSourceView.prototype.getHtml = function() {
		if (this.dom) {
			// dom在重新append到界面后会失去拖拽事件，这里重新注册事件
			initDraggableComponent(this.dom);
			registerSelectChangeEvent(this.dom, this);
			return this.dom;
		}

		var html = [];
		html.push('<div >');

		html.push('	<div class="form-panel">');
		html.push('		<div class="title">');
		html.push('			<em class="glyphicon glyphicon-th-large icon1"></em>');
		html.push('			<span>数据配置</span>');
		html.push('		</div>');
		html.push('		<div class="body">');
		html.push('			<div style="padding:5px 5px; color:#fff;">');
		html.push('				<form>');
		html.push('					<div class="form-group">');
		html.push('						<label>数据源</label>');
		html.push('						<select class="datasources-select form-control input-sm">');
		html.push('						</select>');
		html.push('					</div>');
		html.push('					<div class="form-group">');
		html.push('						<label>数据集</label>');
		html.push('						<select class="datasets-select form-control input-sm">');
		html.push('						</select>');
		html.push('					</div>');
		html.push('				</form>');
		html.push('			</div>');
		html.push('		</div>');
		html.push('	</div>');

		html.push('	<div class="form-panel">');
		html.push('		<div class="title">');
		html.push('			<em class="glyphicon glyphicon-eye-open icon1"></em>');
		html.push('			<span>维度</span>');
		html.push('		</div>');
		html.push('		<div class="body data-dimension">');

		html.push('		</div>');
		html.push('	</div>');

		html.push('	<div class="form-panel">');
		html.push('		<div class="title">');
		html.push('			<em class="glyphicon glyphicon-signal icon1"></em>');
		html.push('			<span>度量</span>');
		html.push('		</div>');
		html.push('		<div class="body data-metric">');

		html.push('		</div>');
		html.push('	</div>');

		html.push('</div>');

		html = html.join('');
		this.dom = $(html);

		drawDataSourceSelect(this.dom, this.config.selectedDatasourceId);
		drawDataSetSelect(this.dom, this.config.selectedDatasetName);
		drawDataSetField(this.dom);

		return this.dom;
	};

	DataSourceView.prototype.getCurrentDataSource = function(){
		var datasourceId = this.dom.find(".datasources-select").val();
		if (datasourceId == null || datasourceId == "") {
			return null;
		}

		var datasource = $.bfd.datasource().getDataSourceById(datasourceId);
		if (datasource == undefined || datasource == null) {
			return null;
		}

		var datasetId = this.dom.find(".datasets-select").val();
		if (datasetId == null || datasetId == "") {
			return null;
		}

		var dataset = $.bfd.datasource().getDataSetById(datasource.id, datasource.id, datasetId);
		if (dataset == undefined || dataset == null) {
			return null;
		}

		return {"datasource": datasource, "dataset": dataset};
	};

	DataSourceView.prototype.getCurrentDataSourceForRuntime = function(){
		var rtDsInfo = this.getCurrentDataSource();
		if (rtDsInfo == null) {
			return null;
		}

		rtDsInfo = {
			"datasource" : {"id": rtDsInfo.datasource.id},
			"dataset" : {"name": rtDsInfo.dataset.name}
		};

		return rtDsInfo;
	};

	DataSourceView.prototype._onSelectionChanged = function () {
		this.config.selectedDatasourceId = this.dom.find(".datasources-select").val();
		this.config.selectedDatasetName = this.dom.find(".datasets-select").val();

		if (this.config.datasourceChangedCallback && $.isFunction(this.config.datasourceChangedCallback)) {
			this.config.datasourceChangedCallback();
		}
	};

	win.datavisual = win.datavisual || {};
	win.datavisual.ui = win.datavisual.ui || {};
	win.datavisual.ui.DataSourceView = win.datavisual.ui.DataSourceView || DataSourceView;
}(jQuery, window));
