package com.zte.mao.workbench.entity.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.zte.mao.workbench.def.TDataModelInfo;

public class DataModelBaisc {
    public static final int ENUM_SCENE_EXIST_TABLE = TDataModelInfo.ENUM_SCENE_EXIST_TABLE;
    public static final int ENUM_SCENE_NEW_TABLE = TDataModelInfo.ENUM_SCENE_NEW_TABLE;
    public static final int ENUM_SCENE_SCRIPT = TDataModelInfo.ENUM_SCENE_SCRIPT;

    private SimpleDateFormat sdf = new SimpleDateFormat(TDataModelInfo.DATE_PATTERN);

    private String id;
    private String name;
    private String description;
    private int scene;
    private String creator;
    private Date createTime;
    private Date updateTime;
    private String bindTable;
    private String script;
    private String i18n;
    private String packageId;

    public String getId() {
        return id;
    }

    public DataModelBaisc setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public DataModelBaisc setName(String name) {
        this.name = name;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public DataModelBaisc setDescription(String description) {
        this.description = description;
        return this;
    }

    public int getScene() {
        return this.scene;
    }

    public DataModelBaisc setScene(int type) {
        this.scene = type;
        return this;
    }

    public String getCreator() {
        return creator;
    }

    public DataModelBaisc setCreator(String creator) {
        this.creator = creator;
        return this;
    }
    
    public Date getCreateTime() {
        return createTime;
    }

    public DataModelBaisc setCreateTime(Date createTime) {
        this.createTime = createTime;
        return this;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public DataModelBaisc setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
        return this;
    }

    public String getBindTable() {
        return bindTable;
    }

    public DataModelBaisc setBindTable(String bindTable) {
        this.bindTable = bindTable;
        return this;
    }

    public String getScript() {
        return script;
    }

    public DataModelBaisc setScript(String script) {
        this.script = script;
        return this;
    }

    public String getI18n() {
        return i18n;
    }

    public DataModelBaisc setI18n(String i18n) {
        this.i18n = i18n;
        return this;
    }
    
    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<String, String>();
        map.put(TDataModelInfo.COL_NAME_ID, this.getId());
        map.put(TDataModelInfo.COL_NAME_NAME, this.getName());
        map.put(TDataModelInfo.COL_NAME_DESCRIPTION, this.getDescription());
        map.put(TDataModelInfo.COL_NAME_SCENE, String.valueOf(this.getScene()));
        map.put(TDataModelInfo.COL_NAME_CREATOR, this.getCreator());
        map.put(TDataModelInfo.COL_NAME_CREATE_TIME, sdf.format(this.getCreateTime()));
        map.put(TDataModelInfo.COL_NAME_UPDATE_TIME, sdf.format(this.getUpdateTime()));
        map.put(TDataModelInfo.COL_NAME_BIND_TABLE_NAME, this.getBindTable());
        map.put(TDataModelInfo.COL_NAME_SCRIPT, this.getScript());
        map.put(TDataModelInfo.COL_NAME_I18N, this.getI18n());
        map.put(TDataModelInfo.COL_NAME_PACKAGE_ID, this.getPackageId());
        return map;
    }
}
