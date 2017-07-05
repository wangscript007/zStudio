/**
 * 表单设计器工程添加功能是否打开，为true表示打开，false表示关闭
 * @type {boolean}
 */
var isFrameProjectAddEnable = false;
/**
 * 表单设计器工程删除功能是否打开，为true表示打开，false表示关闭
 * @type {boolean}
 */
var isFrameProjectDeleteEnable = false;

/**
 * 提供常用表格常量
 * @type {
 * {
 *  formatter: *[], //可编辑组件类型
 *  validate: *[]   //验证类型
 * }}
 */
var tableType = {
    "formatter" : [
        {
            text:"请选择",
            value:""
        },
        {
            text:"文本框",
            value:"formatTableText"
        },
        {
            text:"复选框",
            value:"formatTableCheckbox"
        },
        {
            text:"单选下拉框",
            value:"formatTableSelect"
        },
        {
            text:"多选下拉框",
            value:"formatTableMultipleSelect"
        }
    ],
    "validate":[

        {
            text:"无",
            value:""
        },
        {
            text:"整数",
            value:"integer"
        },
        {
            text:"有效数字",
            value:"numeric"
        },
        {
            text:"非空",
            value:"notEmpty"
        }
    ]
}