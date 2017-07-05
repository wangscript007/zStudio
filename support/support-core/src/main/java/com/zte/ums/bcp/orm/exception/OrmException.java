package com.zte.ums.bcp.orm.exception;

public class OrmException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public OrmException(String message) {
		super(message);
	}

	public OrmException(Throwable t) {
		super(t);
	}

	public OrmException(String message, Throwable t) {
		super(message, t);
	}
	@Override
	public String getLocalizedMessage() {
	    Throwable cause = this.getCause();
        if (cause != null) {
            return cause.getLocalizedMessage();
        } else {
            return super.getLocalizedMessage();
        }
	}
	
	public String getMessage(){
        Throwable cause = this.getCause();
        if (cause != null) {
            return cause.getMessage();
        } else {
            return super.getMessage();
        }
    }
}
