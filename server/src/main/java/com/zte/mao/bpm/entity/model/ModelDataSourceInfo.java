package com.zte.mao.bpm.entity.model;

public class ModelDataSourceInfo {
    public static int ENUM_ADAPTER_TYPE_ORM_INNER = 1;
    public static int ENUM_ADAPTER_TYPE_ORM_OUTER = 2;
    public static int ENUM_ADAPTER_TYPE_JDBC = 3;

    private String dataModelId;
    private String dataSourceId;
    private String host;
    private String port;
    private String scheme;
    private int adapterType;
    private String user;
    private String password;

    public String getDataModelId() {
        return dataModelId;
    }

    public ModelDataSourceInfo setDataModelId(String dataModelId) {
        this.dataModelId = dataModelId;
        return this;
    }

    public String getDataSourceId() {
        return dataSourceId;
    }

    public ModelDataSourceInfo setDataSourceId(String id) {
        this.dataSourceId = id;
        return this;
    }

    public String getHost() {
        return host;
    }

    public ModelDataSourceInfo setHost(String host) {
        this.host = host;
        return this;
    }

    public String getPort() {
        return port;
    }

    public ModelDataSourceInfo setPort(String port) {
        this.port = port;
        return this;
    }

    public String getScheme() {
        return scheme;
    }

    public ModelDataSourceInfo setScheme(String scheme) {
        this.scheme = scheme;
        return this;
    }

    public int getAdapterType() {
        return adapterType;
    }

    public ModelDataSourceInfo setAdapterType(int adapterType) {
        this.adapterType = adapterType;
        return this;
    }

    public String getUser() {
        return user;
    }

    public ModelDataSourceInfo setUser(String user) {
        this.user = user;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public ModelDataSourceInfo setPassword(String password) {
        this.password = password;
        return this;
    }
}
