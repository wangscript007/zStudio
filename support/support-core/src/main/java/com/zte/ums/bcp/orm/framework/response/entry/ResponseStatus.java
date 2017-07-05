package com.zte.ums.bcp.orm.framework.response.entry;

import java.io.Serializable;

/**
 * <p>文件名称: ResponseStatus.java </p>
 * <p>文件描述: 无</p>
 * <p>版权所有: 版权所有(C)2015</p>
 * <p>公    司: 深圳市中兴通讯股份有限公司</p>
 * <p>内容摘要: 无</p>
 * <p>其他说明: 无</p>
 * <p>创建日期：2015-11-13</p>
 * <p>完成日期：2015-11-13</p>
 * <p>修改记录1: // 修改历史记录，包括修改日期、修改者及修改内容</p>
 * <pre>
 *    修改日期：
 *    版 本 号：
 *    修 改 人：
 *    修改内容：
 * </pre>
 * <p>修改记录2：…</p>
 * @version 1.0
 * @author zxj
 */
public class ResponseStatus implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    /** 成功 **/
    public static final int STATUS_SUCCESS = 1;
    /** 失败 **/
    public static final int STATUS_FAIL = 0;

    protected int status = STATUS_SUCCESS;

    public ResponseStatus() {
    }

    public ResponseStatus(int status) {
    	this.status = status;
	}

	public static ResponseStatus getSuccessResponseStatus() {
		return new ResponseStatus(STATUS_SUCCESS);
	}

	public static ResponseStatus getFailedResponseStatus() {
		return new ResponseStatus(STATUS_FAIL);
	}
    
    public int getStatus() {
        return status;
    }

    public ResponseStatus setStatus(int status) {
        this.status = status;
        return this;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + status;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        ResponseStatus other = (ResponseStatus) obj;
        if (status != other.status)
            return false;
        return true;
    }
    
}
