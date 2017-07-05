function refreshUI() {
    var columns = [{cname:'MeName_Value'}];
    var paramObj = {};
    paramObj.columns = columns;

    var condition1 = new QueryCondition(),
        condition2 = new QueryCondition();
    condition1.setCName('NAME').setCompare('=').setValue('NE8000');
    condition2.setCName('NAME').setCompare('=').setValue('NE8001');

    var conditions = generateCondition([condition1,condition2], 'or');

    paramObj.condition = conditions;
    var url = getTableOptions('table_base1479283560423','url'),
        url_param = url.substring(0, url.indexOf('?')) + "?param=" + encodeURIComponent(JSON.stringify(paramObj));
    refreshTable('table_base1486718614306', {url: url_param});
}