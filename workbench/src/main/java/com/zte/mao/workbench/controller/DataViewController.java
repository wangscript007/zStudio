package com.zte.mao.workbench.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.workbench.service.view.DataViewCreateService;
import com.zte.mao.workbench.service.view.DataViewDeleteService;
import com.zte.mao.workbench.service.view.DataViewQueryService;
import com.zte.mao.workbench.service.view.DataViewUpdateService;

@RestController
@RequestMapping("/view/")
public class DataViewController {
    private static Logger logger = Logger.getLogger(DataModelController.class);
    @Resource
    private DataViewDeleteService dataViewDeleteService;
    @Resource
    private DataViewCreateService dataViewCreateService;
    @Resource
    private DataViewQueryService dataViewQueryService;
    @Resource
    private DataViewUpdateService dataViewUpdateService;
    @Resource
    private SessionManager sessionManager;
    
    private String getTenantId(HttpServletRequest request) throws MaoCommonException {
        try {
            return sessionManager.getTenantId(request);
        } catch (Exception e) {
            logger.error(e.getMessage());
            throw new MaoCommonException(e);
        }
    }

    @RequestMapping(value = "load", method = RequestMethod.GET)
    public CommonResponse getDataView(
            @RequestParam("viewIds") String content,
            HttpServletRequest request) {
        try {
            return dataViewQueryService.load(content, getTenantId(request));
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @RequestMapping(value = "create", method = RequestMethod.POST)
    public CommonResponse createDataView(
            @RequestBody(required=true) String content,
            HttpServletRequest request) {
        try {
            return dataViewCreateService.create(content, getTenantId(request));
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }

    @RequestMapping(value = "update", method = RequestMethod.PUT)
    public CommonResponse updateDataView(
            @RequestBody(required=true) String content,
            HttpServletRequest request) {
        try {
            return dataViewUpdateService.update(content, getTenantId(request));
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @RequestMapping(value = "delete", method = RequestMethod.DELETE)
    public CommonResponse deleteDataView(HttpServletRequest request, 
    		@RequestParam(value = "viewIds", required=true) String viewIds) {
        try {
            return dataViewDeleteService.delete(viewIds, getTenantId(request));
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @RequestMapping(value = "execute/query", method = RequestMethod.GET)
    public Object querySqlExecute(HttpServletRequest request,
            @RequestParam("param") String content,
            @RequestParam("offset") int offset,
            @RequestParam("limit") int limit) {
        try {
            return dataViewQueryService.executeQueryView(content, offset, limit, getTenantId(request));
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
}
