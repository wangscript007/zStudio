package com.zte.mao.common.cipher.api;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.zip.ZipFile;

import org.apache.log4j.Logger;

import com.zte.mao.common.cipher.impl.util.AesHelper;
import com.zte.mao.common.cipher.impl.util.BlowfishHelper;
import com.zte.mao.common.cipher.impl.util.CipherHelperInterface;
import com.zte.mao.common.cipher.impl.util.DESedeHelper;
import com.zte.mao.common.cipher.impl.util.DesHelper;
import com.zte.mao.common.cipher.impl.util.DigestHelper;


/**
 * 提供加密、解密、加密算法间密文转换功能
 */
public final class CipherService {
	
	private static Logger logger = Logger.getLogger(CipherService.class.getName());
	
	//private static final Object lock = new Object();
	
	/**
	 * 密码算法别名 
	 */
	public final static class Algorithms{
		/**
		 * AES加密解密算法，支持密钥长度128/192/256位，算法别名为AES/CBC/PKCS5Padding
		 */
		public static final String AES = "AES/CBC/PKCS5Padding";
		/**
		 * DES加密解密算法，支持密钥长度56位，算法别名为DES/ECB/PKCS5Padding
		 */
		public static final String DES = "DES/ECB/PKCS5Padding";
		/**
		 * MD5消息摘要算法，摘要长度128位（不支持解密），算法别名为MD5
		 */
		public static final String MD5 = "MD5";
		/**
		 * SHA-1安全散列算法，摘要长度160位（不支持解密），算法别名为SHA
		 */
		public static final String SHA1 = "SHA";
		/**
		 * Blowfish算法，密钥长度为256
		 */
		public static final String Blowfish = "Blowfish/ECB/PKCS5Padding";
		/**
		 * 3DES算法, 密钥长度为 168
		 */
		public static final String DESede = "DESede/ECB/PKCS5Padding";
		
	};
		
	/**
	 * 密钥别名 
	 */
	public final static class SecretKeys{
		/**
		 * DES密钥，取自JBoss，供底层模块进行DES加解密时使用，密钥别名为KEY_DES_JBOSS
		 */
		public static final String DES_JBOSS = "KEY_DES_JBOSS";
		/**
		 * DES密钥，取自网管平台usf-components-security.jar包，供应用层模块进行DES加解密时使用，密钥别名为KEY_DES_SECURITY
		 */
		public static final String DES_SECURITY = "KEY_DES_SECURITY";
		
		/**
		 * AES密钥，包含256位密钥和128位初始化向量，供AES算法加解密时使用，密钥别名为KEY_AES256_UEP_20110623
		 */
		public static final String AES256_UEP_20110623 = "KEY_AES256_UEP_20110623";
		/**
		 * 256位blowfish密钥
		 */
		public static final String Blowfish_256_20120220 = "KEY_BLOWFISH_256_20120220";
		
		/**
		 * 168位3DES密钥
		 */
		public static final String DESede_168_20120220 = "KEY_DESEDE_168_20120220";
		
		/**
		 * 空密钥，用于MD5和SHA等不支持密钥的算法，密钥别名为NONE
		 */
		public static final String NONE = "NONE";
		
		/**
		 * 傲冠门户对接密钥定义
		 */
		public static final String AES256_AOGUAN_20130306 = "KEY_AES256_AOGUAN_20130306";
	}
	
	/**
	 * 返回加密算法服务类实例
	 * @return 算法实例
	 */
	public static CipherService getInstance(){
		return new CipherService();
	}

	/**
	 * 用默认的算法和密钥加密。
	 * 
	 * @param clearText 明文
	 * @return 密文
	 * @throws CipherException
	 */
	public String encrypt(String clearText) throws CipherException{
		//synchronized(lock){
			checkAlgorithm(defaultAlgorithmName, defaultSecretKeyAlias, false);
			CipherHelperInterface cipherHelper = algs.get(defaultAlgorithmName);
			return cipherHelper.encrypt(defaultAlgorithmName, defaultSecretKeyAlias, clearText).toUpperCase();
		//}
	}

	/**
	 * 用默认的算法和密钥解密
	 * 
	 * @param cipherText 密文
	 * @return 明文
	 * @throws CipherException
	 */
	public String decrypt(String cipherText) throws CipherException{
		//synchronized(lock){
			checkAlgorithm(defaultAlgorithmName, defaultSecretKeyAlias, true);
			CipherHelperInterface cipherHelper = algs.get(defaultAlgorithmName);
			try{
			   return cipherHelper.decrypt(defaultAlgorithmName, defaultSecretKeyAlias, cipherText);
			}catch(CipherException ex){
				// 解密失败时，把密文以DES算法加密后打印出来，便于调试
				String desText = encrypt(Algorithms.DES, SecretKeys.DES_JBOSS,
						defaultAlgorithmName + "," + defaultSecretKeyAlias + ":" + cipherText);			
			    throw new CipherException("["+desText+"]", ex);
			}
		//}
	}

	/**
	 * 用给定的算法和密钥加密 。
	 * 对非可逆算法如sha-1和md5，得到的密文不能解密
	 * 
	 * @param algorithmName 密码算法
	 * @param secretKeyAlias 密钥别名, 对MD5和SHA-1算法传CipherService.SecretKeys.NONE
	 * @param clearText 明文
	 * @return 密文
	 * @throws CipherException
	 */
	public String encrypt(String algorithmName, String secretKeyAlias, String clearText)
			throws CipherException{
		//synchronized(lock){
			checkAlgorithm(algorithmName, secretKeyAlias, false);
			CipherHelperInterface cipherHelper = algs.get(algorithmName);
			return cipherHelper.encrypt(algorithmName, secretKeyAlias, clearText).toUpperCase();
		//}
	}

	/**
	 * 用给定的算法和密钥解密。
	 * 不能对MD5和SHA-1算法的密文解密
	 * 
	 * @param algorithmName 加密解密算法
	 * @param secretKeyAlias 密钥别名
	 * @param cipherText 密文
	 * @return 明文
	 * @throws CipherException
	 */
	public String decrypt(String algorithmName, String secretKeyAlias,
			String cipherText) throws CipherException{
		//synchronized(lock){
		checkAlgorithm(algorithmName, secretKeyAlias, true);
		CipherHelperInterface cipherHelper = algs.get(algorithmName);
		try{
			return cipherHelper.decrypt(algorithmName, secretKeyAlias, cipherText);
		}catch(CipherException ex){
			// 解密失败时，把密文以DES算法加密后打印出来，便于调试
			String desText = encrypt(Algorithms.DES, SecretKeys.DES_JBOSS,
					algorithmName + "," + secretKeyAlias + ":" + cipherText);			
		    throw new CipherException("["+desText+"]", ex);
		}
		//}

	}

	/**
	 * 将一种算法的密文转换为另一种算法的密文。
	 * 先对原始密文解密，然后再用目标密码算法加密并输出密文
	 * 原始密文的加密算法不能是MD5和SHA-1
	 * 
	 * @param srcAlgorithmName 原始密文的加密算法（不支持MD5和SHA-1）
	 * @param srcSecretKeyAlias 原始密文的加密密钥别名
	 * @param dstAlgorithmName 要转换的密码算法
	 * @param dstSecretKeyAlias 加密密钥，对MD5和SHA1算法传入CipherService.SecretKeys.NONE
	 * @param cipherText 原始密文
	 * @return 转换后的密文
	 * @throws CipherException
	 */
	public String convertCipher(String srcAlgorithmName, String srcSecretKeyAlias,
			String dstAlgorithmName, String dstSecretKeyAlias, String cipherText) throws CipherException{
		//synchronized(lock){
			checkAlgorithm(srcAlgorithmName, srcSecretKeyAlias, true);
			checkAlgorithm(dstAlgorithmName, dstSecretKeyAlias, false);
			// 1. 先解密
			CipherHelperInterface helper1 = algs.get(srcAlgorithmName);
			try{
				String clearText = helper1.decrypt(srcAlgorithmName, srcSecretKeyAlias, cipherText);
				// 2. 再用另一种算法加密
				CipherHelperInterface helper2 = algs.get(dstAlgorithmName);
				return helper2.encrypt(dstAlgorithmName, dstSecretKeyAlias, clearText);
			}catch(CipherException ex){
				// 解密失败时，把密文以DES算法加密后打印出来，便于调试
				String desText = encrypt(Algorithms.DES, SecretKeys.DES_JBOSS, 
						srcAlgorithmName+", "+srcSecretKeyAlias + ":" +cipherText);			
			    throw new CipherException("["+desText+"]", ex);
			}		
		//}

	}
	
	/**
	 * 返回默认的加密算法名
	 * @return 加密算法
	 */
	public String getAlgorithmName(){
		return defaultAlgorithmName;
	}
	
	/**
	 * 返回默认的加密密钥别名
	 * @return 密钥别名
	 */
	public String getSecretKeyAlias(){
		return defaultSecretKeyAlias;
	}
	
	/*------------- private members ----------------*/
	
	private String defaultAlgorithmName;
	
	private String defaultSecretKeyAlias;

	private CipherService(){
		// 读取jar包中配置文件，获得默认加密算法和别名
		File jarFile = new File(getPath()+"/uep-cipher.jar");
		try{
			ZipFile zjar = new ZipFile(jarFile);
			try{
				BufferedReader br = new BufferedReader(new InputStreamReader(zjar.getInputStream(zjar.getEntry("set.properties"))));
				String line = null;
				String alg = null;
				String key = null;
				while ((line = br.readLine()) != null){
					if (line.startsWith("alg=")){
						alg = line.substring("alg=".length());
					}else if (line.startsWith("key=")){
						key = line.substring("key=".length());
					}
					
					if (alg != null && key != null){
						defaultAlgorithmName = alg;
						defaultSecretKeyAlias = key;
					}
				}
			}finally{
				zjar.close();
			}
		}
		catch(Exception e){
			defaultAlgorithmName = CipherService.Algorithms.AES;
			defaultSecretKeyAlias = CipherService.SecretKeys.AES256_UEP_20110623;
		}
	}
		
	// 保存算法与密钥别名的映射关系(一对多关系)
	private static HashMap<String, String> algKey = new HashMap<String, String>();
	
	// 保存算法别名与具体算法实现类的映射关系 
	private static HashMap<String, CipherHelperInterface> algs = new HashMap<String, CipherHelperInterface>();
	
	static {
		algKey.clear();
		algKey.put(Algorithms.AES, SecretKeys.AES256_UEP_20110623 + "," + SecretKeys.AES256_AOGUAN_20130306);
		algKey.put(Algorithms.DES, SecretKeys.DES_JBOSS+","+SecretKeys.DES_SECURITY);
		algKey.put(Algorithms.MD5, SecretKeys.NONE);
		algKey.put(Algorithms.SHA1, SecretKeys.NONE);
		algKey.put(Algorithms.Blowfish, SecretKeys.Blowfish_256_20120220);
		algKey.put(Algorithms.DESede, SecretKeys.DESede_168_20120220);
		
		algs.clear();
		algs.put(Algorithms.AES, new AesHelper());
		algs.put(Algorithms.DES, new DesHelper());
		algs.put(Algorithms.MD5, new DigestHelper());
		algs.put(Algorithms.SHA1, new DigestHelper());
		algs.put(Algorithms.Blowfish, new BlowfishHelper());
		algs.put(Algorithms.DESede, new DESedeHelper());
	}
	
	private static void checkAlgorithm(String alg, String key, boolean isDecrypt) throws CipherException{
		// check alg & key
		String secretKeyname = algKey.get(alg);
		if (null == secretKeyname){
			throw new CipherException(alg + " not support"); 
		}
		if (secretKeyname.indexOf(key)<0){
			throw new CipherException(alg + " not support key " + key); 
		}
		// check alg & operation
		if (isDecrypt){
			if (alg.equalsIgnoreCase(Algorithms.MD5) || alg.equalsIgnoreCase(Algorithms.SHA1)){
				throw new CipherException(alg + " not support decryption !" );
			}
		}
	}
	
	static String getPath() {
		java.net.URL url = CipherService.class.getProtectionDomain()
				.getCodeSource().getLocation();
		String filePath = null;
		try {
			filePath = java.net.URLDecoder.decode(url.getPath(), "utf-8");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		if (filePath.endsWith(".jar"))
			filePath = filePath.substring(0, filePath.lastIndexOf("/") + 1);
		java.io.File file = new java.io.File(filePath);
		filePath = file.getAbsolutePath();
		return filePath;
	}
	
	public static void main(String[] args){
		CipherService cipher = CipherService.getInstance();

		System.out.println("start...");
		try {

			String cipherText = cipher.encrypt(Algorithms.AES, SecretKeys.AES256_AOGUAN_20130306, "~!@#$%^&*()+faeif");
			System.out.println("cipher text: " + cipherText);
			
			String plainText = cipher.decrypt(Algorithms.AES, SecretKeys.AES256_AOGUAN_20130306, cipherText);
			System.out.println("plain text: " + plainText);
			
			String cipherText2 = cipher.encrypt("");
			System.out.println(cipherText2);
			
		} catch (CipherException e1) {
			logger.error(e1.getMessage(), e1);
		} 

	}

}
