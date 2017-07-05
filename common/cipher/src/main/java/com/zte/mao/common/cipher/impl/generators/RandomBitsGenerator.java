package com.zte.mao.common.cipher.impl.generators;

import java.security.SecureRandom;

import com.zte.mao.common.cipher.impl.exception.ConditionalTestFail;
import com.zte.mao.common.cipher.impl.util.Logger;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

public class RandomBitsGenerator extends SecureRandom {

	private static SecureRandom srand;
	
	private static HashDRBG drbg;
	
	private static long reseedCount = 0;
	
	static final int BITS_PER_BYTE = 8;
	
	static String lastRnd = null; // for conditional test
	
	static{
		srand = new SecureRandom();
		byte[] entropy_bytes = new byte[256/BITS_PER_BYTE];
		srand.nextBytes(entropy_bytes);
		byte[] nonce_bytes = new byte[128/BITS_PER_BYTE];
		String personalizationString = "9f3896971ce8b62d904a61e2fdadb7d01526957d662b6595c67026eaff00b8aa";
		String entropyInput = Hex.encodeHex(entropy_bytes);
		String nonce = Hex.encodeHex(nonce_bytes);
		// instantiate drbg
		try {
			drbg = HashDRBG.Hash_DRBG_Instantiate_function(entropyInput, nonce, personalizationString);
		} catch (Exception e) {
			drbg = null;
		}
	}
	
	void reseed() throws Exception{
		byte[] entropy_reseed = new byte[256/BITS_PER_BYTE];
		srand.nextBytes(entropy_reseed);

		String entropyInputReseed    = Hex.encodeHex(entropy_reseed);
		String additionalInputReseed = "bd270961d6dda2a71ed7d02c0e93f8a07c6e8b580784114ac1ca71511d68859d";
		
		drbg.Hash_DRBG_Reseed_function(entropyInputReseed, additionalInputReseed);
	}
	
	private String sha256drbg(int bitsNum) throws Exception{
		String additionalInput = "2428e7b75287b8fe21b6b4d8c2f2acd017422ddbdd0a51181cefc7c5cded2083";
		String out = drbg.Hash_DRBG_Generate_function(additionalInput, bitsNum);
		
		// fips模块认证时要求的自检，现已不用了。
		//if (lastRnd != null && out.equals(lastRnd) ){
			//throw new ConditionalTestFail(ReturnValue.SHA256DRBG_CT_Fail.toString());
		//}
		
		lastRnd = out;
		
		reseedCount ++;
		// Reseed
		if (reseedCount > 1000000){
			reseed();
		}
		return out;
	}
	
	public void nextBytes(byte[] bytes) throws ConditionalTestFail {
		if (bytes != null){
			try {
				String randomBitString = sha256drbg(bytes.length * BITS_PER_BYTE);
				byte[] tmp = Hex.decode(randomBitString);
				if (tmp.length < bytes.length){
					Logger.info("rng error !");
				}
				System.arraycopy(tmp, 0, bytes, 0, bytes.length);
			} 
			catch (ConditionalTestFail f){
				throw f;
			}
			catch (Exception e) {
				Logger.info("rng = null !");
			}
		}
	}
	
	// call by SecureBigInteger
	public int nextInt() {
		byte[] b = new byte[4];
		nextBytes(b);
        return ((b[0] << 24) + (b[1] << 16) + (b[2] << 8) + (b[3] << 0));
	}
	
	/**
	 * For test purpose only 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		System.out.println("1b9c64d2d10ea703682b431fccde0fee5d985fb954d6857659f08930632226bb".length());
		
		RandomBitsGenerator rng = new RandomBitsGenerator();
		System.out.println(rng.sha256drbg(1024));
		for (int i=0; i<50; i++)
		System.out.println(rng.nextInt());
		
		rng.reseed();
		
		for (int i=0; i<50; i++)
			System.out.println(rng.nextInt());

		
	}

}
