/**
 * 关系模型模板
 * @constructor
 */
function RelationModelTemplate() {
    this.dsName;
}
RelationModelTemplate.formatDataFields = function (dataFilds) {
    var columns = [];
    if (!dataFilds || dataFilds.length <= 0) {
        return columns;
    }

    for (var i = 0; i < dataFilds.length; i++) {
        var columnName = dataFilds[i].column_name;
        var dataType = dataFilds[i].data_type;
        var characterlength = dataFilds[i].character_maximum_length;
        if (dataType == undefined) {
            dataType = "string";
        }
        columns.push(new DataColumn(columnName, dataType, characterlength));
    }

    return columns;
}
RelationModelTemplate.prototype = new IFormViewTemplate();
RelationModelTemplate.prototype.initTemplate = function (dataModels, dsName) {
    if (!dataModels || !dsName) {
        return;
    }
    this.dsName = dsName;
    var $that = this;
    /**
     * 生成主表组件树
     */
    $that.setFormViewComponents($that.getFormComponents(dataModels));
    if (dataModels.slaveTables) {
        $.each(dataModels.slaveTables, function (index, item) {
            item.definitionName = dataModels.definitionName;
            $that.setFormViewComponents($that.getSeparatorComponents());
            if (item.relationType && item.relationType == "one-to-one") {
                $that.setFormViewComponents($that.getFormComponents(item));
            } else {
                $that.setFormViewComponents($that.getTableComponents(item));
            }
        })
    }
    /**
     * 添加提交按钮
     */
    $that.setFormViewComponents($that.getSubmitComponents());
}

/**
 * 构造组件树
 * @param model
 * @returns {FormViewComponent}
 */
RelationModelTemplate.prototype.getFormComponents = function (model) {
    var componentType = this.getComponentType();
    /**
     * 主表表单视图生成
     */
    var rootLayout = new FormViewComponent();
    var masterParams = {};
    masterParams.compid = "vm" + getCurrentTime();
    masterParams.compname = masterParams.compid;
    masterParams.type = componentType.layout;
    masterParams.ratio = "12";
    masterParams.uri = model.tableName;
    masterParams.dsname = this.dsName;
    masterParams.dsType = "dataset";
    masterParams.definitionName = model.definitionName;
    masterParams.relationModel = encodeURIComponent(JSON.stringify(model));
    rootLayout.setProperties(masterParams);

    var childLayout;
    $.each(model.fields, function (index, item) {
        if (index == 0 || index % 2 == 0) {
            childLayout = new FormViewComponent();
            var childParams = {};
            childParams.compid = "layout_" + getCurrentTime() + index;
            childParams.compname = childParams.compid;
            childParams.type = componentType.layout;
            childParams.ratio = "2,4,2,4";
            childLayout.setProperties(childParams);
            rootLayout.addChildComponents(childLayout);
        }
        var labelComponent = new FormViewComponent();
        var labelParams = {};
        labelParams.type = componentType.label;
        labelParams.compid = "label_" + getCurrentTime() + index;
        labelParams.compname = labelParams.compid;
        labelParams.defaultvalue = item.column_name;
        labelParams.class = "layout-align-right";
        labelComponent.setProperties(labelParams);
        childLayout.addChildComponents(labelComponent);

        var leafComponent = new FormViewComponent();
        var leafParams = {};
        leafParams.type = componentType.input_text;
        leafParams.dataFields = RelationModelTemplate.formatDataFields([item]);
        leafParams.compid = "text_" + getCurrentTime() + index;
        leafParams.compname = leafParams.compid;
        leafParams.editable = encodeURIComponent(JSON.stringify({add: "checked", view: "", modify: "checked"}));
        leafComponent.setProperties(leafParams);
        childLayout.addChildComponents(leafComponent);
    })

    return rootLayout;
}
/**
 * 构造表格行数据
 * @param fields
 */
RelationModelTemplate.prototype.getTableRowDataParams = function (fields) {
    if (!fields || fields.length < 0) {
        return [];
    }
    var dataRows = [];
    $.each(fields, function (index, item) {
        var dataRow = {
            state: true,
            $id: index + 1,
            title: item.column_name,
            field: item.column_name,
            editable: true,
            initData: {
                defaultValue: "",
                data: []
            },
            hide: false,
            validate: "notEmpty",
            formatter: "formatTableText"
        }
        dataRows.push(dataRow);
    })
    dataRows.push({
        state: true,
        $id: fields.length,
        title: '操作',
        field: 'operator',
        editable: false,
        initData: {
            defaultValue: "",
            data: []
        },
        hide: false,
        validate: "",
        formatter: "operatorFormatter"
    });
    return dataRows;
}
/**
 * one-to-many 一对多关系
 * @param model
 * @returns {FormViewComponent}
 */
RelationModelTemplate.prototype.getTableComponents = function (model) {
    var componentType = this.getComponentType();
    /**
     * 主表表单视图生成
     */
    var rootLayout = new FormViewComponent();
    var masterParams = {};
    masterParams.compid = "layout_" + getCurrentTime();
    masterParams.type = componentType.layout;
    masterParams.ratio = "12";
    masterParams.uri = model.tableName;
    masterParams.dsname = this.dsName;
    masterParams.dsType = "dataset";
    masterParams.definitionName = model.definitionName;
    masterParams.relationModel = encodeURIComponent(JSON.stringify(model));
    rootLayout.setProperties(masterParams);

    /**
     * 添加工具条
     * @type {FormViewComponent}
     */
    /*
     var  toolBarLayout = new FormViewComponent();
     var toolBarParams = {};
     toolBarParams.id = "layout_"+getCurrentTime();
     toolBarParams.type = componentType.layout;
     toolBarParams.ratio = "12";
     toolBarLayout.setProperties(toolBarParams);
     rootLayout.addChildComponents(toolBarLayout);

     var button =  new FormViewComponent();
     var buttonParams = {};
     buttonParams.id = "button_"+getCurrentTime();
     buttonParams.type = componentType.button;
     buttonParams.compid = buttonParams.id;
     buttonParams.compname = buttonParams.id;
     button.setProperties(buttonParams);
     toolBarLayout.addChildComponents(button);
     */

    /**
     * 添加本地表格
     * @type {FormViewComponent}
     */
    var listLayout = new FormViewComponent();
    var listParams = {};
    listParams.compid = "layout_" + getCurrentTime();
    listParams.type = componentType.layout;
    listParams.ratio = "12";
    listLayout.setProperties(listParams);
    rootLayout.addChildComponents(listLayout);

    var table = new FormViewComponent();
    var tableParams = {};
    tableParams.type = componentType.table_base_local;
    tableParams.compid = "table_" + getCurrentTime();
    tableParams.compname = tableParams.compid
    tableParams.rowdata = encodeURIComponent(JSON.stringify(this.getTableRowDataParams(model.fields)));
    table.setProperties(tableParams);
    listLayout.addChildComponents(table);

    return rootLayout;
}

/**
 * one-to-many 一对多关系
 * @param model
 * @returns {FormViewComponent}
 */
RelationModelTemplate.prototype.getSubmitComponents = function () {
    var componentType = this.getComponentType();
    /**
     * 主表表单视图生成
     */
    var rootLayout = new FormViewComponent();
    var masterParams = {};
    masterParams.id = "layout_" + getCurrentTime();
    masterParams.type = componentType.layout;
    masterParams.ratio = "12";
    rootLayout.setProperties(masterParams);

    var button = new FormViewComponent();
    var buttonParams = {};
    buttonParams.type = componentType.button;
    buttonParams.compid = "submit";
    buttonParams.compname = buttonParams.compid;
    buttonParams.defaultvalue = "提交";
    buttonParams.btntype = "submit";
    buttonParams.class = "layout-align-right";
    button.setProperties(buttonParams);
    rootLayout.addChildComponents(button);
    return rootLayout;
}
RelationModelTemplate.prototype.getSeparatorComponents = function () {
    var componentType = this.getComponentType();
    /**
     * 主表表单视图生成
     */
    var rootLayout = new FormViewComponent();
    var masterParams = {};
    masterParams.id = "layout_" + getCurrentTime();
    masterParams.type = componentType.layout;
    masterParams.ratio = "12";
    rootLayout.setProperties(masterParams);

    var separator = new FormViewComponent();
    var separatorParams = {};
        separatorParams.type = componentType.separator;
        separatorParams.compid ="separator_" + getCurrentTime();
    separator.setProperties(separatorParams);
    rootLayout.addChildComponents(separator);
    return rootLayout;
}
