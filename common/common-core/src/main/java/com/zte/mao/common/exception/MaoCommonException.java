package com.zte.mao.common.exception;

public class MaoCommonException extends Exception {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public MaoCommonException(String message) {
        super(message);
    }

    public MaoCommonException(Exception e) {
        super(e);
    }

    public MaoCommonException(String message, Exception e) {
        super(message, e);
    }
}
