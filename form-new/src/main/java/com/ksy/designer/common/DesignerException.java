package com.ksy.designer.common;

public class DesignerException extends Exception {
    private static final long serialVersionUID = 1L;

    public DesignerException(String message) {
        super(message);
    }

    public DesignerException(Exception e) {
        super(e);
    }

    public DesignerException(String message, Exception e) {
        super(message, e);
    }
}
