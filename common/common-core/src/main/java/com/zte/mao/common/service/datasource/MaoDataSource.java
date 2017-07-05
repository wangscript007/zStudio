package com.zte.mao.common.service.datasource;

import com.alibaba.druid.pool.DruidDataSource;

public class MaoDataSource extends DruidDataSource {
    public static final String DATASOURCE_TYPE_GLOBAL = "global";
    public static final String DATASOURCE_TYPE_TENANT = "tenant";
    public static final String DATASOURCE_TYPE_BPE = "bpe";

    private String dataSourceType;
    private String dataSourceName;

    public String getDataSourceType() {
        return dataSourceType;
    }

    public String[] getDataSourceTypes() {
    	if(dataSourceType == null) {
    		return new String[0];
    	}
        return dataSourceType.split(",");
    }

    public void setDataSourceType(String dataSourceType) {
        this.dataSourceType = dataSourceType;
    }

    public String getDataSourceName() {
        return this.dataSourceName;
    }

    public void setDataSourceName(String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }
}
