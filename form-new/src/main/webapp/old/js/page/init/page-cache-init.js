/**
 * Created by 10177027 on 2016/7/13.
 */
/**
 * 组件加载后初始化操作
 */
$(document).ready(function () {
    if ($.bfd.pageCache) {
        /**
         * 初始化数据操作
         */
        $.bfd.pageCache.initOperations();
        $.bfd.pageCache.removeAttr();

        /**
         * 初始化查询条件信息
         */
        $.bfd.pageCache.queryCondition.initQueryConditionConfig();
        $.bfd.pageCache.queryCondition.removeAttr();
    }
})