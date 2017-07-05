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
import com.zte.ums.bcp.orm.framework.extension.PostQueryRecExtension;
import com.zte.ums.bcp.orm.framework.extension.PreQueryRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.request.service.RequestQueryRecordService;
import com.zte.ums.bcp.orm.framework.response.entry.QueryResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.QueryRecordService;
import com.zte.ums.bcp.orm.utils.ExtensionServiceNameSplice;
import com.zte.ums.bcp.orm.utils.ResultRecordUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;
import org.apache.log4j.Logger;
@Controller
@RequestMapping("/orm")
public class QueryRecordController {
    private static final Logger dMsg = Logger.getLogger(QueryRecordController.class.getName());
    @Resource
    private RequestQueryRecordService requestQueryRecordService;
    @Resource(name = "queryRecordService")
    private QueryRecordService queryRecordService;
    @Resource
    private ExtensionServiceNameSplice extensionServiceNameSplice;
    @Resource
    private SpringContextUtils springContextUtils;
    @Resource
    private ResultRecordUtils resultRecordUtils;
    
    /**
     * @param tablename
     *            or ResourceId
     * @throws OrmException 
     * */
    @RequestMapping(value = "/table/{tablename}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseStatus queryRecord(
            @PathVariable(value = "tablename") String tablename,
            @RequestParam("param") String param,
            HttpServletRequest request) {
    	dMsg.debug("请求的参数:" + param);
        String limit = request.getParameter("limit");
        String offset = request.getParameter("offset");
        String database = request.getParameter("database");
        
        QueryResponseInfo queryResultRecord = new QueryResponseInfo();
        RequestQueryRecord requestQueryRecord = null;
        Map<String, Object> queryRecord = null;
        try {
            requestQueryRecord = requestQueryRecordService.getRequestQueryRecord(tablename, limit, offset, param, database);
            //调用扩展点，参数：requestAddRecord addtablenameExtensionService
            String tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tablename, "query", "pre");
            
            if (springContextUtils.containsBean(tableNameExtensionService)) {
            	PreQueryRecExtension preQueryRecExtension = (PreQueryRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
                requestQueryRecord = preQueryRecExtension.preQueryRecordExtension(request, requestQueryRecord);
            }
            
            queryRecord = queryRecordService.queryRecord(requestQueryRecord);
            queryResultRecord = resultRecordUtils.getQueryResultRecord(queryRecord, queryResultRecord);
            tableNameExtensionService = extensionServiceNameSplice.getTableNameExtensionService("", tablename, "query", "post");
            if (springContextUtils.containsBean(tableNameExtensionService)) {
            	PostQueryRecExtension postQueryRecExtension = (PostQueryRecExtension) springContextUtils.getBeanById(tableNameExtensionService);
                queryResultRecord = postQueryRecExtension.afterQueryRecordExtension(request, requestQueryRecord, queryResultRecord);
            }
            return queryResultRecord;
        } catch (OrmException e) {
            ResponseInfo responseInfo = new ResponseInfo();
            responseInfo.setMessage(e.getLocalizedMessage());
            responseInfo.setStatus(ResponseStatus.STATUS_FAIL);
            return responseInfo;
        }
    }
    
}
