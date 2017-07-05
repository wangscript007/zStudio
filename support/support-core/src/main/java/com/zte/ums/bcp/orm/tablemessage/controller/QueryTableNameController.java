package com.zte.ums.bcp.orm.tablemessage.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.tablemessage.service.QueryTableNameService;

@Controller
@RequestMapping("/orm")
public class QueryTableNameController {
    @Resource(name = "queryTableNameService")
    private QueryTableNameService queryTableNameService;

    @RequestMapping(value = "/metadata/tablenames", method = RequestMethod.GET)
    @ResponseBody
    public ResponseInfo querytablename(HttpServletRequest request) {
        return queryTableNameService.getTableName(request.getParameter("database"));
    }
}
