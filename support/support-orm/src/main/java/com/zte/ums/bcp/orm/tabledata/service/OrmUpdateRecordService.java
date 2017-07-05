package com.zte.ums.bcp.orm.tabledata.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;
import com.zte.ums.bcp.orm.framework.sql.service.UpdateSqlSplicingService;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;
import com.zte.ums.bcp.orm.utils.ResultUtils;
import org.apache.log4j.Logger;

@Service(value="updateRecordService")
public class OrmUpdateRecordService implements UpdateRecordService {
	private static final Logger dmsg = Logger.getLogger(OrmUpdateRecordService.class.getName());
    @Resource
    private GeneralMapper generalMapper;
    
    @Resource
    private MetaDataMapper metaDataMapper;
    
    @Resource
    private UpdateSqlSplicingService updateSqlSplicingService;
    
    @Resource
    private DatabasePropertyService databasePropertyService;
    
    @Transactional(rollbackFor=Exception.class)
    public Map<String, Object> updateRecord(RequestUpdateRecord requestUpdateRecord) throws OrmException {
    	Map<String, Object> resultMap = new HashMap<String, Object>();
    	List<String> sqlList = updateSqlSplicingService.splicingUpdateSql(requestUpdateRecord);
    	dmsg.info(sqlList);
    	for (Iterator<String> iterator=sqlList.iterator(); iterator.hasNext();) {
    		String sqlString = iterator.next();
    		try {
    			int i = generalMapper.update(sqlString);
    			if (i >= 0) {
    				resultMap = ResultUtils.returnSuccess();
    			} else {
    				resultMap = ResultUtils.returnFail("更新数据失败,未更新到数据,请求SQL为:" + sqlString);
    			}
    		} catch(Exception e) {
    		    dmsg.error(e.getMessage(), e);
    			throw new OrmException(e.getLocalizedMessage(), e.getCause());
    		}
    	}
    	return resultMap;
    }

	public Map<String, Object> execute(String sql, String db) throws Exception {
		Map<String, Object> responses = ResultUtils.returnSuccess();
		if (StringUtils.isNotBlank(db)) {
			generalMapper.insert("use " + db + ";");
    	}
		int i = generalMapper.update(sql);
		if (i < 0) {
			String message = "更新数据失败,未更新到数据,请求SQL为:" + sql;
			responses = ResultUtils.returnFail(message);
			dmsg.error(message);
		}
		return responses;
	}

}
