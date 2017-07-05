package com.zte.ums.bcp.orm.tablemessage.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.tablemessage.service.QueryTableFieldService;

@Controller
@RequestMapping("/orm")
public class QueryTableFieldController {
    
    @Resource(name="queryTableFieldService")
    private QueryTableFieldService queryTableFieldService;

    @RequestMapping(value = "/metadata/table/{params}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseInfo queryTableField(HttpServletRequest request, @PathVariable("params") String tableName, @RequestParam(value="database", required=false) String databaseName) {
        //Object attribute = request.getAttribute("database");
        return queryTableFieldService.getTableField(tableName, databaseName);
    }
}
