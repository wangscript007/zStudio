package com.zte.mao.workbench.entity.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.zte.mao.workbench.def.TDataModelInfo;
import com.zte.mao.workbench.def.TDataViewInfo;

public class DataViewBase {
    private SimpleDateFormat sdf = new SimpleDateFormat(TDataViewInfo.DATE_PATTERN);

    private String id;
    private String creator;
    private Date createTime;
    private Date updateTime;
    private String mainTableName;

    public DataViewBase() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewBase(String id, String creator, Date createTime,
            Date updateTime, String mainTableName) {
        super();
        this.id = id;
        this.creator = creator;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.mainTableName = mainTableName;
    }

    public String getId() {
        return id;
    }

    public DataViewBase setId(String id) {
        this.id = id;
        return this;
    }

    public String getCreator() {
        return creator;
    }

    public DataViewBase setCreator(String creator) {
        this.creator = creator;
        return this;
    }
    
    public Date getCreateTime() {
        return createTime;
    }

    public DataViewBase setCreateTime(Date createTime) {
        this.createTime = createTime;
        return this;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public DataViewBase setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
        return this;
    }
    
    public String getMainTableName() {
        return mainTableName;
    }

    public DataViewBase setMainTableName(String mainTableName) {
        this.mainTableName = mainTableName;
        return this;
    }

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<String, String>();
        map.put(TDataModelInfo.COL_NAME_ID, this.getId());
        map.put(TDataModelInfo.COL_NAME_CREATOR, this.getCreator());
        map.put(TDataModelInfo.COL_NAME_CREATE_TIME, sdf.format(this.getCreateTime()));
        map.put(TDataModelInfo.COL_NAME_UPDATE_TIME, sdf.format(this.getUpdateTime()));
        return map;
    }
}
