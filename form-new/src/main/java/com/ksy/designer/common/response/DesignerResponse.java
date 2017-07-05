package com.ksy.designer.common.response;

public class DesignerResponse {
    public static final byte STATUS_SUCCESS = 1;
    public static final byte STATUS_FAIL = 0;

    private byte status = STATUS_SUCCESS;
    private String message = "";

    public DesignerResponse(byte status, String message) {
        this.status = status;
        this.message = message;
    }

    public static DesignerResponse getSuccessResponse() {
        return new DesignerResponse(STATUS_SUCCESS, "");
    }

    public static DesignerResponse getFailedResponse(String failedMsg) {
        return new DesignerResponse(STATUS_FAIL, failedMsg);
    }

    public byte getStatus() {
        return status;
    }

    public void setStatus(byte status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
