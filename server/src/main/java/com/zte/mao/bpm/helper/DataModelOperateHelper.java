package com.zte.mao.bpm.helper;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.RequestMethod;

public class DataModelOperateHelper {
    private static final Map<String, String> MODEL_METHOD_MAP = new HashMap<String, String>();
    static {
        MODEL_METHOD_MAP.put(RequestMethod.POST.name(), "create");
        MODEL_METHOD_MAP.put(RequestMethod.PUT.name(), "update");
        MODEL_METHOD_MAP.put(RequestMethod.GET.name(), "getlist");
        MODEL_METHOD_MAP.put(RequestMethod.DELETE.name(), "delete");

    }

    public static String getModelMethod(String requestMethod) {
        return MODEL_METHOD_MAP.get(requestMethod);
    }
    
    public static String[] toArray(String string) {
        if (StringUtils.isNotBlank(string)) {
            return new String[] { string };
        }
        return new String[0];
    }
}
