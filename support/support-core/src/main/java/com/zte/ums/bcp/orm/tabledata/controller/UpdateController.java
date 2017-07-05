package com.zte.ums.bcp.orm.tabledata.controller;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostUpdateRecExtension;
import com.zte.ums.bcp.orm.framework.extension.PreUpdateRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;
import com.zte.ums.bcp.orm.framework.request.service.RequestUpdateRecordService;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.UpdateRecordService;
import com.zte.ums.bcp.orm.utils.ExtensionServiceNameSplice;
import com.zte.ums.bcp.orm.utils.ResultRecordUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class UpdateController {
    
    private static final Logger dMsg = Logger.getLogger(UpdateController.class.getName());
    
    @Resource
    private UpdateRecordService updateRecordService;
    @Resource
    private RequestUpdateRecordService requestUpdateRecordService;
    @Resource
    private ExtensionServiceNameSplice extensionServiceNameSplice;
    @Resource
    private SpringContextUtils springContextUtils;
    @Resource
    private ResultRecordUtils resultRecordUtils;
    
    /**
     * ORM单条记录更新访问接口
     * @param tableName 表名
     * @param data  更新记录请求数据
     * @return
     */
    @RequestMapping(value = "/table/{params}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseInfo updateRecord(HttpServletRequest request,
            @PathVariable("params") String tableName, @RequestBody String data) {
        dMsg.debug("请求的参数:" + data);
        ResponseInfo resultRecord = new ResponseInfo();
        try {
        	RequestUpdateRecord requestUpdateRecord = requestUpdateRecordService.getRequestUpdateRecord(request, tableName, data);
        	String tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tableName, "update", "pre");
        	
        	if (springContextUtils.containsBean(tableNameExtensionService)) {
        		PreUpdateRecExtension preUpdateRecExtension = (PreUpdateRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
        		requestUpdateRecord = preUpdateRecExtension.preUpdateRecordExtension(request, requestUpdateRecord);
        	}
        	Map<String, Object> updateRecord = updateRecordService.updateRecord(requestUpdateRecord);
        	int status = (Integer) updateRecord.get("status");
        	resultRecord = resultRecordUtils.getDelAndUpdateResult(updateRecord);
        	//ORM操作后扩展点调用，ORM操作返回成功才调用扩展后接口
        	if (status != 0) {
	        	tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tableName, "update", "post");
	        	if (springContextUtils.containsBean(tableNameExtensionService)) {
	        		PostUpdateRecExtension postUpdateRecExtension = (PostUpdateRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
	        		resultRecord = postUpdateRecExtension.afterUpdateRecordExtension(request, requestUpdateRecord, resultRecord);
	        	}
        	}
        } catch (OrmException e) {
            dMsg.error(e.getMessage(), e);
            resultRecord.setStatus(ResponseStatus.STATUS_FAIL);
            resultRecord.setMessage(e.getLocalizedMessage());
        } 
        return resultRecord;
    }
    
    /**
     * ORM多条记录更新访问接口
     * @param tablename  表名
     * @param data  更新记录请求数据
     * @return
     */
    @RequestMapping(value = "/multi/table/{params}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseInfo updateMutilRecord(HttpServletRequest request,
    		@PathVariable("params") String tablename, @RequestBody String data) {
    	return updateRecord(request, tablename, data);
    }
}
