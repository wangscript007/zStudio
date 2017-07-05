/**
 * Created by 10177027 on 2016/5/20.
 * 数据源管理
 */

;(function($,win) {

	var DataSourceAPI = function () {
		/**
		 * 数据源
		 * @type {Map}
		 */
		this.dataSources = [];
		/**
		 * 数据服务
		 * @type {Map}
		 */
		this.dataServices = new Map();
		/**
		 * 数据集
		 * @type {Map}
		 */
		this.dataSets = new Map();

		/**
		 * 引用对象定义
		 * @type {Map}
		 */
		this.refObjectDefinitions = new Map();

		/**
		 * 数据字段
		 * @type {Map}
		 */
		this.dataFields = new Map();

		/**
		 * 数据集操作定义
		 * @type {Map}
		 */
		this.dataOperations = new Map();

		/**
		 * 数据添加字段定义
		 * @type {Map}
		 */
		this.filter_fields = new Map();


	}

	/**
	 *数据源元数据主键列名
	 * @type {{SOURCES: string, SERVICES: string, SETS: string, FIELDS: string}}
	 */
	DataSourceAPI.META_DATA_KEY = {
		SOURCES: "sources",
		SERVICES: "services",
		SETS: "sets",
		FIELDS: "fields",
		OPERATIONS: "operations",
		POST_IN: "post_in",
		PUT_IN: "put_in",
		GET_OUT: "get_out",
		GET_PARAM: "get_param",
		DEFINITIONS: "definitions"
	}

	/**
	 * 数据源列
	 * @type {{}}
	 */
	DataSourceAPI.DATA_SOURCE_COLUMN = {
		ID: "id",//数据源唯一标识
		NAME: "name",//数据源名称
		IP: "ip",//IP
		PORT: "port",	//端口
		APP_PATH: "app_path",//应用路径
		DSTYPE: "dsType",//数据源类型
	}

	DataSourceAPI.DATA_SOURCE_TYPE = {
		ORM: "orm",
		JSON: "json"
	}

	/**
	 * 数据服务列
	 * @type {{}}
	 */
	DataSourceAPI.DATA_SERVICES_COLUMN = {
		ID: "id",//数据服务唯一标识
		NAME: "name",//数据服务名称
		SERVICE_PATH: "service_path"//服务路径
	}

	/**
	 * 数据集列
	 * @type {{ID: string, NAME: string}}
	 */
	DataSourceAPI.DATA_SETS_COLUMN = {
		ID: "name",//数据集唯一标识
		NAME: "name",//数据集名称
		SET_PATH: "set_path",
		CALLBACK: "callback" //加载数据字段回调函数
	}

	/**
	 * 数据集参数类型
	 * @type {{IN: string, OUT: string}}
	 */
	DataSourceAPI.DATA_SETS_PARAM_TYPE = {
		/**
		 * 入参
		 */
		IN: "in",
		/**
		 * 出参
		 */
		OUT: "out"
	}

	/**
	 * 数据字段列
	 * @type {{ID: string, NAME: string, TYPE: string, LENGTH: string}}
	 */
	DataSourceAPI.DATA_FIELDS_COLUMN = {
		ID: "name",//数据字段唯一标识
		NAME: "name",//数据字段名称
		TYPE: "type",//字段类型
		LENGTH: "length",//字段长度
		PROPERTIES: "properties",
		$REF: "$ref"
	}

	/**
	 * 字段类型string double int array object
	 * @type {{OBJ: string, ARRAY: string}}
	 */
	DataSourceAPI.DATA_FIELDS_TYPE = {
		"OBJECT": "object",
		"ARRAY": "array",
		"STRING": "string",
		"DOUBLE": "double",
		"INT": "int"
	}

	/**
	 * 数据操作定义
	 * @type {{METHOD: string, URL: string, GETURL: string, SUBMIT: string, SUCCESS: string, ERROR: string}}
	 */
	DataSourceAPI.DATA_OPERATIONS = {
		METHOD: "method",
		URL: "url",
		GETURL: "getUrl",
		SUBMIT: "submit",
		SUCCESS: "success",
		ERROR: "error"
	}


	DataSourceAPI.prototype = {
		/**
		 * 初始化元数据
		 * @param metaData
		 */
		init: function (metaData) {
			if (!metaData || metaData.length === 0) {
				return;
			}

			this.dataSources = [];
			this.dataServices = new Map();
			this.dataSets = new Map();
			this.dataFields = new Map();

			this._initDataSources(metaData);
		},
		/**
		 * 添加数据源
		 * @param metaData
		 */
		appendData: function (metaData) {
			if (!metaData || metaData.length === 0) {
				return;
			}

			this._initDataSources(metaData);
		},
		_initDataSources: function (metaData) {
			var that = this;
			$.each(metaData, function (index, item) {
				if (that._isDataSourceExist(item)) {
					return;
				}

				win[item[DataSourceAPI.DATA_SOURCE_COLUMN.ID]] =
					getURLConcatPath("http://" + item[DataSourceAPI.DATA_SOURCE_COLUMN.IP] + ":"
						+ item[DataSourceAPI.DATA_SOURCE_COLUMN.PORT] + "/",
						item[DataSourceAPI.DATA_SOURCE_COLUMN.APP_PATH]);

				var dataSourceData = {},
					dataSourceKey = item[DataSourceAPI.DATA_SOURCE_COLUMN.ID];

				for (var key in item) {
					if (key === DataSourceAPI.META_DATA_KEY.SERVICES) {
						that._initDataServices(item, dataSourceKey);
						continue;
					}
					dataSourceData[key] = item[key];
				}

				that.dataSources.push(dataSourceData);
			})
		},
		_isDataSourceExist: function (dataSourceData) {
			var isExist = false;
			$.each(this.dataSources, function (index, item) {
				if (item[DataSourceAPI.DATA_SOURCE_COLUMN.ID]
					=== dataSourceData[DataSourceAPI.DATA_SOURCE_COLUMN.ID]) {
					isExist = true;
					return false;
				}
			})

			return isExist;
		},
		_initDataServices: function (dataSourceItem, dataSourceKey) {
			var metaServices = dataSourceItem[DataSourceAPI.META_DATA_KEY.SERVICES];
			if (!metaServices || metaServices.length === 0) {
				return;
			}

			var that = this, dataServices = [];
			$.each(metaServices, function (index, item) {
				var dataServiceData = {}, definitionItem, dsItem,
					serviceKey = dataSourceKey + "." + item[DataSourceAPI.DATA_SERVICES_COLUMN.ID];

				for (var key in item) {
					if (key === DataSourceAPI.META_DATA_KEY.SETS) {
						dsItem = item;
						continue;
					}

					if (key === DataSourceAPI.META_DATA_KEY.DEFINITIONS) {
						definitionItem = item;
						continue;
					}

					dataServiceData[key] = item[key];
				}

				that._initDefinitions(dataSourceItem, definitionItem, serviceKey);
				that._initDataSets(dataSourceItem, dsItem, serviceKey);

				dataServices.push(dataServiceData);
			})
			that.dataServices.put(dataSourceKey, dataServices);
		},
		_initDefinitions: function (dataSourceItem, dataServiceItem, dataServiceKey) {
			if (!dataSourceItem || !dataServiceItem) {
				return;
			}

			var metaDataDefine = dataServiceItem[DataSourceAPI.META_DATA_KEY.DEFINITIONS];
			if (!metaDataDefine || $.isEmptyObject(metaDataDefine)) {
				return;
			}

			this.refObjectDefinitions.put(dataServiceKey, metaDataDefine);
		},
		_initDataSets: function (dataSourceItem, dataServiceItem, dataServiceKey) {
			if(!dataSourceItem || !dataServiceItem){
				return;
			}

			var metaDataSets = dataServiceItem[DataSourceAPI.META_DATA_KEY.SETS];
			if (!metaDataSets || metaDataSets.length === 0) {
				return;
			}

			var that = this, dataSets = [];
			$.each(metaDataSets, function (index, item) {
				var hasOperation = false,
					dataSetData = {},
					dataSetKey = dataServiceKey + "." + item[DataSourceAPI.DATA_SETS_COLUMN.ID];

				for (var key in item) {
					if (key === DataSourceAPI.META_DATA_KEY.FIELDS) {
						that._initDataFields(item, dataServiceKey, dataSetKey,
							DataSourceAPI.DATA_SETS_PARAM_TYPE.IN);
						continue;
					}

					if (key === DataSourceAPI.META_DATA_KEY.POST_IN ||
						key === DataSourceAPI.META_DATA_KEY.PUT_IN ||
						key === DataSourceAPI.META_DATA_KEY.GET_PARAM) {
						that._initDataFields(item, dataServiceKey, dataSetKey,
							DataSourceAPI.DATA_SETS_PARAM_TYPE.IN);
						that._initFilterFields(item, dataSetKey, key);
						continue;
					}

					if (key === DataSourceAPI.META_DATA_KEY.GET_OUT) {
						that._initDataFields(item, dataServiceKey, dataSetKey,
							DataSourceAPI.DATA_SETS_PARAM_TYPE.OUT);
						that._initFilterFields(item, dataSetKey, key);
						continue;
					}

					if (key === DataSourceAPI.META_DATA_KEY.OPERATIONS) {
						that._initDataOperations(dataSourceItem, dataServiceItem, item, dataSetKey);
						hasOperation = true;
						continue;
					}

					dataSetData[key] = item[key];
				}

				if (!hasOperation && dataSourceItem[DataSourceAPI.DATA_SOURCE_COLUMN.DSTYPE] !== DataSourceAPI.DATA_SOURCE_TYPE.ORM) {
					that._initDataOperations(dataSourceItem, dataServiceItem, item, dataSetKey);
				}

				if (!that._isDataSetExist(dataServiceKey, dataSetData)) {
					dataSets.push(dataSetData);
				}
			})

			that.dataSets.put(dataServiceKey, dataSets);
		},
		_initDataFields: function (dataSetItem, dataServiceKey, dataSetKey, paramType) {
			var metaDataFields = [];
			if (paramType === DataSourceAPI.DATA_SETS_PARAM_TYPE.IN) {
				metaDataFields = dataSetItem[DataSourceAPI.META_DATA_KEY.FIELDS];
				if (!metaDataFields || metaDataFields.length === 0) {
					metaDataFields = dataSetItem[DataSourceAPI.META_DATA_KEY.GET_PARAM];
				}

				if (!metaDataFields || metaDataFields.length === 0) {
					metaDataFields = dataSetItem[DataSourceAPI.META_DATA_KEY.POST_IN];
				}

				if (!metaDataFields || metaDataFields.length === 0) {
					metaDataFields = dataSetItem[DataSourceAPI.META_DATA_KEY.PUT_IN];
				}
			} else if (paramType === DataSourceAPI.DATA_SETS_PARAM_TYPE.OUT) {
				metaDataFields = dataSetItem[DataSourceAPI.META_DATA_KEY.GET_OUT];
			}

			this._analyzeDataFields(metaDataFields, dataServiceKey, dataSetKey, paramType);
		},
		_analyzeDataFields: function (metaDataFields, dataServiceKey, dataSetKey, paramType) {
			if (!metaDataFields || metaDataFields.length === 0) {
				return;
			}

			var that = this, dataFields = [];
			$.each(metaDataFields, function (index, item) {
				if (item[DataSourceAPI.DATA_FIELDS_COLUMN.TYPE] === DataSourceAPI.DATA_FIELDS_TYPE.OBJECT ||
					item[DataSourceAPI.DATA_FIELDS_COLUMN.TYPE] === DataSourceAPI.DATA_FIELDS_TYPE.ARRAY) {

					that._addSubDataSet(dataSetKey, item);

					var subKey = dataSetKey + "." + item[DataSourceAPI.DATA_FIELDS_COLUMN.NAME];
					var refObject = that.getRefObjectById(dataServiceKey, item[DataSourceAPI.DATA_FIELDS_COLUMN.$REF])
					that._analyzeRefObject(refObject, dataServiceKey, subKey, paramType);
				}

				dataFields.push(item);
			})

			that.dataFields.put(dataSetKey + "." + paramType, dataFields);
		},
		/**
		 * 引用对象解析
		 * @private
		 */
		_analyzeRefObject: function (refObject, dataServiceKey, dataSetKey, paramType) {
			if (!refObject) {
				return;
			}

			var properties = refObject[DataSourceAPI.DATA_FIELDS_COLUMN.PROPERTIES];
			if (!properties || properties.length === 0) {
				return;
			}

			var that = this, dataFields = [];
			$.each(properties, function (index, property) {
				var subRefObjectId = property[DataSourceAPI.DATA_FIELDS_COLUMN.$REF];
				if (subRefObjectId) {
					that._addSubDataSet(dataSetKey, property);

					var subKey = dataSetKey + "." + property[DataSourceAPI.DATA_FIELDS_COLUMN.NAME];
					that._analyzeRefObject(
						that.getRefObjectById(dataServiceKey, subRefObjectId),
						dataServiceKey, subKey, paramType);
				}

				dataFields.push(property);
			})

			that.dataFields.put(dataSetKey + "." + paramType, dataFields);
		},
		_isDataSetExist:function(dataSetParentKey,dataSet) {
			var isExist = false,
				dataSetDatas = this.dataSets.get(dataSetParentKey);

			if(!dataSetDatas || dataSetDatas.length<=0){
				return isExist;
			}

			$.each(dataSetDatas, function (index, item) {
				if (item.name === dataSet.name) {
					isExist = true;
					return false;
				}
			})

			return isExist;
		},
		_addSubDataSet: function (dataSetKey, dataSetInfo) {
			var dataSetData = {};
			for (var key in dataSetInfo) {
				dataSetData[key] = dataSetInfo[key];
			}

			var dataSetDatas = this.dataSets.get(dataSetKey);
			if (dataSetDatas && dataSetDatas.length > 0) {
				if (!this._isDataSetExist(dataSetKey, dataSetData)) {
					dataSetDatas.push(dataSetData);
				}
			} else {
				dataSetDatas = [dataSetData];
			}

			this.dataSets.put(dataSetKey, dataSetDatas);
		},
		_initDataOperations: function (dataSourceItem, dataServiceItem, dataSetItem, dataSetKey) {
			var url = "/";
			if (dataSourceItem[DataSourceAPI.DATA_SOURCE_COLUMN.APP_PATH]) {
				url = getURLConcatPath(url, dataSourceItem[DataSourceAPI.DATA_SOURCE_COLUMN.APP_PATH]);
			}

			if (dataServiceItem[DataSourceAPI.DATA_SERVICES_COLUMN.SERVICE_PATH]) {
				url = getURLConcatPath(url, dataServiceItem[DataSourceAPI.DATA_SERVICES_COLUMN.SERVICE_PATH]);
			}

			if (dataSetItem[DataSourceAPI.DATA_SETS_COLUMN.SET_PATH]) {
				url = getURLConcatPath(url, dataSetItem[DataSourceAPI.DATA_SETS_COLUMN.SET_PATH]);
			}

			var defaultOperations = $.bfd.ViewModel.operation.getDefaultOperations(url);

			var metaOperations = dataSetItem[DataSourceAPI.META_DATA_KEY.OPERATIONS];
			if (!metaOperations || metaOperations.length === 0) {
				metaOperations = defaultOperations;
			} else {
				$.each(defaultOperations, function (index, defaultOption) {
					var hasOption = false;
					$.each(metaOperations, function (index, metaOption) {
						if (defaultOption.method === metaOption.method) {
							hasOption = true;

							if (!metaOption.url) {
								metaOption.url = defaultOption.url;
							}

							if (!metaOption.submit) {
								metaOption.submit = defaultOption.submit;
							}

							if (!metaOption.name) {
								metaOption.name = defaultOption.name;
							}
						}
					})

					if (!hasOption) {
						metaOperations.push(defaultOption);
					}
				})
			}

			this.dataOperations.put(dataSetKey, metaOperations);
		},
		_initFilterFields: function (dataSetItem, dataSetKey, filterType) {
			var metaFields = dataSetItem[filterType];
			if (!metaFields || metaFields.length === 0) {
				return;
			}

			var that = this, fields = [];
			$.each(metaFields, function (index, item) {
				var field = {};
				for (var key in item) {
					field[key] = item[key];
				}

				fields.push(field);
			})

			that.filter_fields.put(dataSetKey + "." + filterType, fields);
		},
		/**
		 * 获取数据源集合
		 */
		getDataSources: function () {
			return this.dataSources;
		},
		/**
		 * 获取单个数据源
		 * @param dataSourceId
		 */
		getDataSourceById: function (dataSourceId) {
			var result = null;
			if (this.dataSources.length <= 0) {
				return result;
			}

			$.each(this.dataSources, function (index, sourceItem) {
				if (sourceItem[DataSourceAPI.DATA_SOURCE_COLUMN.ID] === dataSourceId) {
					result = sourceItem;
					return false;
				}
			})

			return result;
		},
		/**
		 * 获取数据源下数据服务集合
		 * @param sourceId
		 * @returns {Map}
		 */
		getDataServices: function (sourceId) {
			return this.dataServices.get(sourceId);
		},
		/**
		 * 获取单个数据服务
		 * @param sourceId 数据源ID
		 * @param serviceId 数据服务ID
		 * @returns {{}}
		 */
		getDataServiceById: function (sourceId, serviceId) {
			var result = {};
			if (this.dataServices.length <= 0) {
				return result;
			}

			var services = this.dataServices.get(sourceId);
			if (!services || services.length <= 0) {
				return result;
			}

			$.each(services, function (index, item) {
				if (item[DataSourceAPI.DATA_SERVICES_COLUMN.ID] === serviceId) {
					result = item;
					return false;
				}
			})

			return result;
		},
		/**
		 * 获取数据服务下的数据集
		 * @param dataSourceId 数据源ID
		 * @param serviceId 数据服务ID
		 */
		getDataSets: function (dataSourceId, serviceId) {
			return this.dataSets.get(dataSourceId + "." + serviceId);
		},
		/**
		 * 获取单个数据集信息
		 * @param dataSourceId 数据源ID
		 * @param dataServiceID 数据服务ID
		 * @param dataSetID 数据集ID
		 */
		getDataSetById: function (dataSourceId, dataServiceID, dataSetID) {
			var result = null;
			if (this.dataSets.length <= 0) {
				return result;
			}

			var sets = this.dataSets.get(dataSourceId + "." + dataServiceID);
			if (!sets || sets.length <= 0) {
				return result;
			}

			$.each(sets, function (index, item) {
				if (item[DataSourceAPI.DATA_SETS_COLUMN.ID] === dataSetID) {
					result = item;
					return false;
				}
			})

			return result;
		},
		/**
		 * 获取服务下的引用对象
		 * @param serviceKey
		 * @param refObjectId
		 */
		getRefObjectById: function (serviceKey, refObjectId) {
			var objects = this.refObjectDefinitions.get(serviceKey);
			if (!objects || $.isEmptyObject(objects)) {
				return {};
			}

			return objects[refObjectId];
		},
		/**
		 * 获取数据集字段
		 * @param dataSourceId 数据源ID
		 * @param dataServiceID 数据服务ID
		 * @param dataSetID 数据集ID
		 * @returns {Array}
		 */
		getDataSetFields: function (dataSourceId, dataServiceID, dataSetID, paramType) {
			var result = this.dataFields.get(dataSourceId + "." + dataServiceID + "." + dataSetID + "." + paramType);
			if (!result || result.length <= 0) {
				return this.loadDataSetFields(dataSourceId, dataServiceID, dataSetID, paramType);
			}

			return result;
		},
		/**
		 * 获取数据集子对象
		 * @param dataSourceId
		 * @param dataServiceID
		 * @param dataSetID
		 * @returns {*|动态执行函数后的返回结果}
		 */
		getDataSetSubObject: function (dataSourceId, dataServiceID, dataSetID) {
			var result = this.dataFields.get(dataSourceId + "." + dataServiceID + "." + dataSetID);
			if (!result || result.length <= 0) {
				return this.loadDataSetFields(dataSourceId, dataServiceID, dataSetID);
			}

			return result;
		},
		/**
		 * 加载数据集字段
		 * @param dataSourceId
		 * @param dataServiceID
		 * @param dataSetID
		 * @returns {动态执行函数后的返回结果}
		 */
		loadDataSetFields: function (dataSourceId, dataServiceID, dataSetID, paramType) {
			var dataSet = this.getDataSetById(dataSourceId, dataServiceID, dataSetID);
			if (!dataSet || !dataSet.callback) {
				return [];
			}

			var fields = dataSet.callback(dataSet);
			if (fields.length > 0) {
				this.dataFields.put(dataSourceId + "." + dataServiceID + "." + dataSetID + "." + paramType, fields);
			}

			return fields;
		},
		/**
		 * 查询数据集操作
		 * @param dataSourceId
		 * @param dataServiceID
		 * @param dataSetID
		 * @returns {Array}
		 */
		getDataOperations: function (dataSourceId, dataServiceID, dataSetID) {
			var result = [];
			if (this.dataOperations.size() <= 0) {
				return result;
			}

			var operations = this.dataOperations.get(dataSourceId + "." + dataServiceID + "." + dataSetID);
			if (operations) {
				result = operations;
			}

			return result;
		},
		formatDataFields: function (subFields, dataServiceKey) {
			if (!subFields || subFields.length === 0) {
				return [];
			}

			var that = this, dataFields = [];
			$.each(subFields, function (index, field) {
				var subRefObjectId = field[DataSourceAPI.DATA_FIELDS_COLUMN.$REF];
				if (subRefObjectId) {
					var subObject = that.getRefObjectById(dataServiceKey, subRefObjectId);
					field[DataSourceAPI.DATA_FIELDS_COLUMN.PROPERTIES] = that.formatDataFields(subObject[DataSourceAPI.DATA_FIELDS_COLUMN.PROPERTIES], dataServiceKey);
				}

				dataFields.push(field);
			})

			return dataFields;
		},
		/**
		 * 获取添加过滤字段
		 * @param dataSourceId
		 * @param dataServiceID
		 * @param dataSetID
		 * @returns {Array}
		 */
		getPostInFields: function (dataSourceId, dataServiceID, dataSetID) {
			var result = [];
			if (this.filter_fields.size() <= 0) {
				return result;
			}

			var operations = this.filter_fields.get(dataSourceId + "." + dataServiceID + "." + dataSetID + "." + DataSourceAPI.META_DATA_KEY.POST_IN);
			if (operations) {
				result = this.formatDataFields(operations, dataSourceId + "." + dataServiceID);
			}

			return result;
		},
		/**
		 * 获取修改过滤字段
		 * @param dataSourceId
		 * @param dataServiceID
		 * @param dataSetID
		 * @returns {Array}
		 */
		getPutInFields: function (dataSourceId, dataServiceID, dataSetID) {
			var result = [];
			if (this.filter_fields.size() <= 0) {
				return result;
			}

			var operations = this.filter_fields.get(dataSourceId + "." + dataServiceID + "." + dataSetID + "." + DataSourceAPI.META_DATA_KEY.PUT_IN);
			if (operations) {
				result = this.formatDataFields(operations, dataSourceId + "." + dataServiceID);
			}

			return result;
		},
		/**
		 * 获取查询输出过滤字段
		 * @param dataSourceId
		 * @param dataServiceID
		 * @param dataSetID
		 * @returns {Array}
		 */
		getGetOutFields: function (dataSourceId, dataServiceID, dataSetID) {
			var result = [];
			if (this.filter_fields.size() <= 0) {
				return result;
			}

			var operations = this.filter_fields.get(dataSourceId + "." + dataServiceID + "." + dataSetID + "." + DataSourceAPI.META_DATA_KEY.GET_OUT);
			if (operations) {
				result = this.formatDataFields(operations, dataSourceId + "." + dataServiceID);
			}

			return result;
		},
	}

	var allowedMethods = [
		'init',
		'getDataSources',
		'getDataServices',
		'getDataSets',
		'getDataSetFields',
		'getDataOperations',
		'getPostInFields',
		'getPutInFields',
		'getGetOutFields'
	];

	$.bfd = $.bfd || {};
	$.bfd.datasource = $.bfd.datasource || {};

	var data;
	$.bfd.datasource = function (option) {
		if (!data) {
			data = new DataSourceAPI();
		}

		if (typeof option === 'string') {
			if ($.inArray(option, allowedMethods) < 0) {
				throw new Error("Unknown method: " + option);
			}

			var args = Array.prototype.slice.call(arguments, 1);
			return data[option].apply(data, args);
		}

		return data;
	}

	/**
	 * 数据源结构定义
	 * @type {{SOURCES: string, SERVICES: string, SETS: string, FIELDS: string}}
	 */
	$.bfd.datasource.META_DATA_KEY = DataSourceAPI.META_DATA_KEY;
	/**
	 * 数据源列定义
	 * @type {{}}
	 */
	$.bfd.datasource.DATA_SOURCE_COLUMN = DataSourceAPI.DATA_SOURCE_COLUMN;
	/**
	 * 数据服务列定义
	 * @type {{}}
	 */
	$.bfd.datasource.DATA_SERVICES_COLUMN = DataSourceAPI.DATA_SERVICES_COLUMN;
	/**
	 * 数据集列定义
	 * @type {{ID: string, NAME: string}}
	 */
	$.bfd.datasource.DATA_SETS_COLUMN = DataSourceAPI.DATA_SETS_COLUMN;
	/**
	 * 数据字段定义
	 * @type {{ID: string, NAME: string, TYPE: string, LENGTH: string}}
	 */
	$.bfd.datasource.DATA_FIELDS_COLUMN = DataSourceAPI.DATA_FIELDS_COLUMN;
	/**
	 * 数据操作
	 * @type {{METHOD: string, URL: string, GETURL: string, SUBMIT: string, SUCCESS: string, ERROR: string}|*}
	 */
	$.bfd.datasource.DATA_OPERATIONS = DataSourceAPI.DATA_OPERATIONS;

}(jQuery,window))


