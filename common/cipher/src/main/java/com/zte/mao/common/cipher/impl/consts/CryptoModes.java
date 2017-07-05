package com.zte.mao.common.cipher.impl.consts;



public class CryptoModes {
//	/**
//	 * AES mode 
//	 *
//	 */
//	public enum AES_Mode{
//		/**
//		 * CBC 
//		 */
//		CBC(new CBCBlockCipher(new AESEngine())),
//		/**
//		 * CFB block size 8
//		 */
//		CFB8(new CFBBlockCipher(new AESEngine(), 8)),
//		/**
//		 * CFB
//		 */
//		CFB(new CFBBlockCipher(new AESEngine(), 128)),
//		/**
//		 * ECB
//		 */
//		ECB(new AESEngine()),
//		/**
//		 * OFB
//		 */
//		OFB(new OFBBlockCipher(new AESEngine(), 128));
//		
//		private BlockCipher cipher;
//		
//		private AES_Mode(BlockCipher c){
//			cipher = c;			
//		}
//		
//		public BlockCipher getCipher(){
//			cipher.reset();
//			return cipher;
//		}
//	};
	/**
	 * TDES mode 
	 *
	 */
//	public enum TDES_Mode{
//		/**
//		 * CBC
//		 */
//		CBC(new CBCBlockCipher(new DESedeEngine())),
//		/**
//		 * CFB block size 8
//		 */
//		CFB8(new CFBBlockCipher(new DESedeEngine(), 8)),
//		/**
//		 * CFB 
//		 */
//		CFB64(new CFBBlockCipher(new DESedeEngine(), 64)),
//		/**
//		 * ECB
//		 */
//		ECB(new DESedeEngine()),
//		/**
//		 * OFB
//		 */
//		OFB(new OFBBlockCipher(new DESedeEngine(), 64));
//	
//		private BlockCipher cipher;
//		
//		private TDES_Mode(BlockCipher c){
//			cipher = c;			
//		}
//		
//		public BlockCipher getCipher(){
//			cipher.reset();
//			return cipher;
//		}
//	};
	
	/**
	 * SHA mode
	 * @author hu.jianghui
	 *
	 */
//	public enum DIGEST_Mode{
//		/**
//		 * MD5
//		 */
//		MD5(new MD5Digest()),
//		/**
//		 * SHA-1
//		 */
//		SHA1(new SHA1Digest()),
//		/**
//		 * SHA-224
//		 */
//		SHA224(new SHA224Digest()),
//		/**
//		 * SHA-256
//		 */
//		SHA256(new SHA256Digest()),
//		/**
//		 * SHA-384
//		 */
//		SHA384(new SHA384Digest()),
//		/**
//		 * SHA-512
//		 */
//		SHA512(new SHA512Digest());
//		
//		private Digest digest;
//		
//		private DIGEST_Mode(Digest d){
//			digest = d;			
//		}
//		
//		public Digest getDigest(){
//			digest.reset();
//			return digest;
//		}
//	};
	/**
	 * RSA mode 
	 *
	 */
	public enum RSA_Mod{
		/**
		 * 1536 bit modulus
		 */
		mod1536(1536),
		/**
		 * 2048 bit modulus
		 */
		mod2048(2048),
		/**
		 * 3072 bit modulus
		 */
		mod3072(3072),
		/**
		 * 4096 bit modulus
		 */
		mod4096(4096);
		
		private int mod;
		
		private RSA_Mod(int m){
			mod = m;
		}
		
		public int getMod(){
			return mod;
		}
	};
}
