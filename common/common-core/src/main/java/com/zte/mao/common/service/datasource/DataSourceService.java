package com.zte.mao.common.service.datasource;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.db.DBConnUtil;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.process.ProcessResBean;
import com.zte.mao.common.util.SpringUtils;

@Service
public class DataSourceService {
    protected Map<String, MaoDataSource> dataSourceMap = new HashMap<String, MaoDataSource>();
    
    protected List<String> dataSourceList = new ArrayList<String>();
    private ApplicationContext applicationContext;

    public void init() throws Exception {
        this.applicationContext = SpringUtils.getApplicationContext();
        parseDataSource();
        initDataSource();
    }

    private void parseDataSource() throws Exception {
        String[] beanNames = applicationContext.getBeanNamesForType(MaoDataSource.class);

        for (int i = 0; i < beanNames.length; i++) {
            MaoDataSource maoDataSource = (MaoDataSource) applicationContext.getBean(beanNames[i]);
            maoDataSource.setDataSourceName(beanNames[i]);
            String dataSourceTypeString = maoDataSource.getDataSourceType();
            if (StringUtils.isBlank(dataSourceTypeString)) {
                continue;
            }
            dataSourceList.add(beanNames[i]);
            dataSourceMap.put(beanNames[i], maoDataSource);
        }
    }
    
	protected Connection getGlobalConnection() throws SQLException {
		MaoDataSource maoDataSource = dataSourceMap.get("globalDS");
		return maoDataSource.getConnection();
	}

    public MaoDataSource getDataSource(String dataSourceName) {
        return dataSourceMap.get(dataSourceName);
    }
    
    private Map<String, ProcessResBean> getDBBeanMap() throws Exception {
		List<ProcessResBean> processRes = new ArrayList<ProcessResBean>();
		Connection conn = null;
    	Statement statement = null;
    	ResultSet rs = null;
    	try {
    		conn = getGlobalConnection();
    		statement = conn.createStatement();
    		rs = statement.executeQuery("SELECT ID,MODULE,NAME,IP,PORT FROM PROCESS_RES");
    		while(rs.next()) {
    			ProcessResBean resBean = new ProcessResBean();
    			resBean.setId(rs.getInt("ID"))
    			.setModule(rs.getString("MODULE"))
    			.setName(rs.getString("NAME"))
    			.setIp(rs.getString("IP"))
    			.setPort(rs.getString("PORT"));
    			processRes.add(resBean);
    		}
    	}
    	finally {
    		DBConnUtil.closeAll(rs, statement, conn);
    	}
		
		Map<String, ProcessResBean> processBeanMap = new HashMap<String, ProcessResBean>();
		for (int i = 0; i < processRes.size(); i++) {
			ProcessResBean processResBean = processRes.get(i);
			String processResString = processResBean.getKeyString();
			processBeanMap.put(processResString, processResBean);
		}
		return processBeanMap;
	}
	
	private void initDataSource() throws Exception {
		Map<String, ProcessResBean> processBeanMap = getDBBeanMap();
        List<ProcessResBean> list = new ArrayList<ProcessResBean>();
        List<ProcessResBean> existsList = new ArrayList<ProcessResBean>();
        for (String item : dataSourceList) {
            String tenantDataSourceName = item;
            if(tenantDataSourceName.equals("globalDS")) {
            	continue;
            }
            MaoDataSource tenantDataSource = dataSourceMap.get(tenantDataSourceName);
            String url = tenantDataSource.getUrl();
            String ip = url.substring(url.indexOf("//") + 2, url.lastIndexOf(":"));
            String port = url.substring(url.lastIndexOf(":") + 1, url.lastIndexOf("/"));

            ProcessResBean dBBean = new ProcessResBean();
            dBBean.setName(tenantDataSourceName)
                  .setModule(ProcessResBean.PROCESS_MODULE_DB)
                  .setIp(ip)
                  .setPort(port);
            String dbString = dBBean.getKeyString();
            if (!processBeanMap.containsKey(dbString)) {
                list.add(dBBean);
            }
            else {
            	existsList.add(dBBean);
            }
        }
        if (!list.isEmpty()) {
        	Connection conn = null;
        	Statement statement = null;
        	try {
        		conn = getGlobalConnection();
        		statement = conn.createStatement();
        		for(ProcessResBean pResBean : list){
            		StringBuilder sb = getInsertSql(pResBean, "global");
            		statement.addBatch(sb.toString());
            		if(!ConfigManage.getInstance().getPlatformType().equals(CommonConst.PLATFORM_TYPE_RUNTIME)) {
            			sb = getInsertSql(pResBean, "d_global");
                		statement.addBatch(sb.toString());	
            		}
            	}
        		statement.executeBatch();
        	}
        	finally {
    			DBConnUtil.closeAll(null, statement, conn);
    		}
        }
	}

	private StringBuilder getInsertSql(ProcessResBean pResBean, String schema) {
		StringBuilder sb = new StringBuilder(512);
		sb.append("INSERT INTO "+schema+".PROCESS_RES (NAME, MODULE, IP, PORT, CAPACITY, USED_CAPACITY) VALUES");
		sb.append("('")
		.append(pResBean.getName()).append("','")
		.append(pResBean.getModule()).append("','")
		.append(pResBean.getIp()).append("','")
		.append(pResBean.getPort()).append("',")
		.append(pResBean.getCapacity()).append(",")
		.append(pResBean.getUsedCapacity())
		.append(")");
		return sb;
	}
}