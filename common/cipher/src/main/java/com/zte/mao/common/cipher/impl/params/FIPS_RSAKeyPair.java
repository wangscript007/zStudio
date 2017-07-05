package com.zte.mao.common.cipher.impl.params;

import com.zte.mao.common.cipher.impl.util.SecureBigInteger;

/**
 * RSA key pair
 */
public class FIPS_RSAKeyPair {
	
	
	private RSAKeyParameters pubKey;
	private RSAPrivateCrtKeyParameters priKey;

	/**
	 * Constructor
	 * @param pub public key
	 * @param pri private key
	 */
	public FIPS_RSAKeyPair(RSAKeyParameters pub, RSAPrivateCrtKeyParameters pri){
		pubKey = pub;
		priKey = pri;
	}
	/**
	 * Construct a public key for RSA signature verify.
	 * @param n N
	 * @param e E
	 */
	public FIPS_RSAKeyPair(SecureBigInteger n, SecureBigInteger e){
		priKey = null;
		pubKey = new RSAKeyParameters(false, n, e);
	}
	/**
	 * Get public key
	 * @return Public key
	 */
	public RSAKeyParameters getPublic(){
		return pubKey;
	}
	/**
	 * Get private key
	 * @return Private key
	 */
	public RSAPrivateCrtKeyParameters getPrivate(){
		return priKey;
	}
	
	/**
	 * User can ensure key pair data is properly zeroized by calling this method.
	 */
	public void zeroization() {
		if (priKey != null){
			priKey.zeroization();
		}
		if (pubKey != null){
			pubKey.zeroization();
		}
	}
	
}
