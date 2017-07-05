package com.zte.mao.workbench.utils;

import java.util.UUID;

public class IdUtils {

    public static String getUUid() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
