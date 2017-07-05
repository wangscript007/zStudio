package com.zte.mao.common.cipher.impl.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidParameterException;

import com.zte.mao.common.cipher.api.CipherException;
import com.zte.mao.common.cipher.api.CipherService;
import com.zte.mao.common.cipher.impl.BlockCipher;
import com.zte.mao.common.cipher.impl.CipherParameters;
import com.zte.mao.common.cipher.impl.engines.AESEngine;
import com.zte.mao.common.cipher.impl.exception.DataLengthException;
import com.zte.mao.common.cipher.impl.exception.InvalidCipherTextException;
import com.zte.mao.common.cipher.impl.modes.CBCBlockCipher;
import com.zte.mao.common.cipher.impl.padding.PaddedBufferedBlockCipher;
import com.zte.mao.common.cipher.impl.params.KeyParameter;
import com.zte.mao.common.cipher.impl.params.ParametersWithIV;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

/**
 * AES加解密算法
 * 对字符串采用UTF-8
 * @author hu.jianghui
 *
 */
public class AesHelper implements CipherHelperInterface{
	
	public String encrypt(String algName, String keyName, String clearText)throws CipherException{
		if (keyName.equalsIgnoreCase(CipherService.SecretKeys.AES256_UEP_20110623)){
			return AesHelper.encrypt(new CBCBlockCipher(new AESEngine()), clearText, key256, iv1);
		} else if (keyName.equalsIgnoreCase(CipherService.SecretKeys.AES256_AOGUAN_20130306)) {
			return AesHelper.encrypt(new CBCBlockCipher(new AESEngine()), clearText, 
					Hex.decode(aoguanKey), Hex.decode(aoguanIV));
		}
		throw new CipherException(algName + " not support key " + keyName);
	}
	
	public String decrypt(String algName, String keyName, String cipherText)throws CipherException{
		if (keyName.equalsIgnoreCase(CipherService.SecretKeys.AES256_UEP_20110623)){
			return AesHelper.decrypt(new CBCBlockCipher(new AESEngine()), cipherText, key256, iv1);
		} else if (keyName.equalsIgnoreCase(CipherService.SecretKeys.AES256_AOGUAN_20130306)) {
			return AesHelper.decrypt(new CBCBlockCipher(new AESEngine()), cipherText, 
					Hex.decode(aoguanKey), Hex.decode(aoguanIV));
		}
		throw new CipherException(algName + " not support key " + keyName);
	}

	public static String encrypt(BlockCipher blockCipher, String clearText, byte[] key, byte[] iv) throws CipherException{
		// check param
		if (key == null || Arrays.isZeroized(key)){
			throw new InvalidParameterException("AES encrypt invalid parameter, key is null or zero!");
		}
		if (clearText == null){
			throw new InvalidParameterException("AES encrypt invalid parameter, clearText is null!");
		}
//		if (iv == null && mode != AES_Mode.ECB){
//			throw new InvalidParameterException("AES encrypt invalid parameter, iv is null and not ECB mode!");
//		}
		// perform op
		byte[] input = null;
		try {
			input = clearText.getBytes("utf-8");
		} catch (UnsupportedEncodingException e) {
			throw new CipherException("encyrpt error: ", e);
		}
		PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(blockCipher);
		cipher.reset();
		CipherParameters params = (iv != null)?new ParametersWithIV(new KeyParameter(key), iv):new KeyParameter(key);
		cipher.init(true, params);
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
	
	public static String decrypt(BlockCipher blockCipher, String cipherText, byte[] key, byte[] iv) throws CipherException{
		// check param
		if (key == null || Arrays.isZeroized(key)){
			throw new InvalidParameterException("AES decrypt invalid parameter, key is null or zero!");
		}
		if (cipherText == null){
			throw new InvalidParameterException("AES decrypt invalid parameter, cipherText is null!");
		}
//		if (iv == null && mode != AES_Mode.ECB){
//			throw new InvalidParameterException("AES decrypt invalid parameter, iv is null and not ECB mode!");
//		}
		// perform op
		byte[] input = null;
		input = Hex.decode(cipherText);
		
		PaddedBufferedBlockCipher cipher = new PaddedBufferedBlockCipher(blockCipher);
		cipher.reset();
		CipherParameters params = (iv != null)?new ParametersWithIV(new KeyParameter(key), iv):new KeyParameter(key);
		cipher.init(false, params);
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
	
	public static void main(String[] args) throws Exception {
    	byte[] key =	{
    	(byte)0xe7,(byte)0xab,(byte)0x8b,(byte)0xe6,(byte)0xb0,(byte)0x91,(byte)0xe5,(byte)0x9b,(byte)0xbd,(byte)0xe4,
    	(byte)0xbb,(byte)0xac,(byte)0xe6,(byte)0x88,(byte)0x91,(byte)0xe4,(byte)0xb8,(byte)0xad,(byte)0xe4,(byte)0xba,
    	(byte)0xba,(byte)0xe4,(byte)0xb8,(byte)0xba,(byte)0xe4,(byte)0xba,(byte)0x86,(byte)0xe5,(byte)0xbb,(byte)0xba,
    	(byte)0xe4,(byte)0xb8,};
    	
        byte[]iv = {(byte)0xe5,(byte)0x88,(byte)0x86,(byte)0xe7,(byte)0x9f,
    		    (byte)0xa5,(byte)0xe5,(byte)0xaf,(byte)0xb9,(byte)0xe8,
    	        (byte)0xaf,(byte)0x86,(byte)0xe5,(byte)0xad,(byte)0x90,(byte)0xe7};
        
        System.out.println(AesHelper.encrypt(new CBCBlockCipher(new AESEngine()), "aaaa500", key, iv));
        System.out.println(AesHelper.encrypt(new CBCBlockCipher(new AESEngine()), "aaaa0", key, iv));
        System.out.println(AesHelper.encrypt(new CBCBlockCipher(new AESEngine()), "", key, iv));
        System.out.println(AesHelper.decrypt(new CBCBlockCipher(new AESEngine()), "8f1cc6b31a652605b70fdf37ea973076", key, iv));
        System.out.println(AesHelper.decrypt(new CBCBlockCipher(new AESEngine()), "a1239d0102b62e80df72e58e8ab427f4", key, iv));
        System.out.println(AesHelper.decrypt(new CBCBlockCipher(new AESEngine()), "b6b23b3e294a7fe4f0ef9a0489e61c1e", key, iv));
        
        System.out.println(new AesHelper().encrypt(CipherService.Algorithms.AES, CipherService.SecretKeys.AES256_UEP_20110623, "aaaa500"));
        System.out.println(new AesHelper().decrypt(CipherService.Algorithms.AES, CipherService.SecretKeys.AES256_UEP_20110623, "8f1cc6b31a652605b70fdf37ea973076"));


    	/*
明文:"aaaa500"		密文:"8f1cc6b31a652605b70fdf37ea973076"
明文:"aaaa0"			密文:"a1239d0102b62e80df72e58e8ab427f4"
明文:""			密文:"b6b23b3e294a7fe4f0ef9a0489e61c1e"
    	 */

	}
	
	byte[] key256 =	{
	(byte)0xe7,(byte)0xab,(byte)0x8b,(byte)0xe6,(byte)0xb0,(byte)0x91,(byte)0xe5,(byte)0x9b,(byte)0xbd,(byte)0xe4,
	(byte)0xbb,(byte)0xac,(byte)0xe6,(byte)0x88,(byte)0x91,(byte)0xe4,(byte)0xb8,(byte)0xad,(byte)0xe4,(byte)0xba,
	(byte)0xba,(byte)0xe4,(byte)0xb8,(byte)0xba,(byte)0xe4,(byte)0xba,(byte)0x86,(byte)0xe5,(byte)0xbb,(byte)0xba,
	(byte)0xe4,(byte)0xb8};
	
    byte[] iv1 = {(byte)0xe5,(byte)0x88,(byte)0x86,(byte)0xe7,(byte)0x9f,
		    (byte)0xa5,(byte)0xe5,(byte)0xaf,(byte)0xb9,(byte)0xe8,
	        (byte)0xaf,(byte)0x86,(byte)0xe5,(byte)0xad,(byte)0x90,(byte)0xe7};


    String aoguanKey = "D6F9A3D49761874789889EEC706E1390C68C2B6A10E0D916849708786BE2D9E0";
    String aoguanIV = "E96638E784F5E7AECC6DBF965B4F8AE3";
    
}
