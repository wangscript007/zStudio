package com.zte.ums.bcp.orm.framework;

import org.springframework.stereotype.Service;

@Service
public class I18n {
    public static final String INVALID_PARAMETER = "Invalid Parameter:%s";
    public static final String MISS_ATTRIBUTE ="Miss Attribute: %s";
    public static final String UNSUPPORT_OPERATION = "%s is not supported on %s.";
    
    public String value(String key) {
        return key;
    }

    public String i18n(String key, Object... args) {
        return String.format(key, args);
    }
}
