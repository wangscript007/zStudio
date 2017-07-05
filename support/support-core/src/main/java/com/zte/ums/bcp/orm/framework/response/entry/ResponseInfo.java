package com.zte.ums.bcp.orm.framework.response.entry;

/**
 * ORM 操作返回结果对象
 * @author 10191081
 *
 */
public class ResponseInfo extends ResponseStatus {
	public static final String DEFAULT_SUCCESS_MESSAGE = "success";
    private static final long serialVersionUID = 1L;

    private String message = DEFAULT_SUCCESS_MESSAGE;
    
    /**
     * 
     */
    public ResponseInfo() {
    	super();
    }

    /**
     * 
     * @param status
     * @param message
     */
    public ResponseInfo(int status, String message) {
    	super(status);
    	this.message = message;
    }

    public static ResponseInfo getSuccessResponseInfo() {
    	return new ResponseInfo(STATUS_SUCCESS, DEFAULT_SUCCESS_MESSAGE);
    }

    public String getMessage() {
        return message;
    }

    public ResponseInfo setMessage(String message) {
        this.message = message;
        return this;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((message == null) ? 0 : message.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        ResponseInfo other = (ResponseInfo) obj;
        if (message == null) {
            if (other.message != null)
                return false;
        } else if (!message.equals(other.message))
            return false;
        return true;
    }
    
    
}
