package com.zte.ums.bcp.orm.framework.systemproperty.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.alibaba.druid.pool.DruidDataSource;
import com.zte.ums.bcp.orm.exception.InvalidPropertiesException;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.systemproperty.constant.DBConst;

@Service
public class DatabasePropertyService {
    public static final String INVALID_DB_TYPE = "Invalid database type.";
    private static final Logger dMsg = Logger.getLogger(DatabasePropertyService.class.getName());
    
    @Value("#{databaseProperty['jdbc.driverClassName']}")
    private String jdbcDriverClassName;
    @Value("#{databaseProperty['jdbc.url']}")
    private String jdbcUrl;
    @Value("#{databaseProperty['userSchemaTable']}")
    private String isSchemaTable;
    @Value("#{databaseProperty['relationalDatabase']}")
    private String relationalDatabase;
    @Value("#{databaseProperty['dbType']}")
    private String dbType;
    @Value("#{databaseProperty['db.schema']}")
    private String dbSchema;

    private String getDBType() throws InvalidPropertiesException {
        String type = this.dbType;
        if (StringUtils.isBlank(type)) {
            type = getDBTypeFromUrl();
        }

        if (DBConst.MSSQL.equalsIgnoreCase(type.trim())) {
            return DBConst.MSSQL;
        } else if (DBConst.MYSQL.equalsIgnoreCase(type.trim())) {
            return DBConst.MYSQL;
        }
        throw new InvalidPropertiesException("Unsupport DB type:" + type);
    }

    private String getDBTypeFromUrl() {
        String dbType = "";

        if (!StringUtils.isBlank(jdbcUrl)) {
            String[] url = jdbcUrl.split(":");
            if (url.length > 1) {
                dbType = url[1];
            }
        }
        return dbType;
    }

    public String getMainDataBaseName() throws InvalidPropertiesException, OrmException {
        if (StringUtils.isBlank(jdbcUrl)) {
            return "";
        }
        String jdbcUrlValue = getJdbcUrl();
        String dbType = getDBType();
        if (DBConst.MYSQL.equals(dbType)) {
            return jdbcUrlValue.substring(jdbcUrlValue.lastIndexOf("/") + 1, jdbcUrlValue.length());
        } else if (DBConst.MSSQL.equals(dbType)) {
            return jdbcUrlValue.substring(jdbcUrlValue.lastIndexOf("=") + 1, jdbcUrlValue.length());
        }
        throw new InvalidPropertiesException("The shcema name can't be parsed. Maybe the DB type or the jdbc.url is invalid.");
    }

    private String getJdbcUrl() throws OrmException {
        WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
        DruidDataSource bean = (DruidDataSource) wac.getBean("defaultDataSource");
        String url = bean.getUrl();
        return url;
    }
  
    public List<String> getAllDBNames(String database) throws InvalidPropertiesException, OrmException {
        List<String> allDBNameList = new ArrayList<String>();
        if (StringUtils.isNotBlank(relationalDatabase)) {
            String[] dataBaseNameStrs = relationalDatabase.split(",");
            allDBNameList.addAll(Arrays.asList(dataBaseNameStrs));
        }
        // 如果传入了数据库，则不加载默认数据库
        if (StringUtils.isNotBlank(database)) {
            allDBNameList.add(database);
        } else {
            allDBNameList.add(getMainDataBaseName());
        }
        return allDBNameList;
    }

    public String getDBName(String database) throws InvalidPropertiesException, OrmException {
        if (StringUtils.isNotBlank(database)) {
            return database;
        } else {
            return getMainDataBaseName();
        }
    }

    public boolean isSchemaTable() {
        if ("true".equalsIgnoreCase(isSchemaTable)) {
            return true;
        }
        return false;
    }

    public String getDbSchema() {
        return dbSchema;
    }
}