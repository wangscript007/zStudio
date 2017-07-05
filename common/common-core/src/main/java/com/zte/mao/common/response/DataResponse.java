package com.zte.mao.common.response;


@SuppressWarnings("serial")
public class DataResponse extends CommonResponse {
    private Object data;

    public DataResponse(byte status, String message, Object data) {
        super(status, message);
        this.data = data;
    }

    public DataResponse() {
		super();
	}

	public DataResponse(Object data) {
		super();
		this.data = data;
	}

	public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
