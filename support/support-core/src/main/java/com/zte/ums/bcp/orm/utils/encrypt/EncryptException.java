package com.zte.ums.bcp.orm.utils.encrypt;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2007-2010
 * </p>
 * <p>
 * Company: UDS
 * </p>
 * 
 * @author not attributable
 * @version 1.0
 */

public class EncryptException extends Exception {
	/**
	 * 缺省构造函数
	 */
	public EncryptException() {
		super();
	}

	/**
	 * 带有异常信息字符串的构造函数
	 * 
	 * @param debugMessage
	 *            异常信息
	 */
	public EncryptException(String msg) {
		super(msg);
	}

	/**
	 * 带有异常信息对象的构造函数
	 * 
	 * @param e
	 *            异常信息对象
	 */
	public EncryptException(Throwable e) {
		super(e);
	}

	/**
	 * 同时带有异常信息字符串以及异常信息对象的构造函数
	 * 
	 * @param msg
	 *            异常信息字符串
	 * @param e
	 *            异常信息对象
	 */
	public EncryptException(String msg, Throwable e) {
		super(msg, e);
	}
}