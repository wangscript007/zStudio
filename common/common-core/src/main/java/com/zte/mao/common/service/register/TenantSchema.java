package com.zte.mao.common.service.register;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.db.DBConnUtil;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.util.OSCommonUtil;
import com.zte.mao.common.util.cmd.ExeCmdManager;
import org.apache.log4j.Logger;

@Service
public class TenantSchema {
	private static final Logger dMsg = Logger.getLogger(TenantSchema.class.getName());
	
	private static final String TENANT_SCHEMA_NAME_PREFIX = "TENANT_";
	private static final String SQL_PROC_CREATE_SHCEMA = "call createSchema(?)";
	
	@Resource
	private OrmDao ormDao;
	
	private String platformType = ConfigManage.getInstance().getPlatformType();
	
	public void createTenantSchema(String tenantId, String dbid) throws Exception {
		
		List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
		OrmQueryCondition condition = new OrmQueryCondition();
		condition.setCname("ID").setValue(String.valueOf(Integer.parseInt(dbid)));
		conditions.add(condition);
		List<Map<String, String>> data = ormDao.getData("PROCESS_RES", "IP,PORT".split(","), conditions , OrmDao.OPERATOR_AND, tenantId);
		if(data.size() == 0) {
			throw new Exception("createTenantSchema can not get dbinfo, dbid=" + dbid);
		}
		Map<String, String> map = data.get(0);
		String url = "jdbc:mysql://"+map.get("IP")+":"+map.get("PORT")+"/tenant?user=mao&password=U_mao_2015&autoReconnect=true&failOverReadOnly=false";
		MysqlDataSource dataSource = new MysqlDataSource();
        dataSource.setURL(url);
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            String schemaName = TENANT_SCHEMA_NAME_PREFIX + tenantId;
            createSchema(schemaName, conn);
            createTables(schemaName, conn, "tenant");
        } finally {
            DBConnUtil.closeConnection(conn);
        }
        
        if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
        	url = "jdbc:mysql://"+map.get("IP")+":"+map.get("PORT")+"/d_tenant?user=mao&password=U_mao_2015&autoReconnect=true&failOverReadOnly=false";
    		dataSource = new MysqlDataSource();
            dataSource.setURL(url);
            conn = null;
            try {
                conn = dataSource.getConnection();
                String schemaName = TENANT_SCHEMA_NAME_PREFIX + tenantId;
                createSchema("d_" + schemaName, conn);
                createTables("d_" + schemaName, conn, "d_tenant");
            } finally {
                DBConnUtil.closeConnection(conn);
            }
        }
    }
	
	private void createSchema(String schemaName, Connection conn) throws MaoCommonException {
        CallableStatement cstmt = null;
        try {
            cstmt = conn.prepareCall(SQL_PROC_CREATE_SHCEMA);
            cstmt.setString(1, schemaName);
            cstmt.execute();
        } catch (Exception e) {
            dMsg.error(e);
            throw new MaoCommonException(e.getLocalizedMessage(), e);
        } finally {
            DBConnUtil.closeStatement(cstmt);
        }
    
    }
	
	private void createTables(String schemaName, Connection conn, String schema) throws MaoCommonException {
        String url;
        try {
            url = conn.getMetaData().getURL();
        } catch (SQLException e) {
            throw new MaoCommonException(e.getLocalizedMessage(), e);
        }
        if (StringUtils.isBlank(url) && url.split("/").length < 5) {
            throw new MaoCommonException("URL非法。");
        }
        String[] hostPort = url.split("/")[2].split(":");
        
        String mysqlCmd = String.format("mysqldump " + schema + " -h%1$s -P%2$s -umao -pU_mao_2015 --add-drop-table | mysql %3$s -h%1$s -P%2$s -umao -pU_mao_2015", hostPort[0], hostPort[1], schemaName);
        
        ExeCmdManager cmdManager;
        if (OSCommonUtil.getInstanse().isWindows()) {
            cmdManager = new ExeCmdManager(new String[] { "cmd", "/c", mysqlCmd }, true);
        } else {
            cmdManager = new ExeCmdManager(new String[] { "/bin/sh", "-c", mysqlCmd }, true);
        }
        cmdManager.exeCmd();
        String[] errorStreamResults = cmdManager.getErrorStreamResults();
        if (ArrayUtils.isNotEmpty(errorStreamResults)) {
            for (int i = 0; i < errorStreamResults.length; i++) {
                dMsg.error(errorStreamResults[i]);
            }
            throw new MaoCommonException(String.format("初始化租户%1s数据库失败。", schemaName));
        }
    }
}
