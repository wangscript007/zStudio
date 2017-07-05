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
import com.zte.ums.bcp.orm.framework.extension.PostInsertRecExtension;
import com.zte.ums.bcp.orm.framework.extension.PreInsertRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.request.service.RequestAddRecordService;
import com.zte.ums.bcp.orm.framework.response.entry.AddReponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.AddRecordService;
import com.zte.ums.bcp.orm.utils.ExtensionServiceNameSplice;
import com.zte.ums.bcp.orm.utils.ResultRecordUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class AddController {
    
    @Resource(name="addRecordService")
    private AddRecordService addRecordService;
    @Resource 
    private RequestAddRecordService requestAddRecordService;
    @Resource
    private SpringContextUtils springContextUtils;
    @Resource
    private ExtensionServiceNameSplice extensionServiceNameSplice;
    @Resource
    private ResultRecordUtils resultRecordUtils;
    
    /**
     * ORM新增单条记录接口访问类
     * @param tablename  表名
     * @param data   新增记录请求数据
     * @return
     */
	@RequestMapping(value = "/table/{params}", method = RequestMethod.POST)
    @ResponseBody
    public AddReponseInfo addRecord(HttpServletRequest request, 
            @PathVariable("params") String tableName, @RequestBody String data) {
        dMsg.debug("请求的参数:" + data);
        AddReponseInfo addResultRecord = new AddReponseInfo();
        try {
            RequestAddRecord requestAddRecord = requestAddRecordService.getRequestAddRecord(request, tableName, data);
            //调用扩展点，参数：requestAddRecord addtablenameExtensionService
            String tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tableName, "add", "pre");
            if (springContextUtils.containsBean(tableNameExtensionService)) {
            	PreInsertRecExtension preInsertRecExtension = (PreInsertRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
        		requestAddRecord = preInsertRecExtension.preAddRecordExtension(request, requestAddRecord);
        	}
        	Map<String, Object> addRecord = addRecordService.addRecord(requestAddRecord);
        	int status = (Integer) addRecord.get("status");
        	addResultRecord = resultRecordUtils.getAddResultRecord(addRecord, addResultRecord);
        	//ORM操作后扩展点调用， ORM操作返回成功才调用扩展后接口
        	if (status != 0) {
	        	tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tableName, "add", "post");
	        	if (springContextUtils.containsBean(tableNameExtensionService)) {
	        		PostInsertRecExtension postInsertRecExtension = (PostInsertRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
	        		addResultRecord = postInsertRecExtension.afterAddRecordExtension(request, requestAddRecord, addResultRecord);
	        	}
        	}
        } catch (OrmException e) {
            dMsg.error(e.getMessage(), e);
            addResultRecord.setStatus(ResponseStatus.STATUS_FAIL);
            addResultRecord.setMessage(e.getMessage());
        } 
        return addResultRecord;
    }
    
	/**
	 * ORM新增多条记录接口访问类
	 * @param tablename  表名
	 * @param data  新增记录请求数据
	 * @return
	 */
    @RequestMapping(value = "/multi/table/{params}", method = RequestMethod.POST)
    @ResponseBody
    public AddReponseInfo addMutilRecord(HttpServletRequest request,
    		@PathVariable("params") String tablename, @RequestBody String data) {
    	return addRecord(request, tablename, data);
    }
    
    private static final Logger dMsg = Logger.getLogger(AddController.class.getName());
}
