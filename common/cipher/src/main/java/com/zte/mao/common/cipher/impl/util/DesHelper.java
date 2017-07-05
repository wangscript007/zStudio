package com.zte.mao.common.cipher.impl.util;

import java.security.InvalidParameterException;

import com.zte.mao.common.cipher.api.CipherException;
import com.zte.mao.common.cipher.api.CipherService;
import com.zte.mao.common.cipher.impl.engines.DESEngine;
import com.zte.mao.common.cipher.impl.exception.DataLengthException;
import com.zte.mao.common.cipher.impl.exception.InvalidCipherTextException;
import com.zte.mao.common.cipher.impl.padding.PaddedBufferedBlockCipher;
import com.zte.mao.common.cipher.impl.params.KeyParameter;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

/**
 * 对DES算法，不采用UTF-8编码(和原来的使用方式保持一致)
 * @author hu.jianghui
 *
 */
public class DesHelper implements CipherHelperInterface{
	
	public String encrypt(String algName, String keyName, String clearText)throws CipherException{
		if (keyName.equalsIgnoreCase(CipherService.SecretKeys.DES_JBOSS)){
			return DesHelper.encrypt(clearText, JBOSS_RAW_KEY_DATAS);
		}else if (keyName.equalsIgnoreCase(CipherService.SecretKeys.DES_SECURITY)){
			return DesHelper.encrypt(clearText, SECURITY_RAW_KEY_DATAS);
		}
		throw new CipherException(algName + " not support key " + keyName);
	}
	
	public String decrypt(String algName, String keyName, String cipherText)throws CipherException{
		if (keyName.equalsIgnoreCase(CipherService.SecretKeys.DES_JBOSS)){
			return DesHelper.decrypt(cipherText, JBOSS_RAW_KEY_DATAS);
		}else if (keyName.equalsIgnoreCase(CipherService.SecretKeys.DES_SECURITY)){
			return DesHelper.decrypt(cipherText, SECURITY_RAW_KEY_DATAS);
		}
		throw new CipherException(algName + " not support " + keyName);
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
		//try {
			input = clearText.getBytes();
		//} catch (UnsupportedEncodingException e) {
		//	throw new CipherException("encyrpt error: ", e);
		//}
		PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new DESEngine());
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
		
		PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new DESEngine());
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
		//try {
			clearText = new String(outblock, 0, len);
		//} catch (UnsupportedEncodingException e) {
		//	throw new CipherException("decyrpt error: ", e);
		//}
		return clearText;		
	}
	
	public static void main(String[] args) throws Exception{
		// 传递了密钥数据的加密和解密
		byte[] key = { -11, -4, -65, -99, -31, -10, 61, -82 };
		
		System.out.println(DesHelper.encrypt("U_tywg_2012", key));
		System.out.println(DesHelper.decrypt("DDA88D7F08790FDC347AA08D3570C23E", key));
		System.out.println(DesHelper.decrypt("94A6D907A249B995", key));
		System.out.println(DesHelper.decrypt("FE27C6D3E0DAC851529417157AF3340A", key));
		System.out.println(DesHelper.decrypt("DDA88D7F08790FDCF11D2F9F16C0416A", key));
		System.out.println(DesHelper.decrypt("B3E3E8ADE95844F29032E2176B0825CA3406405A2B36233A", key));
		
		System.out.println(new DesHelper().encrypt(CipherService.Algorithms.DES, CipherService.SecretKeys.DES_JBOSS, "U_tywg_2012"));
		System.out.println(new DesHelper().decrypt(CipherService.Algorithms.DES, CipherService.SecretKeys.DES_JBOSS, "DDA88D7F08790FDC347AA08D3570C23E"));
		System.out.println(new DesHelper().decrypt(CipherService.Algorithms.DES, CipherService.SecretKeys.DES_JBOSS, "94A6D907A249B995"));
		
	}
	

	private static final byte[] JBOSS_RAW_KEY_DATAS = { -11, -4, -65, -99, -31,
			-10, 61, -82 };

	private final static byte[] SECURITY_RAW_KEY_DATAS = new byte[] {
			(byte) 0xF1, (byte) 0xF7, (byte) 0xDF, (byte) 0x9D, (byte) 0x91,
			(byte) 0xF7, (byte) 0x3D, (byte) 0xA7 };


}
