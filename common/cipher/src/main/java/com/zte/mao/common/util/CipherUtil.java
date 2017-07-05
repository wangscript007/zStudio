package com.zte.mao.common.util;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;
import org.bouncycastle.util.encoders.Base64;

import com.zte.mao.common.cipher.api.CipherException;
import com.zte.mao.common.cipher.api.CipherService;
import com.zte.mao.common.cipher.impl.engines.AESEngine;
import com.zte.mao.common.cipher.impl.modes.CBCBlockCipher;
import com.zte.mao.common.cipher.impl.util.AesHelper;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

public class CipherUtil {
	private static Logger logger = Logger.getLogger(CipherUtil.class.getName());

	public static String encryptFromBrowser(String cipher) {
		return CipherUtil.encrypt(CipherUtil.decryptFromBrowser(cipher));
	}

	public static String encrypt(String source) {
		CipherService cipher = CipherService.getInstance();
		try {
			return cipher.encrypt(CipherService.Algorithms.AES,
					CipherService.SecretKeys.AES256_UEP_20110623, source);
		} catch (CipherException e) {
			logger.error(e.getMessage(), e);
		}

		return "";
	}
	
	public static String decrypt(String code) {
		CipherService cipher = CipherService.getInstance();
		try {
			return cipher.decrypt(CipherService.Algorithms.AES, CipherService.SecretKeys.AES256_UEP_20110623, code);
		} catch (CipherException e) {
			logger.error(e.getMessage(), e);
		}

		return "";
	}
	

	public static String decryptFromBrowser(String cipher) {
		String plaintext = null;
		try {
			byte[] originalCipher = Base64.decode(cipher);
			String hexEnc = Hex.encodeHex(originalCipher);
			plaintext = AesHelper
					.decrypt(new CBCBlockCipher(new AESEngine()), hexEnc,
							AES_KEY.getBytes("utf-8"), AES_IV.getBytes("utf-8"));
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		} catch (CipherException e) {
			logger.error(e.getMessage(), e);
		}

		return plaintext;
	}

	private static String AES_IV = "9763853428462486";
	private static String AES_KEY = "9763853428462486";

	public static void main(String[] args) {
		// System.out.println(CipherUtil.decryptFromBrowser("48mBV6PTLkgiJ8oCKc1FYQ=="));
		System.out.println(CipherUtil.encrypt("admin@mao11"));
//		System.out.println(CipherUtil.decrypt("08CD62055CC44711BD26E611CAC0C4B9"));
	}
}
