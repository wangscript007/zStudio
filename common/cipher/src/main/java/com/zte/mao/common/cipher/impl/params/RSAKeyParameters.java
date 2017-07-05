package com.zte.mao.common.cipher.impl.params;

import com.zte.mao.common.cipher.impl.util.SecureBigInteger;

/**
 * RSA public key
 *
 */
public class RSAKeyParameters
    extends AsymmetricKeyParameter
{
    private SecureBigInteger      modulus;
    private SecureBigInteger      exponent;

    /**
     * Constructor
     * @param isPrivate determine public key or private key
     * @param modulus Modulus
     * @param exponent Exponent
     */
    public RSAKeyParameters(
        boolean     isPrivate,
        SecureBigInteger  modulus,
        SecureBigInteger  exponent)
    {
        super(isPrivate);

        this.modulus = modulus;
        this.exponent = exponent;
    }   
	/**
	 * Get modulus. 
	 * @return Modulus
	 */
    public SecureBigInteger getModulus()
    {
        return modulus;
    }
    /**
     * Get exponent
     * @return Exponent
     */
    public SecureBigInteger getExponent()
    {
        return exponent;
    }
    /**
     * User can ensure key data is properly zeroized by calling this method.
     */
    public void zeroization(){
    	modulus.zeroization();
    	exponent.zeroization();
    }
    
    public boolean isZeroized(){
    	if (modulus == null || exponent == null)
    		return true;
    	return (modulus.isZeroized() || exponent.isZeroized()); 
    }
}
