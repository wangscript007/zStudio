package com.zte.ums.bcp.orm.tabledata.controller;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostDeleteRecExtension;
import com.zte.ums.bcp.orm.framework.extension.PreDeleteRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.request.service.RequestDeleteRecordService;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.DeleteRecordService;
import com.zte.ums.bcp.orm.utils.ExtensionServiceNameSplice;
import com.zte.ums.bcp.orm.utils.ResultRecordUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class DeleteController {
    private static final Logger dMsg = Logger.getLogger(DeleteController.class.getName());
    @Resource(name="deleteRecordService")
    private DeleteRecordService deleteRecordService;
    @Resource
    private RequestDeleteRecordService requestDeleteRecordService;
    @Resource
    private SpringContextUtils springContextUtils;
    @Resource
    private ExtensionServiceNameSplice extensionServiceNameSplice;
    @Resource
    private ResultRecordUtils resultRecordUtils;
    
    /**
     * ORM删除记录接口访问类
     * @param params  删除记录请求数据
     * @param tablename 表名
     * @return
     */
    @RequestMapping(value = "/table/{tablename}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseInfo deleteRecord(
            @RequestParam("param") String params,
            @PathVariable("tablename") String tableName, 
            HttpServletRequest request) {
    	dMsg.debug("请求的参数:" + params);
        ResponseInfo resultRecord = new ResponseInfo();
        try {
            RequestDeleteRecord requestDeleteRecord = requestDeleteRecordService.getRequestDeleteRecord(request, tableName, params);
            String tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tableName, "delete", "pre");
            if (springContextUtils.containsBean(tableNameExtensionService)) {
            	PreDeleteRecExtension preDeleteRecExtension = (PreDeleteRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
                requestDeleteRecord = preDeleteRecExtension.preDeleteRecordExtension(request, requestDeleteRecord);
            }
            Map<String, Object> deleteRecord = deleteRecordService.deleteRecord(requestDeleteRecord);
            resultRecord = resultRecordUtils.getDelAndUpdateResult(deleteRecord);
            //ORM操作后扩展点调用
            tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tableName, "delete", "post");
            if (springContextUtils.containsBean(tableNameExtensionService)) {
            	PostDeleteRecExtension postDeleteRecExtension = (PostDeleteRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
                resultRecord = postDeleteRecExtension.afterDeleteRecordExtension(request, requestDeleteRecord, resultRecord);
            }
        } catch (OrmException e) {
        	dMsg.error(e.getMessage(), e);
        	resultRecord.setStatus(ResponseStatus.STATUS_FAIL);
            resultRecord.setMessage(e.getMessage());
        }
        return resultRecord;

    }
}
