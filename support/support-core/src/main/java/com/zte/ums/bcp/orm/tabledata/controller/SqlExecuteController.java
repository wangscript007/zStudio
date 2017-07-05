package com.zte.ums.bcp.orm.tabledata.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.AddRecordService;
import com.zte.ums.bcp.orm.tabledata.service.DeleteRecordService;
import com.zte.ums.bcp.orm.tabledata.service.QueryRecordService;
import com.zte.ums.bcp.orm.tabledata.service.UpdateRecordService;
import com.zte.ums.bcp.orm.utils.ConstantUtils;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class SqlExecuteController {
    private static final Logger logger = Logger.getLogger(SqlExecuteController.class.getName());

    @Resource(name = "addRecordService")
    private AddRecordService addRecordService;

    @Resource(name = "updateRecordService")
    private UpdateRecordService updateRecordService;

    @Resource(name = "deleteRecordService")
    private DeleteRecordService deleteRecordService;

    @Resource(name = "queryRecordService")
    private QueryRecordService queryRecordService;

    /**
     * 执行sql的控制器
     * 
     * @param request
     * @param sql
     * @param type
     * @return
     */
    @RequestMapping(value = "/sql/execute", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> executeSql(HttpServletRequest request, @RequestParam("sql") String sql,
            @RequestParam("opeType") String type) {
        String db = request.getParameter("database");
        Map<String, Object> responses = new HashMap<String, Object>();
        try {
            if (type.equals("ADD")) {
                responses = addRecordService.execute(sql, db);
            } else if (type.equals("UPDATE")) {
                responses = updateRecordService.execute(sql, db);
            } else if (type.equals("DELETE")) {
                responses = deleteRecordService.execute(sql, db);
            } else if (type.equals("QUERY")) {
                responses = queryRecordService.execute(sql, db);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            responses.put(ConstantUtils.STATUS, ResponseStatus.STATUS_FAIL);
            responses.put(ConstantUtils.MESSAGE, e.getMessage());
        }
        return responses;
    }
}
