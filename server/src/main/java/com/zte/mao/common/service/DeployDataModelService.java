package com.zte.mao.common.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.service.datasource.DataSourceService;
import com.zte.mao.common.service.datasource.MaoDataSource;

@Service
public class DeployDataModelService {
	private static final Logger dMsg = Logger.getLogger(DeployDataModelService.class.getName());
	
	@Resource
	private OrmDao ormDao;
	
	@Resource
	private SqlExecuteService sqlExecuteService;
	
	@Resource
	private DataSourceService dataSourceService;
	
    public List<String> getSql(String path) throws Exception{
    	try {
    		File file = new File(path);
    		String readLines = FileUtils.readFileToString(file, "UTF-8");
    		String regex = "-- ########################";
    		return Arrays.asList(readLines.split(regex));
    	} catch (UnsupportedEncodingException e) {
			dMsg.error("Unsupported code type!");
			throw new MaoCommonException("Unsupported code type。");
		} catch (FileNotFoundException e) {
			dMsg.error("File is not exist。");
			throw new MaoCommonException("File is not exist。");
		} catch (IOException e) {
			dMsg.error(e.getMessage(), e);
			throw new MaoCommonException("Read File error。");
		}
    }
    
    public void excuteSql(List<String> sqllist, String tenantId) throws Exception {
        if (CollectionUtils.isEmpty(sqllist)) {
            return;
        }
        String dbname = "tenant_" + tenantId;
        Connection conn = null;
        Statement pst = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false);
            pst = conn.createStatement();
            pst.addBatch("use " + dbname);
            for (String sqlString : sqllist) {
                pst.addBatch(sqlString);
            }
            pst.executeBatch();
            conn.commit();
        } catch (Exception e) {
            dMsg.error(e.getMessage(), e);
            try {
                conn.rollback();
                conn.setAutoCommit(true);
            } catch (SQLException e1) {
                dMsg.error(e1.getMessage(), e1);
                throw new MaoCommonException(e1.getLocalizedMessage());
            }
        } finally {
            conn.setAutoCommit(true);
            try {
                if (pst != null) {
                    pst.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                dMsg.error(e.getMessage(), e);
                throw new MaoCommonException(e.getLocalizedMessage());
            }
        }
    }

    private Connection getConnection() throws MaoCommonException {
        MaoDataSource bean = dataSourceService.getDataSource("tenantDS");
        try {
            return bean.getConnection();
        } catch (SQLException e) {
            dMsg.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage(), e);
        }
    }
}