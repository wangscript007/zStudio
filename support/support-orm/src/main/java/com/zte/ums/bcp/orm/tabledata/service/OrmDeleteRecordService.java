package com.zte.ums.bcp.orm.tabledata.service;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.sql.service.DeleteSqlSplicingService;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import com.zte.ums.bcp.orm.utils.ResultUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;
import org.apache.log4j.Logger;

@Service(value="deleteRecordService")
public class OrmDeleteRecordService implements DeleteRecordService {
    @Resource
    private GeneralMapper generalMapper;
    
    @Resource
    private DeleteSqlSplicingService deleteSqlSplicingService;
    
    @Resource
    private DatabasePropertyService databasePropertyService;
    
    @Resource
    private SpringContextUtils springContextUtils;
    
    private static final Logger dMsg = Logger.getLogger(OrmDeleteRecordService.class.getName());

    @Transactional
    public Map<String, Object> deleteRecord(
            RequestDeleteRecord requestDeleteRecord) throws OrmException {
        try {
            int i = generalMapper.delete(deleteSqlSplicingService.splicingDeleteSql(requestDeleteRecord));
            if (i >= 0) {
                return ResultUtils.returnSuccess();
            } else {
                return ResultUtils.returnFail("删除数据失败");
            }
        } catch (Exception e) {
            dMsg.error(e.getMessage(), e);
            //throw new OrmException(e.getCause().getMessage());
            throw new OrmException(e.getLocalizedMessage());
        }
    }

    public Map<String, Object> execute(String sql, String db) throws Exception {
        Map<String, Object> responses = ResultUtils.returnSuccess();
        if (StringUtils.isNotBlank(db)) {
            generalMapper.insert("use " + db + ";");
        }
        int i = generalMapper.delete(sql);
        if (i < 0) {
            responses = ResultUtils.returnFail("删除数据失败,请求SQL为:" + sql);
        }
        return responses;
    }
}
