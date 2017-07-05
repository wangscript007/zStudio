package com.zte.mao.common.cipher.impl.util;

import com.zte.mao.common.cipher.api.CipherException;

public interface CipherHelperInterface {
	public String encrypt(String algName, String keyName, String clearText)throws CipherException;
	
	public String decrypt(String algName, String keyName, String cipherText)throws CipherException;
}
