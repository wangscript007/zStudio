package com.zte.mao.common.cipher.impl.signers;


import com.zte.mao.common.cipher.impl.Digest;
import com.zte.mao.common.cipher.impl.exception.RuntimeCryptoException;
import com.zte.mao.common.cipher.impl.generators.RandomBitsGenerator;
import com.zte.mao.common.cipher.impl.params.DSA2Param;
import com.zte.mao.common.cipher.impl.util.SecureBigInteger;

/**
 * DSA2 algorthim according to FIPS 186-3
 * 
 * @author hu.jianghui
 * 
 */
public class DSA2Signer {


	/**
	 * A.1.1.2 Generation of the Probable Primes p and q Using an Approved Hash Function
	 * @param L
	 * @param N
	 * @param seedlen
	 * @param digest
	 * @return
	 * @throws Exception
	 */
	public static DSA2Param genPQ(int L, int N, int seedlen, Digest digest)
			throws Exception {
		int iterations = 56; // from FIPS 186-3 Table c.1
		if (L == 3072 && N == 256) {
			iterations = 64;
		}
		
		SecureBigInteger twoPowLminusOne = TWO.pow(L - 1); // 2**(L-1)
		SecureBigInteger twoPowNMinusOne = TWO.pow(N - 1); // 2**(N-1)
		

		int outlen = digest.getDigestSize() * 8;
		// 3.
		int n = ceil(L, outlen) - 1;
		// 4.
		int b = L - 1 - (n * outlen);

		SecureBigInteger[] V = new SecureBigInteger[n + 1];
		SecureBigInteger q = null;
		byte[] domain_para_seed = new byte[seedlen / 8];

		while (true) {
			while (true) {
				// 5.
				rnd.nextBytes(domain_para_seed);
				// 6.
				SecureBigInteger U = new SecureBigInteger(1, hash(digest,	domain_para_seed)).mod(twoPowNMinusOne);
				// 7.
				q = twoPowNMinusOne.add(U).add(ONE).subtract(U.mod(TWO));
				// 8.
				if (q.millerRabinTest186_3(iterations, rnd)) {
					// System.out.println("q is prime !" +
					// q.isProbablePrime(80));
					break;
				} else {
					// System.out.println("q is not prime !" +
					// q.isProbablePrime(80));
				}
			}
			// 10.
			int offset = 1;
			// 11.
			SecureBigInteger seed = new SecureBigInteger(1, domain_para_seed);
			int counterLimit = 4 * L - 1;
			for (int counter = 0; counter <= counterLimit; counter++) {
				for (int j = 0; j <= n; j++) {
					SecureBigInteger tmp = seed.add(SecureBigInteger
							.valueOf(offset + j));
					tmp = tmp.mod(TWO.pow(seedlen));
					V[j] = new SecureBigInteger(1, hash(digest,
							tmp.asUnsignedByteArray()));
				}
				// 11.2
				SecureBigInteger W = V[0];

				for (int j = 1; j <= n - 1; j++) {
					W = W.add(V[j].multiply(TWO.pow(outlen * j)));
				}

				SecureBigInteger tmp = V[n].mod(TWO.pow(b));
				tmp = tmp.multiply(TWO.pow(n * outlen));
				W = W.add(tmp);

				// 11.3
				
				SecureBigInteger X = W.add(twoPowLminusOne);
				// 11.4
				SecureBigInteger c = X.mod(TWO.multiply(q));
				// 11.5
				SecureBigInteger p = X.subtract(c.subtract(ONE));

				// 11.6
				if (p.compareTo(twoPowLminusOne) < 0) {
					offset = offset + n + 1;
					continue;
				}
				// 11.7
				if (p.millerRabinTest186_3(iterations, rnd)) {
					// 11.8
					return new DSA2Param(p, q, seed, counter);
				}
				// 11.9
				offset = offset + n + 1;
			}
		}
	}
	
	/**A.1.1.3 Validation of the Probable Primes p and q that were Generated Using an Approved Hash Function
	 * 
	 * @param pq
	 * @param digest
	 * @return
	 * @throws Exception
	 */
	public static boolean verPQ(DSA2Param pq, Digest digest)throws Exception{
		int L = pq.p.bitLength();
		int N = pq.q.bitLength();
		
		SecureBigInteger twoPowNMinusOne = TWO.pow(N - 1);
		SecureBigInteger twoPowLMinusOne = TWO.pow(L - 1);

		
		int outlen = digest.getDigestSize() * 8;
		int n = ceil(L, outlen) - 1;
		int b = L - 1 - (n * outlen);
		
		int iterations = 56; // from FIPS 186-3 Table c.1
		if (L == 3072 && N == 256) {
			iterations = 64;
		}
		
		if (pq.counter > (4*L-1)){
			return false;
		}
		
		if (!pq.p.subtract(ONE).mod(pq.q).equals(SecureBigInteger.ZERO)){ // q does not divide (p-1) return false
			return false;			
		}

		
		int seedlen = pq.seed.bitLength();
		byte[] tmp = hash(digest, pq.seed.asUnsignedByteArray());
		
		SecureBigInteger compute_p = null;
		SecureBigInteger compute_q = null;
		boolean compute_pIsPrime = false;
		
		// 7.
		SecureBigInteger U = new SecureBigInteger(1, tmp).mod(twoPowNMinusOne);
		// 8.
		compute_q = twoPowNMinusOne.add(U).add(ONE).subtract(U.mod(TWO));
		// 9. 
		if (!compute_q.millerRabinTest186_3(iterations, rnd)){
			return false;
		}
		// 12. 
		int offset = 1;
		// 13.
		SecureBigInteger[] V = new SecureBigInteger[n+1];
		int i=0;
		for (i =0; i<=pq.counter; i++){
			for (int j=0; j<=n; j++){
				SecureBigInteger temp = pq.seed.add(SecureBigInteger
						.valueOf(offset + j));
				temp = temp.mod(TWO.pow(seedlen));
				V[j] = new SecureBigInteger(1, hash(digest,	temp.asUnsignedByteArray()));
				
			}
			// 13.2
			SecureBigInteger W = V[0];

			for (int j = 1; j <= n - 1; j++) {
				W = W.add(V[j].multiply(TWO.pow(outlen * j)));
			}

			SecureBigInteger temp = V[n].mod(TWO.pow(b));
			temp = temp.multiply(TWO.pow(n * outlen));
			W = W.add(temp);
			// 13.3
			SecureBigInteger X = W.add(twoPowLMinusOne);
			// 13.4
			SecureBigInteger c = X.mod(TWO.multiply(compute_q));
			// 13.5
			compute_p = X.subtract(c.subtract(ONE));


			if (compute_p.compareTo(twoPowLMinusOne) < 0) {
				offset = offset + n + 1;
				continue;
			}

			if (compute_p.millerRabinTest186_3(iterations, rnd)) {
				compute_pIsPrime = true;
				break;
			}
			offset = offset + n + 1;
		}
		
		if (i != pq.counter || !(compute_p.equals(pq.p)) || !(compute_pIsPrime) ){
			return false;
		}
		return true;
	}
	
	/**
	 * B.1.1 Key Pair Generation Using Extra Random Bits 
	 * @param pqg
	 * @return {x, y}
	 * @throws Exception
	 */
	public static SecureBigInteger[] genKeyPair(DSA2Param pqg) throws Exception{
		int N = pqg.p.bitLength();
		int L = pqg.q.bitLength();
		
		// 产生N + 64位长的非负随机数
		SecureBigInteger c = new SecureBigInteger(N + 64, rnd);
		SecureBigInteger qSubOne = pqg.q.subtract(ONE); // q - 1
		SecureBigInteger x = (c.mod(qSubOne)).add(ONE); // x = (c mod(q-1)) + 1
		SecureBigInteger y = pqg.g.modPow(x, pqg.p);    // y = g**x mod p
		return new SecureBigInteger[]{x,y};
	}

	/**
	 * 4.6 DSA Signature Generation 
	 * @param pqg
	 * @param x
	 * @param m
	 * @param digest
	 * @return
	 * @throws Exception
	 */
	public static SecureBigInteger[] genSignature(DSA2Param pqg, SecureBigInteger x, byte[] m, Digest digest) throws Exception{
		
		//System.out.println(digest.getAlgorithmName());
				
		int L = pqg.p.bitLength();
		int N = pqg.q.bitLength();
		int outlen = digest.getDigestSize() * 8;
		
		SecureBigInteger k = genPerMsgSecret(pqg);
		// r = (g**k mod p) mod q
		SecureBigInteger r = pqg.g.modPow(k, pqg.p).mod(pqg.q);//((pqg.g.pow(k.intValue())).mod(pqg.p)).mod(pqg.q);

		int hashlen = (Math.min(N, outlen))/8; // bit length to byte length

		byte[] tmp = hash(digest, m);
		byte[] z = null; //new byte[hashlen];
		
		if (hashlen == digest.getDigestSize()){
			z = tmp;
		}else{
			z = new byte[hashlen];
			System.arraycopy(tmp, 0, z, 0, hashlen);
		}
		
		SecureBigInteger invK = inverse(k, pqg.q); // k**-1
		
		if ((invK.multiply(k)).mod(pqg.q).compareTo(ONE)!=0){
			throw new RuntimeCryptoException(" 1 <> ((K*k**-1)mod q)");
		}
		
		SecureBigInteger Z = new SecureBigInteger(1,z);
		SecureBigInteger s = invK.multiply(Z.add(x.multiply(r))).mod(pqg.q);
		
		return new SecureBigInteger[]{r,s};
	}
	
	/**
	 * 4.7 DSA Signature Verification and Validation 
	 * @param pqg
	 * @param y
	 * @param m
	 * @param sig
	 * @param digest
	 * @return
	 * @throws Exception
	 */
	public static boolean verSignature(DSA2Param pqg, SecureBigInteger y, byte[] m, SecureBigInteger[] sig, Digest digest) throws Exception{
		int N = pqg.q.bitLength();
		int outlen = digest.getDigestSize() * 8;

		SecureBigInteger r = sig[0];
		SecureBigInteger s = sig[1];
		// 1. make sure 0<r<q and 0<s<q
		if (r.compareTo(SecureBigInteger.ZERO)<=0 || r.compareTo(pqg.q)>=0){
			return false;
		}
		if (s.compareTo(SecureBigInteger.ZERO)<=0 || s.compareTo(pqg.q)>=0){
			return false;
		}
		SecureBigInteger invS = inverse(s, pqg.q);
		
		// 2. 
		SecureBigInteger w = invS.mod(pqg.q);
		
		int hashlen = (Math.min(N, outlen))/8; // bit length to byte length
		byte[] tmp = hash(digest, m);
		byte[] z = null; //new byte[hashlen];
		if (hashlen == digest.getDigestSize()){
			z = tmp;
		}else{
			z = new byte[hashlen];
			System.arraycopy(tmp, 0, z, 0, hashlen);
		}
		SecureBigInteger Z = new SecureBigInteger(1,z);
		SecureBigInteger u1 = Z.multiply(w).mod(pqg.q);
		SecureBigInteger u2 = r.multiply(w).mod(pqg.q);
		
		u1 = pqg.g.modPow(u1, pqg.p);
		u2 = y.modPow(u2, pqg.p);
		
		SecureBigInteger v = u1.multiply(u2).mod(pqg.p).mod(pqg.q);
		return v.equals(r);
	}
	
	/**
	 * B.2.1 Per-Message Secret Number Generation Using Extra Random Bits
	 * @param pqg
	 * @return K
	 * @throws Exception
	 */
	private static SecureBigInteger genPerMsgSecret(DSA2Param pqg) throws Exception{
		int N = pqg.p.bitLength();
		int L = pqg.q.bitLength();
		// 产生N + 64位长的非负随机数
		SecureBigInteger c = new SecureBigInteger(N + 64, rnd);
		// 产生K
		SecureBigInteger k = (c.mod(pqg.q.subtract(ONE))).add(ONE); // k = (c mod (q-1))+1
		return k;
	}
	
	/**
	 * C.1 Computation of the Inverse Value 
	 * @param z
	 * @param a
	 * @return
	 * @throws Exception
	 */
	private static SecureBigInteger inverse(SecureBigInteger z, SecureBigInteger a)throws Exception{
		SecureBigInteger i = a;
		SecureBigInteger j = z;
		SecureBigInteger y2 = SecureBigInteger.ZERO;
		SecureBigInteger y1 = ONE;
		
		while (j.compareTo(SecureBigInteger.ZERO)>0){ // j > 0就循环
			SecureBigInteger quotient = i.divide(j);
			SecureBigInteger remainder = i.subtract(j.multiply(quotient));
			SecureBigInteger y = y2.subtract(y1.multiply(quotient));
			i = j;
			j = remainder;
			y2 = y1;
			y1 = y;
		}
		
		if (!(i.equals(ONE))){
			throw new RuntimeCryptoException("i <> 1");
		}
		
		return y2.mod(a);
	}

	private static byte[] hash(Digest d, byte[] m) throws Exception {
		byte[] s = new byte[d.getDigestSize()];
		d.reset();
		d.update(m, 0, m.length);
		d.doFinal(s, 0);
		return s;
	}

	private static int ceil(int a, int b) {
		int m = 0;
		if (a % b > 0) {
			m = 1;
		}
		return a / b + m;
	}

	/**
	 * for test only !
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
/*		// 1. generate p,q,g
		DSA2Param pq = DSA2Signer.genPQ(2048, 256, 256, new SHA256Digest());
		SecureBigInteger g = pq.genenerateG();
		pq.verifyG();
		// 2. verify p,q,g
		System.out.println(DSA2Signer.verPQ(pq, new SHA256Digest()));
		// 3. generate key pair
		SecureBigInteger[] keypair = genKeyPair(pq);
		// 4. generate signature
		byte[] m = Hex.decode("e1c7bee77a09017495cdd82d389d67605af36b82d7ae4014e1ac5273573f122e414f38bd19f74b7ca1a28d8b3f2f3cc1a4ba57348084975bb3bf8527a323c00be272f5946462dd429eed484e6181dbacb5fa1fae679b3eeff244deb30cb795d4b4e0f769463f9a822ef419e5d23c34db6c91e5567c7e69d351994e6994e50248");
		SecureBigInteger[] sig = genSignature(pq, keypair[0], m, new SHA256Digest());
		// 5. verify signature
		System.out.println(verSignature(pq, keypair[1], m, sig, new SHA256Digest()));
	*/	
		SecureBigInteger p = new SecureBigInteger("da31be216e0d909e3e0c19d9d0612386820d745c75f34e2e7bf07cd7a070a6057078dea78585301125ad6cc8af9166af270052d60813f23ff9d890946a0dd2a9ad9f272917229b314e8e5d425d637598fe94e7182cc930b704ad6414f7c859a33fe322fb7fce5cffee55abb78b77e2f41bdb07653dbb3080afc984064deab7a5025e3cb6ee365496a2709590bfcf45907067c0f48ee8b7020f83d568aa46b9ea284ffc958a26b2b9a9491aa7f9e31ae062462dd0270f0de88f20744447b642007fdb72fd38b3f42286b3d711251f914141340e384083af1e7a42566b7fa47f9e3eac71695dd74f3db23465f0bb65f4c0354457a284a4ee698df5473bde4ca7bf",16);
		SecureBigInteger q = new SecureBigInteger("fd1a12a30d7b7d55a7984293eecc2a463e2cd81f6a02b8f6742dd40b",16);
		SecureBigInteger g1 = new SecureBigInteger("b711e6d6da2cadc90d70fefc453514bf5d74df9b409bf48279e6faed481013ee1d0fe71a3c02c640056f49f7c45a4d49b395a961f61627beca86a81ebabe8406300a9b231fd9ce171c2ed9285e79e715791d31151cd22d8ebdfe7830d54631d3d9accb9a7849d924e05fea64746f94ef540c144f6447bf4561cbf27fd057e8507a42eef65720baca636676d9a4973bdb5fee6f37d3fc2eed163d909b76e793604648daa5442675a317c2ae6a02d57ffd60fdd157c64226a34f8194daacaa9e07b26d95ac01aa8d0255bbd642ac9003aa10f748a6114257c8c78f743ba1e41036f04c6c6f68db39f8d25d18ccaa47dbc309c2501dcfa2a9837591b14dcf8dea08",16);
		
		System.out.println(new DSA2Param(p,q,g1).verifyG());
	
		SecureBigInteger p2 = new SecureBigInteger("f79201c6a7d2cb55042ae7c0b39716bdae046ca6cf7ceed8f3a367401784391b75ebd7351549e89e4e7893fb26f8584cd550b1fc7115e3896acc3bff6ecfaa89bf90b00908af78f6fab35c79d9357995417222c9f02ae24ce54f89510ea47e890cc91340a74bda9637ef03742bebf83be71a99c4f3cd95216b64665e5ae76cf2858ca14b326814150d2a487ac6519b0780c4ef7b04b34ddf1a0179ca9541f72145aca415744c12bc15fab15b2f78faf79b3fdfd33782886a547e9a3cc65b818d4a1103e7e0217df9a350448c18d75d2a9acb3b4545cb007052bde7e3072d3fa03ce0745c3f724bb82e882742eec350d756a55967a1ad395502006b2f104aec09",16);
		SecureBigInteger q2 = new SecureBigInteger("a7a9f5dda0ab8ac3323bf5a40e75c54ae21f7df87d3a629c07e6196f",16);
		SecureBigInteger g2 = new SecureBigInteger("b3332ddb99005aeb37dfff181ee4cfc0437bc10b33f607e7062c13660e814c4475df3e74b0fbfc67c1662cf8e2a28687af3d87e31373b967e4481d4c7baef14ad3486ad06c111e14242b9bc086ab73587857936a7f2bb3d4bc2ac4407d3846e2c0b7346ce7a7e0ce1dbc36f965a0a2e7680b93d73c7c06116625f220b9d477a58669960694e3d6addd84cabb7fc12f36a68bf7c1adba0359ce7b9dbfa5344ab431c3770a1ec31bb23f861a9e5cef7f0d7982f9678f919a815441c198c4de4ea2a0872c2af7d4ea543b705a73e1d95e1aba1ee9483d3bcd7dd26480e7334fa6d521f9e52ef52866db8f0d932e6b0eab3f71bbf17801d3d1400ce242b7cd7544e3",16);
		
		System.out.println(new DSA2Param(p2,q2,g2).verifyG());

		
/*		SecureBigInteger p = new SecureBigInteger("18257235790675453673037535846993848442567256645011135141311766562193180887323141366480726848292447481121105356160176067377512494158281019874998795060293284074992741628089035272081341433780155967433646382422038248859179975482461524874090822546800092864724687065206934927400607507479139604202401558658625005714196468452959128023992518337016289645706947694881630501076885856227847717693963225379898809566937439935436219027537011300819170144734029368294906544819916719330700927164935743484312187973971224736029112514691993102962701411432556383887534780395741935291643008192420513939744472446393254616359919683671019415757");
		SecureBigInteger q = new SecureBigInteger("82189155490940785088841758697739277765667936850454992199985730077598964109547");
		SecureBigInteger g = new SecureBigInteger("14891675700779995611370683763452995423086563399544936464893901709494968982414296078455254111948229183856625171764288005094831477646277808052725218070149218418098366918595536363536407004451847402040662206746946497852432671095498585898841875755233633457839093152515873551537072346541978561129149938975059055977010090637776941965558122965615827911065810536291504175747435602574092322532181243532095499512602088288450453857187409289743810528072908354663959467128568162010203339113006653255246111935412847344637344211538236062310446980931433991907552866321816717404990300051255376246729613802266576693433348280418010745883");
		SecureBigInteger seed = new SecureBigInteger("38393298583434340115188487689696050296824609704811191245057324975296156267211");
		
		DSA2Param pqg = new DSA2Param(p, q, seed, 1281 );
		pqg.g = g;
		
		//System.out.println(DSA2Signer.verPQ(pqg, new SHA256Digest()));
		
		SecureBigInteger[] keypair = genKeyPair(pqg);
		
		byte[] m = Hex.decode("e1c7bee77a09017495cdd82d389d67605af36b82d7ae4014e1ac5273573f122e414f38bd19f74b7ca1a28d8b3f2f3cc1a4ba57348084975bb3bf8527a323c00be272f5946462dd429eed484e6181dbacb5fa1fae679b3eeff244deb30cb795d4b4e0f769463f9a822ef419e5d23c34db6c91e5567c7e69d351994e6994e50248");
		SecureBigInteger[] sig = genSignature(pqg, keypair[0], m, new SHA256Digest());
		
		System.out.println(verSignature(pqg, keypair[1], m, sig, new SHA256Digest()));
	*/
		/*
		// 验证签名 test vector
		SecureBigInteger P = new SecureBigInteger("86151e9f1b1f26cf33a5add6dda29314edc2c970320a55c128d5f7187a9d8a2667aead558722b5fed7c0b9956a3fcb428223f7e0def54a80ff49a782b3e134ca50cfdf23a6952eebc1ef5adf1a12c8316c3f77ca8c58d05653b519583bc8b3d24c40def19c83cf8afce55dbc7fe1bf0c6999d045eea709fe34b824174b9603f66af4eb1aa9087deccf14824be536ad3fa7262131a46d4950afdfac93faceb101e70dfbea45e99cfa35a163f49da41f66e983d196dd63ad9dd31c9191680402c12a2a7880b96c9c8b6a721e993d76a1f23c1e7b0436e16918d8058b3cb6dd4a55f7b9e0713d786daf70435561de3f8ada6d28fc8a105c55e540bc401408ef06a9", 16);
		SecureBigInteger Q = new SecureBigInteger("8000000000000000433431e2fbbfd3497603ae36a0abd8c298ec21cf", 16);
		SecureBigInteger G = new SecureBigInteger("27d564398e3f079218e4d864d8f593556ee891382d6e1c827aae87ff9265f44dc703f8a82a7ce6a932bda4b38e4e701c7e59f6fd0d9c735d46fc7e6cf0dd45a61f5beb03fe3a17578dca03c067a578e3c543072a6fed135e9746c3f49110c41f754969d110b7f3bf1a863bd9fd27812628dc812ebda0a5ffde5e90df7e32c54786dd2db037f7a4c9ac2b5215db8fd68c642ea712a3a61d41254455579aa656bf2ba1af8336712ae20d633031429f70abf030dd98fb6cd6aaa0fa4566a0f353f37c4324990ab13a006432c1c7ff0bdfcd2c0573f7eeb2e1bd268f8146c8a711272240a138facafc2df170abf7d87b2f89b6033e05383cde89d9f78913c910bdb3", 16);

		byte[] Msg = Hex.decode("359d7c00900ed8fa233c71b0080ef375e207b299b16eaa6c941bf45e578bd324fdbea5182391abf1cbff358bd70c49ab00a4919ddc2f90abed854b268f5639d2c0f8fb448bcaf3ce7bdd0c81ef2458839bd18e3130bc91adb11e7fd833c8a5082a8dbc446ba7aa7345c4664427d41a6b64e147f27338317e40a5971e8797aa0b");
		SecureBigInteger X = new SecureBigInteger("4db2ed5f72fbfffc69b98fe3ba8dabc0a57ac68b7b7d7808071afd38",16);
		SecureBigInteger Y = new SecureBigInteger("2cc539d51a50ddd4d390aa96134a2486e74868b063d529d97d8baa7fc63029c20eb720805c8c3b49a3bdfa5592a9691dd6f67b27a7bd5b12ca4c21d1a75b177a14d793fad31fd6d6568a3735763fa46494a6a31d34ed5ee62e24b485a6d46f404fbaa6a9e68b6c96219ca08f7e6a9a5454857c641d5dae892143566ffc58fcadfd0eb23633d2848393433b663e6c1146b543a36fd8315d0b8baa1dbc4d046e4130cdf6cdfd3c6889a6a6dc303622758539996ea3dfa4d5bd2d30a8e9ae40528e1e0acf44fdff7be6d4ea9539b7f9acab00e79300da88ebf9a765400047fbb6dc46323def0ca527674603dba416d70f7b78a89599dd03b53f9d4a1f56293de5c9",16);
		SecureBigInteger R = new SecureBigInteger("4ecee10d73f048c7f4ae5ca21723a069883a56c952efb98111d6ef26",16);
		SecureBigInteger S = new SecureBigInteger("1ea3ea10b619d6d8ab806956b2dcc68bd80350cf5aeb6b1899759d56",16);
		
		System.out.println(verSignature(new DSA2Param(P,Q,G), Y, Msg, new SecureBigInteger[]{R,S}, new SHA1Digest()));
		*/
		
	}

	public static SecureBigInteger TWO = SecureBigInteger.valueOf(2);
	public static SecureBigInteger ONE = SecureBigInteger.valueOf(1);
	//public static SecureRandom rnd = new SecureRandom();
	public static RandomBitsGenerator rnd = new RandomBitsGenerator();
}
