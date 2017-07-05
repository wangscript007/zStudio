package com.zte.mao.common.cipher.impl.params;

import com.zte.mao.common.cipher.impl.util.SecureBigInteger;

/**
 * RSA private key
 *
 */
public class RSAPrivateCrtKeyParameters
    extends RSAKeyParameters
{
    private SecureBigInteger  e;
    private SecureBigInteger  p;
    private SecureBigInteger  q;
    private SecureBigInteger  dP;
    private SecureBigInteger  dQ;
    private SecureBigInteger  qInv;

    /**
     * Constructor
     * @param modulus
     * @param publicExponent
     * @param privateExponent
     * @param p
     * @param q
     * @param dP
     * @param dQ
     * @param qInv
     */
    public RSAPrivateCrtKeyParameters(
    		SecureBigInteger  modulus,
    		SecureBigInteger  publicExponent,
    		SecureBigInteger  privateExponent,
    		SecureBigInteger  p,
    		SecureBigInteger  q,
    		SecureBigInteger  dP,
    		SecureBigInteger  dQ,
    		SecureBigInteger  qInv)
    {
        super(true, modulus, privateExponent);

        this.e = publicExponent;
        this.p = p;
        this.q = q;
        this.dP = dP;
        this.dQ = dQ;
        this.qInv = qInv;
    }

    /**
     * Get public exponent 
     * @return Public exponent
     */
    public SecureBigInteger getPublicExponent()
    {
        return e;
    }

    /**
     * Get p
     * @return P
     */
    public SecureBigInteger getP()
    {
        return p;
    }
    /**
     * Get q
     * @return Q
     */
    public SecureBigInteger getQ()
    {
        return q;
    }
    /**
     * Get dp
     * @return dp
     */
    public SecureBigInteger getDP()
    {
        return dP;
    }

    /**
     * Get dq
     * @return dq
     */
    public SecureBigInteger getDQ()
    {
        return dQ;
    }

    /**
     * Get qInv
     * @return qInv
     */
    public SecureBigInteger getQInv()
    {
        return qInv;
    }
    /**
     * User can ensure key data is properly zeroized by calling this method.
     */
    public void zeroization(){
        this.e.zeroization();
        this.p.zeroization();
        this.q.zeroization();
        this.dP.zeroization();
        this.dQ.zeroization();
        this.qInv.zeroization();
    }
    
    public boolean isZeroized(){
    	if (p == null || q == null){
    		return true;
    	}
    	
    	return (p.isZeroized() || q.isZeroized());
    }
    
}
