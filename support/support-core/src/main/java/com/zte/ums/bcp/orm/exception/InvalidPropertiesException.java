package com.zte.ums.bcp.orm.exception;

public class InvalidPropertiesException extends OrmException {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public InvalidPropertiesException(String message) {
        super(message);
    }

    public InvalidPropertiesException(Throwable t) {
        super(t);
    }

    public InvalidPropertiesException(String message, Throwable t) {
        super(message, t);
    }
}
