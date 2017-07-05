package com.ksy.designer.common.response;

public class DesignerDataResponse extends DesignerResponse {
    private Object data;

    public DesignerDataResponse(byte status, String message, Object data) {
        super(status, message);
        this.data = data;
    }

    public static DesignerDataResponse getSuccessResponse(Object data) {
        return new DesignerDataResponse(STATUS_SUCCESS, "", data);
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
