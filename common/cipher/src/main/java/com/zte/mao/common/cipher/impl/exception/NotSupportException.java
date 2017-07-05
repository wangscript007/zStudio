package com.zte.mao.common.cipher.impl.exception;


/**
 * Current state of the UEPCM can not support this operation.
 */
public class NotSupportException extends RuntimeException {
	
	public NotSupportException(String msg){
		super(msg);
	}

}
