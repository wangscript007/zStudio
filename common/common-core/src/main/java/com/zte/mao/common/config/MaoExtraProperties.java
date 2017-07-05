package com.zte.mao.common.config;

public class MaoExtraProperties extends AbstractMaoProperties {
    private static MaoExtraProperties instance = null;

    public static synchronized MaoExtraProperties getInstance() {
        if (instance == null) {
            instance = new MaoExtraProperties();
        }
        return instance;
    }

    @Override
    protected String getConfigName() {
        String[] paths = MaoExtraProperties.class.getClassLoader().getResource("").getPath().split("/");
        if (paths == null || paths.length <= 3) {
            return null;
        }
        return "mao-" + paths[paths.length - 3] + "-config.properties";
    }
}
