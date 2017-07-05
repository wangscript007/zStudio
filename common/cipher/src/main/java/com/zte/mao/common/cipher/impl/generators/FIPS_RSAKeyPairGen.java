package com.zte.mao.common.cipher.impl.generators;

import java.security.SecureRandom;

import com.zte.mao.common.cipher.impl.consts.CryptoModes.RSA_Mod;
import com.zte.mao.common.cipher.impl.params.FIPS_RSAKeyPair;
import com.zte.mao.common.cipher.impl.params.RSAKeyParameters;
import com.zte.mao.common.cipher.impl.params.RSAPrivateCrtKeyParameters;
import com.zte.mao.common.cipher.impl.util.SecureBigInteger;


public class FIPS_RSAKeyPairGen {
	
	static SecureRandom RND = new SecureRandom();
	public static SecureBigInteger E = SecureBigInteger.valueOf(3);
	

	
	/**
	 * determine if a is mutually prime with e. 
	 * @param a
	 * @param e
	 * @return 
	 */
	private static boolean isCoPrime(SecureBigInteger a, SecureBigInteger e){
		return a.gcd(e).equals(SecureBigInteger.ONE);
	}
	/**
	 * Find the first prime greater than xpq, and it must mutually prime with e
	 * @param xpq
	 * @param e
	 * @return
	 */
	private static SecureBigInteger computePrimeFactor(SecureBigInteger xpq, SecureBigInteger e){
		SecureBigInteger result = xpq.nextProbablePrime();

		while (true){
			if (isCoPrime(result, e) && result.passesMillerRabin(27, RND)){
				return result;
			}else{
				result = result.nextProbablePrime();
			}
		}
	}
	
	public static FIPS_RSAKeyPair generateKeyPair(RSA_Mod mod) {
		// 1. compute Xp1, Xp2, Xp, Xq1, Xq2, Xq
		
		// xp1, xp2, xq1, xq2 are in range: [2**100, (2**101) -1]
		SecureBigInteger Xp1 = SecureBigInteger.createRandomInRange(xp1LowBound, xp1HighBound, RND);
		SecureBigInteger Xp2 = SecureBigInteger.createRandomInRange(xp1LowBound, xp1HighBound, RND);
		SecureBigInteger Xq1 = SecureBigInteger.createRandomInRange(xp1LowBound, xp1HighBound, RND);
		SecureBigInteger Xq2 = SecureBigInteger.createRandomInRange(xp1LowBound, xp1HighBound, RND);
		SecureBigInteger Xp = null;
		SecureBigInteger Xq = null;
		// Xp, Xq are in range: [ sqrt(2) * 2**(511+128s), 2**(512+128s) - 1 ]
		if (mod == RSA_Mod.mod1536){
			Xp = SecureBigInteger.createRandomInRange(Xp1536L, Xp1536H, RND);
			Xq = SecureBigInteger.createRandomInRange(Xp1536L, Xp1536H, RND);
		}else if (mod == RSA_Mod.mod2048){
			Xp = SecureBigInteger.createRandomInRange(Xp2048L, Xp2048H, RND);
			Xq = SecureBigInteger.createRandomInRange(Xp2048L, Xp2048H, RND);
		}else if (mod ==  RSA_Mod.mod3072){
			Xp = SecureBigInteger.createRandomInRange(Xp3072L, Xp3072H, RND);
			Xq = SecureBigInteger.createRandomInRange(Xp3072L, Xp3072H, RND);
		}else {
			Xp = SecureBigInteger.createRandomInRange(Xp4096L, Xp4096H, RND);
			Xq = SecureBigInteger.createRandomInRange(Xp4096L, Xp4096H, RND);
		}
		return generate(Xp1, Xp2, Xp, Xq1, Xq2, Xq);
	}
	
	/**
	 * generate rsa key pair according to ANSI X9.31
	 * @param Xp1
	 * @param Xp2
	 * @param Xp
	 * @param Xq1
	 * @param Xq2
	 * @param Xq
	 * @return
	 */
	public static FIPS_RSAKeyPair generate(SecureBigInteger Xp1, 
			SecureBigInteger Xp2,
			SecureBigInteger Xp,
			SecureBigInteger Xq1,
			SecureBigInteger Xq2,
			SecureBigInteger Xq ){
		FIPS_RSAKeyPair kp = null;
		// 1. generate the large prime factors p1, p2, q1, and q2. 
		SecureBigInteger p1 =  computePrimeFactor(Xp1, E);
		SecureBigInteger p2 =  computePrimeFactor(Xp2, E);
		SecureBigInteger q1 =  computePrimeFactor(Xq1, E);
		SecureBigInteger q2 =  computePrimeFactor(Xq2, E);
		// 2. generate the private prime factor p
		SecureBigInteger p = computePrivatePrime(Xp, p1, p2);
		
		//System.out.println("p=" + p.toString(16));
		// 3. generate the private prime factor q
		SecureBigInteger q = computePrivatePrime(Xq, q1, q2);
		//System.out.println("q=" + q.toString(16));
		// compute n
		SecureBigInteger n = p.multiply(q);
		// compute d
		SecureBigInteger pSub1 = p.subtract(SecureBigInteger.ONE);
		SecureBigInteger qSub1 = q.subtract(SecureBigInteger.ONE);
		SecureBigInteger d = E.modInverse(pSub1.multiply(qSub1).divide(pSub1.gcd(qSub1)));
		
        SecureBigInteger dP = d.remainder(pSub1);
        SecureBigInteger dQ = d.remainder(qSub1);
        SecureBigInteger qInv = q.modInverse(p);
		
        return new FIPS_RSAKeyPair(
                new RSAKeyParameters(false, n, E),
                new RSAPrivateCrtKeyParameters(n, E, d, p, q, dP, dQ, qInv));
	}
	
	private static SecureBigInteger computePrivatePrime(SecureBigInteger Xp,
			SecureBigInteger p1, SecureBigInteger p2) {
		// 1. compute Rp
		SecureBigInteger p1p2 = p1.multiply(p2);
		SecureBigInteger tmp1 = p2.modInverse(p1).multiply(p2);
		SecureBigInteger tmp2 = p1.modInverse(p2).multiply(p1);
		SecureBigInteger Rp = tmp1.subtract(tmp2); 
		
		while (Rp.compareTo(SecureBigInteger.ZERO)<0){
			Rp = Rp.add(p1p2);
		}
		// 2. compute Y0
		SecureBigInteger Y0 = Xp.add(Rp.subtract(Xp.mod(p1p2)));
		while (Y0.compareTo(Xp) < 0){
			Y0 = Y0.add(p1p2);
		}
		// 3. compute Yj, find p.
		SecureBigInteger p = Y0;
		int j=1;
		while (true){
			SecureBigInteger Yj = SecureBigInteger.valueOf(j).multiply(p1p2).add(Y0);
			SecureBigInteger YjSub1 = Yj.subtract(SecureBigInteger.ONE); 
			
			if (isCoPrime(YjSub1, E)){
				if (Yj.passesLucasLehmer() && Yj.passesMillerRabin(8, RND)){
					p = Yj;
					break;
				}
			}
			j++;
		}
		return p;
	}

	/**
	 * pre-compute Xp1, xp2, xq1, xq2 value range
	 */
	static final SecureBigInteger xp1LowBound = SecureBigInteger.valueOf(2).pow(100);
	static final SecureBigInteger xp1HighBound = SecureBigInteger.valueOf(2).pow(101).subtract(SecureBigInteger.ONE);
	
	static final SecureBigInteger Xp1536L=new SecureBigInteger("1097630291256601217150328498342989306566618414101504504075309790884418023549268458635931035041853059910994825602871668756763307091189173774751111103454115065417549668046740883224037556941540100491460940429957543406881242725647952520");
	static final SecureBigInteger Xp1536H=new SecureBigInteger("1552518092300708935148979488462502555256886017116696611139052038026050952686376886330878408828646477950487730697131073206171580044114814391444287275041181139204454976020849905550265285631598444825262999193716468750892846853816057855");
	static final SecureBigInteger Xp2048L=new SecureBigInteger("127096904634765734676461876988784048666790972411221074692315067378517001794489180934824893466942127966931920513069075103864764366551792552102443133462108205935081900651379898090345669258080988542453329647124099078568572532416121257202056569152364856674488811054002512855642702878505159427518596925044326464760");
	static final SecureBigInteger Xp2048H=new SecureBigInteger("179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137215");
	static final SecureBigInteger Xp3072L=new SecureBigInteger("1704090885833170040126142440462018077828849926297602088611290252619136975855404862873043112043893657112058277760587819385018728804008035535753516382438777678578835830942809033912942929087800820271529798998133188780721323521538551570389200695324352131253455658429006579084037662184103521887138473925224610351850861160219665503739342032174870224206969768610587002556428844417989168245331150110045476253858177916623936394385121505855771230351671721707902365559896780");
	static final SecureBigInteger Xp3072H=new SecureBigInteger("2410312426921032588580116606028314112912093247945688951359675039065257391591803200669085024107346049663448766280888004787862416978794958324969612987890774651455213339381625224770782077917681499676845543137387820057597345857904599109461387122099507964997815641342300677629473355281617428411794163967785870370368969109221591943054232011562758450080579587850900993714892283476646631181515063804873375182260506246992837898705971012525843324401232986857004760339316735");
	static final SecureBigInteger Xp4096L=new SecureBigInteger("22848123292416882161605417818889656036033980587488847210716154217259931183179598861490421397946699818827923598371781899782342528319397081214227323737218936166286030298681804236867389809525484039504812750337535770771692098580332167606419532697302652522701223617389667665321516155319533526685539546180618782563993433706495518091424277174101150632863316456975709695061008601147035518244881442104232825154973221525242127828952533151822034264677263654413414212555934072477577859090549888275686070920940445693062729604524285440077520068725570037218376292637332196229326709751293330484240164373701168772843988503019134534938");
	static final SecureBigInteger Xp4096H=new SecureBigInteger("32317006071311007300714876688669951960444102669715484032130345427524655138867890893197201411522913463688717960921898019494119559150490921095088152386448283120630877367300996091750197750389652106796057638384067568276792218642619756161838094338476170470581645852036305042887575891541065808607552399123930385521914333389668342420684974786564569494856176035326322058077805659331026192708460314150258592864177116725943603718461857357598351152301645904403697613233287231227125684710820209725157101726931323469678542580656697935045997268352998638215525166389437335543602135433229604645318478604952148193555853611059596230655");

	
	
}
