package com.zte.mao.common.config;

public class MaoCommonProperties extends AbstractMaoProperties {
    private static MaoCommonProperties instance;

    private MaoCommonProperties() {
    }

    public static MaoCommonProperties getInstance() {
        if (instance == null) {
            synchronized (MaoCommonProperties.class) {
                if (instance == null) {
                    instance = new MaoCommonProperties();
                }
            }
        }
        return instance;
    }

    @Override
    protected String getConfigName() {
        return "config.properties";
    }
}
