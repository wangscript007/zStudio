package com.zte.ums.bcp.orm.utils.encrypt;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.DESedeKeySpec;

import org.apache.log4j.Logger;

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

public class EncryptToolKit {
	private static final Logger LOG = Logger.getLogger(EncryptToolKit.class.getName());

	// DES加密口令的密钥数据
	private final static byte[] RAW_KEY_DATAS = new byte[] { (byte) 0xF5, (byte) 0xFC, (byte) 0xBF, (byte) 0x9D,
			(byte) 0xE1, (byte) 0xF6, (byte) 0x3D, (byte) 0xAE };

	// DESede加密口令的密钥数据
	private final static byte[] RAW_KEY_DATA_EDES = new byte[] { (byte) 0xF1, (byte) 0xF6, (byte) 0xDF, (byte) 0x9D,
			(byte) 0x91, (byte) 0xFB, (byte) 0x5D, (byte) 0xA9, (byte) 0xF2, (byte) 0xF8, (byte) 0xDE, (byte) 0x9C,
			(byte) 0x92, (byte) 0xF8, (byte) 0x3E, (byte) 0xA8, (byte) 0xF3, (byte) 0xF2, (byte) 0xDD, (byte) 0x9B,
			(byte) 0x93, (byte) 0xF0, (byte) 0x3F, (byte) 0xA9 };

	// 定义加密算法,可用 DES,DESede,Blowfish，此处实现DES以及DESede加密算法，但是实际使用DES算法
	private final static String ALGORITHM_DES = "DES";

	private final static String ALGORITHM_DESEDE = "DESede";

	/**
	 * 缺省构造函数。定义为私有，是为了防止在该类外面实例化
	 */
	private EncryptToolKit() {

	}

	/**
	 * 生成密钥
	 * 
	 * @param algorithmName
	 *            算法名称
	 * @return 生成密钥
	 * @throws NoSuchAlgorithmException
	 *             使用算法不存在异常
	 * @throws InvalidKeyException
	 *             无效密钥异常
	 * @throws InvalidKeySpecException
	 *             无效密钥规范异常
	 */
	private static SecretKey parseInit(String algorithmName) throws NoSuchAlgorithmException, InvalidKeyException,
			InvalidKeySpecException {
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(algorithmName);
		return keyFactory.generateSecret(getKeySpec(algorithmName));
	}

	/**
	 * 
	 * @param algorithmName
	 * @return
	 * @throws InvalidKeyException
	 */
	private static KeySpec getKeySpec(String algorithmName) throws InvalidKeyException {
		if (algorithmName.trim().equals(ALGORITHM_DES)) {
			return new DESKeySpec(RAW_KEY_DATAS);
		}
		else {
			return new DESedeKeySpec(RAW_KEY_DATA_EDES);
		}
	}

	/**
	 * 加密接口方法实现，缺省使用DES加密算法
	 * 
	 * @param clearText
	 *            将被加密的明文
	 * @return 返回加密后的密文
	 * @throws EncryptException
	 *             加密异常
	 */
	public static String encrypt(String clearText) throws EncryptException {
		return encrypt(clearText, ALGORITHM_DES);
	}

	/**
	 * 加密接口方法实现
	 * 
	 * @param clearText
	 *            将被加密的明文
	 * @param algorithmName
	 *            指定的加密算法名称
	 * @return 返回加密后的密文
	 * @throws EncryptException
	 *             加密异常
	 */
	public static String encrypt(String clearText, String algorithmName) throws EncryptException {
		if (clearText == null) {
			throw new EncryptException("Failed to execute encryption " + "for the string to be encrypted is null.");
		}
		else if (clearText.length() == 0) {
			return clearText;
		}
		else if (algorithmName == null || algorithmName.trim().length() == 0) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText
					+ "\" for the algorithm name is null.");
		}
		try {
			Cipher c1 = Cipher.getInstance(algorithmName);
			c1.init(Cipher.ENCRYPT_MODE, parseInit(algorithmName));
			byte[] cipherBytes = c1.doFinal(clearText.getBytes());
			return byte2hex(cipherBytes);
		}
		catch (NoSuchAlgorithmException ex) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText + "\".", ex);
		}
		catch (NoSuchPaddingException ex) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText + "\".", ex);
		}
		catch (InvalidKeyException ex) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText + "\".", ex);
		}
		catch (InvalidKeySpecException ex) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText + "\".", ex);
		}
		catch (BadPaddingException ex) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText + "\".", ex);
		}
		catch (IllegalBlockSizeException ex) {
			throw new EncryptException("Failed to encrypt the string \"" + clearText + "\".", ex);
		}
	}

	/**
	 * 解密接口方法实现，缺省使用DES解密算法
	 * 
	 * @param cipherText
	 *            将被解密的密文
	 * @return 返回解密后的明文
	 * @throws EncryptException
	 *             解密异常
	 */
	public static String decrypt(String cipherText) throws EncryptException {
		return decrypt(cipherText, ALGORITHM_DES);
	}

	/**
	 * 解密接口方法实现
	 * 
	 * @param cipherText
	 *            将被解密的密文
	 * @param algorithmName
	 *            指定的解密算法名称
	 * @return 返回解密后的明文
	 * @throws EncryptException
	 *             解密异常
	 */
	public static String decrypt(String cipherText, String algorithmName) throws EncryptException {
		if (cipherText == null) {
			throw new EncryptException("Failed to execute decryption " + "for the string to be decrypted is null.");
		}
		else if (cipherText.length() == 0 || cipherText.trim().length() == 0) {
			return cipherText;
		}
		else if (algorithmName == null || algorithmName.trim().length() == 0) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText
					+ "\". for the algorithm name is null.");
		}
		String result = null;
		try {
			// 先转化字符串成为字节流
			byte[] cipherBytes = string2byte(cipherText);
			// 解密
			Cipher c1 = Cipher.getInstance(algorithmName);
			c1.init(Cipher.DECRYPT_MODE, parseInit(algorithmName));
			byte[] clearBytes = c1.doFinal(cipherBytes);
			result = new String(clearBytes);
		}
		catch (NoSuchAlgorithmException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		catch (NoSuchPaddingException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		catch (InvalidKeyException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		catch (InvalidKeySpecException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		catch (BadPaddingException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		catch (IllegalBlockSizeException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		catch (EncryptException ex) {
			throw new EncryptException("Failed to decrypt the string \"" + cipherText + "\".", ex);
		}
		return result;
	}

	/**
	 * 二进制转字符串
	 * 
	 * @param textByte
	 * @return 转换后得到的字符串
	 */
	private static String byte2hex(byte[] textByte) {
		String hs = "";
		String stmp = "";
		for (int n = 0; n < textByte.length; n++) {
			stmp = (java.lang.Integer.toHexString(textByte[n] & 0XFF));
			if (stmp.length() == 1) {
				hs = hs + "0" + stmp;
			}
			else {
				hs = hs + stmp;
			}
		}
		return hs.toUpperCase();
	}

	/**
	 * 字符串转二进制
	 * 
	 * @param hexText
	 *            被转换的16进制字符串
	 * @return byte[] 转换后的2进制字节数组，当传入参数为null或者空时，返回null
	 * @throws EncryptException
	 *             字符窜转换异常
	 */
	private static byte[] string2byte(String hexText) throws EncryptException {
		// 二进制转字符串
		int len = hexText.length();
		byte[] hexBytes = null;
		// 字符串只有一个字符
		if (len == 1) {
			hexBytes = new byte[1];
			try {
				hexBytes[0] = (byte) Integer.parseInt(hexText, 16);
			}
			catch (NumberFormatException e) {
				throw new EncryptException("Failed to parse the String \"" + hexText + "\".", e);
			}
		}
		else if (len > 1) {
			// 一个字节是由两个16进制字符组成
			hexBytes = new byte[len / 2];
			String stmp = "";
			int index = 0;
			for (int i = 0; i < len; i += 2) {
				index = i + 2;
				// 为了防止因字符串中的字符数为奇数个，
				// 而造成的StringIndexOutOfBoundsException
				if (index > len) {
					index = len;
				}
				stmp = hexText.substring(i, index);
				try {
					hexBytes[i / 2] = (byte) Integer.parseInt(stmp, 16);
				}
				catch (NumberFormatException ex) {
					throw new EncryptException("Failed to parse the String \"" + hexText + "\"", ex);
				}
				catch (ArrayIndexOutOfBoundsException ex) {
					throw new EncryptException("Failed to parse the String \"" + hexText + "\"", ex);
				}
			}
		}
		return hexBytes;
	}

}