package com.zte.mao.workbench.service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.service.datasource.DataSourceService;
import com.zte.mao.common.service.datasource.MaoDataSource;
import com.zte.mao.workbench.utils.JdbcUtil;

@Service
public class SQLExecute {
    private static final Logger logger = Logger.getLogger(SQLExecute.class);
    @Resource
    private DataSourceService dataSourceService;

    public SQLExecute() {
    }

    public void executeOneSql(String sql) throws MaoCommonException {
        if (StringUtils.isBlank(sql)) {
            throw new MaoCommonException("sql is null or empty.");
        }
        executeMultipleSql(Arrays.asList(new String[] { sql }));
    }

    public void executeMultipleSql(List<String> sqls) throws MaoCommonException {
        if (CollectionUtils.isEmpty(sqls)) {
            throw new MaoCommonException("sqls Collection is null or empty.");
        }

        Connection connection  = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();
            connection.setAutoCommit(false);
            for (int i = 0, len = sqls.size(); i < len; i++) {
                statement.execute(sqls.get(i));
            }
            connection.commit();
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            try {
                connection.rollback();
            } catch (SQLException e1) {
                logger.error(e.getMessage());
                throw new MaoCommonException(e1);
            }
            throw new MaoCommonException(e);
        } finally {
            try {
                JdbcUtil.closeAll(statement, connection);
            } catch (SQLException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e);
            }
        }
    }
    
    public List<Map<String,Object>> executeMultipleDifferentTypesSql(List<String> sqls) throws MaoCommonException {
        if (CollectionUtils.isEmpty(sqls)) {
            throw new MaoCommonException("sqls Collection is null or empty.");
        }
        
        Connection connection  = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();
            connection.setAutoCommit(false);
            String sql_key_select = "SELECT";
            List<Map<String, Object>> resultData = new ArrayList<Map<String,Object>>();
            for (int i = 0, len = sqls.size(); i < len; i++) {
                String sql = sqls.get(i);
                if (sql.contains(sql_key_select) || sql.contains(sql_key_select.toLowerCase())) {
                    resultData = getResultData(statement.executeQuery(sql));
                } else {
                    statement.execute(sql);
                }
            }
            connection.commit();
            return resultData;
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            try {
                connection.rollback();
            } catch (SQLException e1) {
                logger.error(e.getMessage(), e1);
                throw new MaoCommonException(e1);
            }
            throw new MaoCommonException(e);
        } finally {
            try {
                JdbcUtil.closeAll(statement, connection);
            } catch (SQLException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e);
            }
        }
    }

    private List<Map<String, Object>> getResultData(ResultSet resultSet)
            throws SQLException {
        ResultSetMetaData metaData = resultSet.getMetaData();
        List<Map<String, Object>> resultData = new ArrayList<Map<String,Object>>();
        int columnCount = metaData.getColumnCount();
        while (resultSet.next()) {
            Map<String, Object> row = new HashMap<String, Object>();
            for (int i= 1; i <= columnCount; i++){
                row.put(metaData.getColumnName(i), resultSet.getObject(i));
            }
            resultData.add(row);
        }
        return resultData;
    }

    private Connection getConnection() throws MaoCommonException {
        MaoDataSource bean = dataSourceService.getDataSource("tenantDS");
        try {
            return bean.getConnection();
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage(), e);
        }
    }

    public List<Map<String,Object>> executeQuerySqlUseDatabase(List<String> sqls) throws MaoCommonException {
        if (CollectionUtils.isEmpty(sqls)) {
            throw new MaoCommonException("sqls Collection is null or empty.");
        }
        if (sqls.size() != 2) {
            throw new MaoCommonException("The size of sqls Collection should be two.");
        }
        Connection connection  = null;
        Statement statement = null;
        try {
            connection = getConnection();
            statement = connection.createStatement();
            statement.execute(sqls.get(0));
            ResultSet resultSet = statement.executeQuery(sqls.get(1));
            return getResultData(resultSet);
        } catch (SQLException e) {
            logger.error(e.getMessage());
            try {
                connection.rollback();
            } catch (SQLException e1) {
                logger.error(e.getMessage());
                throw new MaoCommonException(e1);
            }
            throw new MaoCommonException(e);
        } finally {
            try {
                JdbcUtil.closeAll(statement, connection);
            } catch (SQLException e) {
                logger.error(e.getMessage());
                throw new MaoCommonException(e);
            }
        }
    }
    
}