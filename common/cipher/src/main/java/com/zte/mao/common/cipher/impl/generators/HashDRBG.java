package com.zte.mao.common.cipher.impl.generators;

import com.zte.mao.common.cipher.impl.Digest;
import com.zte.mao.common.cipher.impl.digests.SHA256Digest;
import com.zte.mao.common.cipher.impl.util.SecureBigInteger;
import com.zte.mao.common.cipher.impl.util.encoder.Hex;

public class HashDRBG {
	
	private HashDRBG(State s){
		internal_state = s;
		modulus = TWO.pow(seedlen);
	}
	
	private SecureBigInteger modulus = ONE;
	
	//----- 和摘要算法相关的信息 --- begin
	private static Digest digest = new SHA256Digest();
	private static int outlen =  256;
	private static int seedlen = 440;
	//----- 和摘要算法相关的信息 --- end	
	
	// DRBG算法状态 V, C, reseed_counter...
	private State internal_state;
	
	
	public static HashDRBG Hash_DRBG_Instantiate_function(String entropyInput,
			String instantiation_nonce, String personalization_string) throws Exception {
		// 7.  seed_material = entropy_input || instantiation_nonce || personalization_string. 
		String seed_material = entropyInput + instantiation_nonce + personalization_string;
		// 8.  seed = Hash_df (seed_material, seedlen).  
		String seed = Hash_df(digest, seed_material, seedlen/4); // 除以4是为了由二进制的位数得到十六进制的长度
		// 9.  V = seed.
		String V = ensureLength(seedlen/4,seed);
		// 10. C = Hash_df ((0x00 || V), seedlen). 
		String C = Hash_df(digest, "00"+V, seedlen/4);
		// 11. reseed_counter = 1. 
		int reseed_counter = 1;
		// 12. (status, state_handle) = Find_state_space ( ).
		// 13. If (status ≠ “Success”), then Return (status, -1). 
		// 14. Save the internal state
		State s = new State(V, C, reseed_counter);
		HashDRBG instance = new HashDRBG(s);	
		return instance;
	}
	
	public void Hash_DRBG_Reseed_function(String entropy_input, String additional_input) throws Exception{
		
		// 6.  seed_material = 0x01 || V || entropy_input || additional_input. 
		String seed_material = "01" + internal_state.V + entropy_input + additional_input;
		// 7.  seed = Hash_df (seed_material, 440).
		String seed = Hash_df(digest, seed_material, seedlen/4);
		// 8.  V = seed.
		String V = ensureLength(seedlen/4,seed);
		// 9.  C = Hash_df ((0x00 || V), 440).
		String C = Hash_df (digest, "00" + V, seedlen/4);
		// 10. reseed_counter = 1. 
		int reseed_counter = 1;
		// 11. Update the appropriate state values. 
		internal_state.V = V;
		internal_state.C = C;
		internal_state.reseed_counter = reseed_counter;
	}
	
	public String Hash_DRBG_Generate_function(String additional_input)throws Exception{
		return Hash_DRBG_Generate_function(additional_input, outlen);
	}
	
	/**
	 * 
	 * @param additional_input
	 * @param requested_no_of_bits 二进制的位数
	 * @return
	 * @throws Exception
	 */
	public String Hash_DRBG_Generate_function(String additional_input, int requested_no_of_bits)throws Exception{
		// 7. If ((reseed_counter > 100,000) OR (prediction_resistance_request = 1)), then 
		// reseed
		// 8. If (additional_input ≠ Null), then do 
		if (additional_input != null && additional_input.length() > 0){
			// 7.1 w = Hash (0x02 || V || additional_input).
			String w = hash(digest,"02"+internal_state.V + additional_input);
			// 7.2 V = (V + w) mod 2**440. 
			internal_state.V = ensureLength(seedlen/4, BigIntegerToString((new SecureBigInteger(internal_state.V,16).add(new SecureBigInteger(w,16))).mod(modulus)));//( (new SecureBigInteger(internal_state.V,16).add(new SecureBigInteger(w,16))).mod(modulus)).toString(16);
			
		}
		int m = ceil(requested_no_of_bits/4, outlen/4);
		
		// 10. data = V.
		String data = internal_state.V;
		// 11. W = the Null string. 
		String W = "";
		for (int i=0; i<m; i++){
			// 12.1  wi = Hash (data). 
			String wi = hash(digest, data);
			// 12.2  W = W || wi.
			W = W + wi;
			// 12.3  data = (data + 1) mod 2**440
			SecureBigInteger i_data = new SecureBigInteger(data, 16).add(ONE).mod(modulus);
			data = BigIntegerToString(i_data);//i_data.toString(16);
		}
		// 13. pseudorandom_bits = Leftmost (requested_no_of_bits) bits of W. 
		String pseudorandom_bits = W.substring(0, requested_no_of_bits/4);
		// 14. H = Hash (0x03 || V). 
		String H = hash(digest, "03"+internal_state.V);
		// 15. V = (V + H + C + reseed_counter) mod 2440
		SecureBigInteger iV = new SecureBigInteger(internal_state.V, 16);
		SecureBigInteger iH = new SecureBigInteger(H, 16);
		SecureBigInteger iC = new SecureBigInteger(internal_state.C, 16);
		SecureBigInteger ireseed_counter = SecureBigInteger.valueOf(internal_state.reseed_counter);
		iV = iV.add(iH).add(iC).add(ireseed_counter);
		iV = iV.mod(modulus); 
		// 16. reseed_counter = reseed_counter + 1. 
		internal_state.reseed_counter ++;
		// 13. Update the changed values in the state. 
		// 13.1   internal_state (state_handle).V = V.
		// 13.2  internal_state (state_handle).reseed_counter = reseed_counter.
		internal_state.V = BigIntegerToString(iV);
		internal_state.V = ensureLength(seedlen/4, internal_state.V);
		// 14. Return (“Success”, pseudorandom_bits).
		return pseudorandom_bits;
	}
	
	private static String hash(Digest d, String msg) throws Exception{
	
		//byte[] m = org.apache.commons.codec.binary.Hex.decodeHex(msg.toCharArray());
		byte[] m = Hex.decode(msg.trim()); 
    	//byte[] m = new SecureBigInteger(msg.trim(),16).asUnsignedByteArray(); 
	    byte[] s = new byte[d.getDigestSize()];
	    d.reset();
	    d.update(m, 0, m.length);
	    d.doFinal(s, 0);
	    return Hex.encodeHex(s);//org.apache.commons.codec.binary.Hex.encodeHexString(s);
	}
	
    private static int ceil(int a, int b)
    {
        int m = 0;
        if (a % b > 0)
        {
            m = 1;
        }
        return a / b + m;
    }
    
    private static String ensureLength(int maxlen, String s) throws Exception{
    	int addLen = maxlen - s.length();
    	
    	if (addLen > 0){
	    	char[] tmp = new char[addLen];
	    	for (int i=0; i<addLen; i++){
	    		tmp[i] = '0';
	    	}
	    	return new String(tmp) + s;
    	}else if (addLen < 0){
    		throw new Exception("maxlen = " + maxlen + "  s = " + s + " ! exceed max length !");
    	}
    	return s;
    	
    }
	
	/**
	 * 
	 * @param digest
	 * @param msg
	 * @param no_of_bits_to_return 16进制的位数
	 * @return
	 */
	private static String Hash_df(Digest digest, String msg, int no_of_bits_to_return ) throws Exception{
		String temp = "";
		int digest_size = digest.getDigestSize()*2; // 转换为16进制的摘要长度，十六进制每2位能表示1个字节（32位）
		int len = ceil(no_of_bits_to_return, digest_size);
		// 3.  counter = an 8-bit binary value representing the integer "1". 
		int counter = 1;
		for (int i=0; i<len; i++){
			String str_counter = ensureLength(2, SecureBigInteger.valueOf(counter).toString(16));  // 8位二进制用16进制表示，长度为2
			
			String str_no_of_bits_to_return = ensureLength(8, SecureBigInteger.valueOf(no_of_bits_to_return*4).toString(16)); // 32位二进制用16进制表示，长度为8; no_of_bits_to_return*4是为了算出二进制格式的位数 ！
			
			// 4.1  temp = temp || Hash (counter || no_of_bits_to_return || input_string). 
			temp = temp + hash(digest, str_counter + str_no_of_bits_to_return + msg);
			// 4.2  counter = counter + 1. 
			counter++;
		}
		// 5.  requested_bits = Leftmost (no_of_bits_to_return) of temp. 
		return temp.substring(0, no_of_bits_to_return);
	}
	
	private static String BigIntegerToString(SecureBigInteger x){
		byte[] xbytes = x.asUnsignedByteArray();
		return Hex.encodeHex(xbytes); 
		//org.apache.commons.codec.binary.Hex.encodeHexString(xbytes);
	}
	
	/// constants
	private static final SecureBigInteger ONE = SecureBigInteger.valueOf(1);
	private static final SecureBigInteger TWO = SecureBigInteger.valueOf(2);

	/**
	 * for test only
	 */               
	public static void main(String[] args) throws Exception{

	
	}

}


/**
 * The internal state contains values for V, C, reseed_counter,
 * security_strength and prediction_resistance_flag, where V and C are
 * bitstrings, and reseed_counter, security_strength and the
 * prediction_resistance_flag are integers.
 * 
 * @author hu.jianghui
 * 
 */
class State{
	String V, C;
	int reseed_counter; 
	int security_strength;
	int prediction_resistance_flag; // A requested prediction resistance capability is indicated when prediction_resistance_flag = 1.
	
	public State(String v, String c, int ctr){
		V = v;
		C = c;
		reseed_counter = ctr;
		security_strength = 0;
		prediction_resistance_flag = 0;
	}

	public State(String v, String c, int ctr, int strength, int prflag){
		V = v;
		C = c;
		reseed_counter = ctr;
		security_strength = strength;
		prediction_resistance_flag = prflag;
	}
}
