package com.zte.mao.common.cipher.api;

public class CipherException extends Exception {
	public CipherException(String msg){
		super(msg);
	}
	
	public CipherException(String msg,Throwable e){
		super(msg,e);
	}	
}
