package com.zte.mao.workbench.entity.model.template;

import com.zte.mao.workbench.entity.model.DataModelItem;

public class DataModelTemplateLayout {
    private static final String TIPS_ID = "<数据项编号>";
    private static final String TIPS_NAME = "<数据项显示名>";
    private static final String TIPS_COMPONENTTYPE = "<控件类型。1-标签 2-文本框 3-文本域 4-下拉列表框 5-单选框 6-多选框 7-时间控件 8-文件上传控件>";
    private static final String TIPS_VISIBLE = "<界面是否可见。1-显示 2-隐藏>";
    private static final String TIPS_LAYOUT = "<布局类型。0-占半行，后面可布局其他控件  1-独占一行 2-占半行，后面不能布局其他控件>";
    private static final String TIPS_GROUPID = "<所属面板域，面板域值为大于0的整数，升序排列>";

    private String id;
    private String name;
    private String componentType;
    private String visible;
    private String layout;
    private String groupId;

    public DataModelTemplateLayout() {
        this.id = TIPS_ID;
        this.name = TIPS_NAME;
        this.componentType = TIPS_COMPONENTTYPE;
        this.visible = TIPS_VISIBLE;
        this.layout = TIPS_LAYOUT;
        this.groupId = TIPS_GROUPID;
    }

    public DataModelTemplateLayout(DataModelItem modelItem, boolean addTips) {
        this.id = modelItem.getId();
        this.name = modelItem.getName();
        this.componentType = modelItem.getComponentType() + "";
        this.visible = modelItem.isUiVisible() ? "1" : "0";
        this.layout = modelItem.getLayout() + "";
        this.groupId = modelItem.getDataBlock() + "";
        if (addTips) {
            this.componentType += TIPS_COMPONENTTYPE;
            this.visible += TIPS_VISIBLE;
            this.layout += TIPS_LAYOUT;
            this.groupId += TIPS_GROUPID;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getControlType() {
        return componentType;
    }

    public String getUiVisible() {
        return visible;
    }

    public String getLayout() {
        return layout;
    }

    public String getDataBlock() {
        return groupId;
    }
}
