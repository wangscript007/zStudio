package com.zte.mao.common.cipher.impl.params;

import java.security.SecureRandom;

import com.zte.mao.common.cipher.impl.util.SecureBigInteger;

public class DSA2Param {
	public SecureBigInteger p;
	public SecureBigInteger q;
	public SecureBigInteger g = null;
	
	public SecureBigInteger seed;
	public long counter;
	
	public DSA2Param(SecureBigInteger p, SecureBigInteger q, SecureBigInteger g){
		this.p = p;
		this.q = q;
		this.g = g;
	}
	
	public DSA2Param(SecureBigInteger p, SecureBigInteger q, SecureBigInteger seed, long counter){
		this.p = p;
		this.q = q;
		this.seed = seed;
		this.counter = counter;
	}
	
	/**
	 * A.2.1 Unverifiable Generation of the Generator g
	 * @return
	 */
	public SecureBigInteger genenerateG(){
		SecureBigInteger two = SecureBigInteger.valueOf(2); // 2
		SecureBigInteger pSub2 = p.subtract(two);           // p-2
		
		SecureBigInteger e = ( p.subtract(SecureBigInteger.ONE) ).divide(q); // e = (p-1)/q
		while (true){
			SecureBigInteger h = SecureBigInteger.createRandomInRange(two, pSub2, new SecureRandom()); //  1 < h < (p-1)
		
			g = h.modPow(e, p); // g = h**e mod p
			if (g.equals(SecureBigInteger.ONE)){
				continue;
			}else{
				return g;
			}
		}
	}
	
	public static SecureBigInteger genenerateG(SecureBigInteger p, SecureBigInteger q){
		SecureBigInteger g = null;
		SecureBigInteger two = SecureBigInteger.valueOf(2); // 2
		SecureBigInteger pSub2 = p.subtract(two);           // p-2
		
		SecureBigInteger e = ( p.subtract(SecureBigInteger.ONE) ).divide(q); // e = (p-1)/q
		while (true){
			SecureBigInteger h = SecureBigInteger.createRandomInRange(two, pSub2, new SecureRandom()); //  1 < h < (p-1)
		
			g = h.modPow(e, p); // g = h**e mod p
			if (g.equals(SecureBigInteger.ONE)){
				continue;
			}else{
				return g;
			}
		}
	}
	
	/**
	 * A.2.2 Assurance of the Validity of the Generator g
	 * @return
	 */
	public boolean verifyG(){
		if (g == null){
			return false;			
		}
		SecureBigInteger two = SecureBigInteger.valueOf(2); // 2
		SecureBigInteger pSub1 = p.subtract(SecureBigInteger.ONE);   // p-1
		
		if (g.compareTo(two)<0 || g.compareTo(pSub1)>0){  // 2<= g <= (p-1)
			return false;
		}
		
		SecureBigInteger t = g.modPow(q, p);
		//System.out.println(t);
		return t.equals(SecureBigInteger.ONE);
		
	}
	
	public void zeroization(){
		p.zeroization();
		q.zeroization();
		if (g!=null){
			g.zeroization();
		}
	}
	
	public boolean isZeroized(){
		if (p == null || q == null)
		{
			return true;
		}
		
		return (p.isZeroized() || q.isZeroized());
	}
	
	
}
