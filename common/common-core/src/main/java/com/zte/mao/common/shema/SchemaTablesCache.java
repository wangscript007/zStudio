package com.zte.mao.common.shema;

import java.util.HashSet;
import java.util.Set;

public class SchemaTablesCache {
	
	public final static String SCHEMA_GLOBAL = "global";
	public final static String SCHEMA_TENANT = "tenant";

	private Set<String> globals = new HashSet<String>();
	
	private static SchemaTablesCache instance;
	
	public static synchronized SchemaTablesCache getInstance() {
		if(instance == null) {
			instance = new SchemaTablesCache();
		}
		return instance;
	}
	
	public void setData2Global(String[] tables) {
		for(String item: tables) {
			globals.add(item.toLowerCase());
		}
	}
	
	public String getSchemaName(String table) {
		String schema = SCHEMA_TENANT;
		if(globals.contains(table.toLowerCase())) {
			schema = SCHEMA_GLOBAL;
		}
		return schema;
	}
	
}
