package com.zte.mao.common.cipher.impl.util;

import java.security.InvalidParameterException;

import com.zte.mao.common.cipher.api.CipherException;
import com.zte.mao.common.cipher.api.CipherService;
import com.zte.mao.common.cipher.impl.Digest;
import com.zte.mao.common.cipher.impl.digests.GeneralDigest;
import com.zte.mao.common.cipher.impl.digests.MD5Digest;
import com.zte.mao.common.cipher.impl.digests.SHA1Digest;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

/**
 * 不采用UTF-8编码(和原来的使用方式保持一致)
 * @author hu.jianghui
 *
 */
public class DigestHelper implements CipherHelperInterface{
	final static String charset = "UTF-8";
	
	public String encrypt(String algName, String keyName, String clearText)throws CipherException{
		if (!keyName.equalsIgnoreCase(CipherService.SecretKeys.NONE)){
			throw new CipherException(algName + " not support " + keyName );
		}
		
		if (algName.equalsIgnoreCase(CipherService.Algorithms.MD5)){
			return digest(new MD5Digest(), clearText); 
		}else if (algName.equalsIgnoreCase(CipherService.Algorithms.SHA1)){
			return digest(new SHA1Digest(), clearText);
		}
		throw new CipherException(algName + " not supported ! ");
	}
	
	public String decrypt(String algName, String keyName, String cipherText)throws CipherException{
		throw new CipherException(algName + " not support decryption !");
	}
	
	public static String digest(GeneralDigest generalDigest, String clearText)throws CipherException{
		// check param
		if (clearText == null){
			throw new InvalidParameterException("clearText is null!");
		}
		byte[] out = null;
		try{
			Digest digest = generalDigest;
			out = new byte[digest.getDigestSize()];
			byte[] msg = clearText.getBytes(charset);
		    digest.update(msg, 0, msg.length);
		    digest.doFinal(out, 0);
		}catch(Exception e){
			throw new CipherException("digest error:",e);
		}
		return Hex.encodeHex(out).toUpperCase();	
	}

	public static void main(String[] args) throws Exception {
		System.out.println(DigestHelper.digest( new MD5Digest(), "This is a samle"));
		System.out.println(DigestHelper.digest( new SHA1Digest(), "This is a samle"));
		System.out.println(DigestHelper.digest( new MD5Digest(), ""));
		System.out.println(DigestHelper.digest( new SHA1Digest(), ""));
		System.out.println(new DigestHelper().encrypt("MD5", "", "This is a samle"));
		System.out.println(new DigestHelper().encrypt("SHA", "", "This is a samle"));
	}

}
