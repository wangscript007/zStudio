/**
 * 表单设计器工程添加功能是否打开，为true表示打开，false表示关闭
 * @type {boolean}
 */
var isFrameProjectAddEnable = true;
/**
 * 表单设计器工程修改功能是否打开，为true表示打开，false表示关闭
 * @type {boolean}
 */
var isFrameProjectUpdateEnable = false;
/**
 * 表单设计器工程删除功能是否打开，为true表示打开，false表示关闭
 * @type {boolean}
 */
var isFrameProjectDeleteEnable = false;


///////////
var ProjectManagerUI = {};
ProjectManagerUI.MODULE_TYPE_PROJECT = "project";
ProjectManagerUI.MODULE_TYPE_DATASOURCELIST = "datasourcelist";
ProjectManagerUI.MODULE_TYPE_DATASOURCE = "datasource";
ProjectManagerUI.MODULE_TYPE_DESIGNFILELIST = "designfilelist";
ProjectManagerUI.MODULE_TYPE_DESIGNFILE = "designfile";

ProjectManagerUI.OPERATOR_VIEW = "view";
ProjectManagerUI.OPERATOR_ADD = "add";
ProjectManagerUI.OPERATOR_UPDATE = "update";