package com.zte.mao.common.cipher.impl.util;

public class Logger {
	
	public static boolean debugMode = true;
	
	public static void info(Object msg){
		if (debugMode){
			System.out.println(msg);
		}
	}
		
	public static void err(Object msg){
		System.out.println(msg);
	}
}
