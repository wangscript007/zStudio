package com.zte.ums.bcp.orm.utils;

import java.util.LinkedHashMap;
import java.util.Map;

import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;

public class ResultUtils {
    public static Map<String, Object> returnSuccess(){
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put(ConstantUtils.STATUS, ResponseStatus.STATUS_SUCCESS);
        map.put(ConstantUtils.MESSAGE, "success");
        return map;
    }
    
    public static Map<String, Object> insertSuccess(Map<String, Object> primaryKeyMap){
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put(ConstantUtils.STATUS, ResponseStatus.STATUS_SUCCESS);
        map.put(ConstantUtils.MESSAGE, "success");
        map.put("primaryKey", primaryKeyMap);
        return map;
    }
    
    public static Map<String, Object> returnFail(Object o){
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put(ConstantUtils.STATUS, ResponseStatus.STATUS_FAIL);
        map.put(ConstantUtils.MESSAGE, o);
        return map;
    }
}
