package com.zte.mao.common.cipher.impl.util.encoder;

import java.io.UnsupportedEncodingException;


public class CharsetUtils {

	/**
	 * 检查明文中是否含有拉丁文
	 * 
	 * @param clearText
	 *            明文形式的字符串
	 * @author 何敬
	 * @return
	 */
	public static boolean hasLatin(String clearText) {
		for (int i = 0; i < clearText.length(); i++) {
			char s = clearText.charAt(i);
			if ((Integer.valueOf("00C0", 16).intValue() <= s && s <= Integer
					.valueOf("02AF", 16).intValue())
					|| (Integer.valueOf("1E00", 16).intValue() <= s && s <= Integer
							.valueOf("1EFF", 16).intValue())
					|| (Integer.valueOf("2C60", 16).intValue() <= s && s <= Integer
							.valueOf("2C7F", 16).intValue())
					|| (Integer.valueOf("A720", 16).intValue() <= s && s <= Integer
							.valueOf("A7FF", 16).intValue())
					|| (Integer.valueOf("FB00", 16).intValue() <= s && s <= Integer
							.valueOf("FB4F", 16).intValue())
					|| (Integer.valueOf("FF00", 16).intValue() <= s && s <= Integer
							.valueOf("FFEF", 16).intValue())) {
				// System.out.println(i);
				return true;
			}
		}
		return false;
	}

	/**
	 * 判断字节流是否是utf-8编码，且含有拉丁文
	 * 
	 * @param data
	 * @return
	 */
	public static boolean hasLatin_UTF8(byte[] data) {
		if (data != null) {
			try {
				if ((utf8_probability(data) != 0)
						&& (hasLatin(new String(data, "utf-8")))) {
					return true;
				}
			} catch (UnsupportedEncodingException ue) {
				// do nothing !
			}
		}
		return false;
	}

	/**
	 * for test only
	 */
	public static void main(String[] args) throws Exception {
		System.out.println(hasLatin("ā"));

		byte[] x = new java.math.BigInteger("6C49", 16).toByteArray();
		System.out.println(new String(x, "utf-16"));

	}

	/*
	 * Function: utf8_probability Argument: byte array Returns : number from 0
	 * to 100 representing probability text in array uses UTF-8 encoding of
	 * Unicode
	 */
	public static int utf8_probability(byte[] rawtext) {
		int score = 0;
		int i, rawtextlen = 0;
		int goodbytes = 0, asciibytes = 0;

		// Maybe also use UTF8 Byte Order Mark: EF BB BF

		// Check to see if characters fit into acceptable ranges
		rawtextlen = rawtext.length;
		for (i = 0; i < rawtextlen; i++) {
			if ((rawtext[i] & (byte) 0x7F) == rawtext[i]) { // One byte
				asciibytes++;
				// Ignore ASCII, can throw off count
			} else if (-64 <= rawtext[i] && rawtext[i] <= -33
					&& // Two bytes
					i + 1 < rawtextlen && -128 <= rawtext[i + 1]
					&& rawtext[i + 1] <= -65) {
				goodbytes += 2;
				i++;
			} else if (-32 <= rawtext[i]
					&& rawtext[i] <= -17
					&& // Three bytes
					i + 2 < rawtextlen && -128 <= rawtext[i + 1]
					&& rawtext[i + 1] <= -65 && -128 <= rawtext[i + 2]
					&& rawtext[i + 2] <= -65) {
				goodbytes += 3;
				i += 2;
			}
		}

		if (asciibytes == rawtextlen) {
			return 0;
		}

		score = (int) (100 * ((float) goodbytes / (float) (rawtextlen - asciibytes)));
		// System.out.println("rawtextlen " + rawtextlen + " goodbytes " +
		// goodbytes + " asciibytes " + asciibytes + " score " + score);

		// If not above 98, reduce to zero to prevent coincidental matches
		// Allows for some (few) bad formed sequences
		if (score > 98) {
			return score;
		} else if (score > 95 && goodbytes > 30) {
			return score;
		} else {
			return 0;
		}

	}
}