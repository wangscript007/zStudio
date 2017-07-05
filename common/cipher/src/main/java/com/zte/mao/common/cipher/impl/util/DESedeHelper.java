package com.zte.mao.common.cipher.impl.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidParameterException;

import com.zte.mao.common.cipher.api.CipherException;
import com.zte.mao.common.cipher.api.CipherService;
import com.zte.mao.common.cipher.impl.engines.DESedeEngine;
import com.zte.mao.common.cipher.impl.exception.DataLengthException;
import com.zte.mao.common.cipher.impl.exception.InvalidCipherTextException;
import com.zte.mao.common.cipher.impl.padding.PaddedBufferedBlockCipher;
import com.zte.mao.common.cipher.impl.params.KeyParameter;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

public class DESedeHelper implements CipherHelperInterface{

	public String encrypt(String algName, String keyName, String clearText)throws CipherException{
		if (keyName.equalsIgnoreCase(CipherService.SecretKeys.DESede_168_20120220)){
			return DESedeHelper.encrypt(clearText, JBOSS_KEY);
		}
		throw new CipherException(algName + " not support key " + keyName);
	}
	
	public String decrypt(String algName, String keyName, String cipherText)throws CipherException{
		if (keyName.equalsIgnoreCase(CipherService.SecretKeys.DESede_168_20120220)){
			return DESedeHelper.decrypt(cipherText, JBOSS_KEY);
		}
		throw new CipherException(algName + " not support key " + keyName);
	}
	
	public static String encrypt(String clearText, byte[] key) throws CipherException{
		// check param
		if (clearText == null){
			throw new InvalidParameterException("DES encrypt invalid parameter, clearText is null!");
		}
		if (key == null || Arrays.isZeroized(key)){
			throw new InvalidParameterException("DES encrypt invalid parameter, key is null or zero!");
		}
		// perform op
		byte[] input = null;
		try {
			input = clearText.getBytes("utf-8");
		} catch (UnsupportedEncodingException e) {
			throw new CipherException("encyrpt error: ", e);
		}
		PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new DESedeEngine());
		cipher.reset();
		cipher.init(true, new KeyParameter(key));
		byte[] outblock = new byte[cipher.getOutputSize(input.length)];
		int len = cipher.processBytes(input, 0, input.length, outblock, 0);
		try {
			len += cipher.doFinal(outblock, len);
		} catch (DataLengthException e) {
			throw new CipherException("encyrpt error: ", e);
		} catch (IllegalStateException e) {
			throw new CipherException("encyrpt error: ", e);
		} catch (InvalidCipherTextException e) {
			throw new CipherException("encyrpt error: ", e);
		}
		cipher.reset();
		String cipherText = Hex.encodeHex(outblock);
		return cipherText.toUpperCase();		
	}
	
	
	public static String decrypt(String cipherText, byte[] key) throws CipherException{
		// check param
		if (cipherText == null){
			throw new InvalidParameterException("DES decrypt invalid parameter, cipherText is null!");
		}
		if (key == null || Arrays.isZeroized(key)){
			throw new InvalidParameterException("DES decrypt invalid parameter, key is null or zero!");
		}
		// perform op
		byte[] input = null;
		input = Hex.decode(cipherText);
		
		PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new DESedeEngine());
		cipher.reset();
		cipher.init(false, new KeyParameter(key));
		byte[] outblock = new byte[cipher.getOutputSize(input.length)];
		int len = cipher.processBytes(input, 0, input.length, outblock, 0);
		try {
			len += cipher.doFinal(outblock, len);
		} catch (DataLengthException e) {
			throw new CipherException("decyrpt error: ", e);
		} catch (IllegalStateException e) {
			throw new CipherException("decyrpt error: ", e);
		} catch (InvalidCipherTextException e) {
			throw new CipherException("decyrpt error: ", e);
		}
		cipher.reset();
		String clearText;
		try {
			clearText = new String(outblock, 0, len, "utf-8");
		} catch (UnsupportedEncodingException e) {
			throw new CipherException("decyrpt error: ", e);
		}
		return clearText;		
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		String clearTexts[] = {"U_tywg_2008_ftp", ""};
		for (String clearText : clearTexts){
			String ct = CipherService.getInstance().encrypt(CipherService.Algorithms.DESede, 
					CipherService.SecretKeys.DESede_168_20120220, 
					clearText);  //BlowfishHelper.encrypt(clearText, key);
			System.out.println(ct);
		}
		
		String cipherTexts[] = {"683B0C4CF3DDCF7009E6737976E63BDC",	"BEDF605E2F345912"};
		for (String cipherText : cipherTexts){
			String ct = CipherService.getInstance().decrypt(CipherService.Algorithms.DESede, 
					CipherService.SecretKeys.DESede_168_20120220, 
					cipherText);
			System.out.println(ct);		
		}


	}
	
	private static final byte[] JBOSS_KEY = { -15, -10, -33, -99, -111, -5, 93, -87, -14, -8, -34, -100, -110, -8, 62, -88, -13, -14, -35, -101, -109, -16, 63, -87 };

}
