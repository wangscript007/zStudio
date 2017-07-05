package com.zte.mao.common.process;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.util.MaoCommonUtil;
import org.apache.log4j.Logger;

public class ProcessResBean {
    public static final String PROCESS_MODULE_DB = "DB";
    public static final String PROCESS_MODULE_COS = "COS";

    public static final int CAPACITY_MAX = 1000;
    
//    public static final String PORT_DEFAULT = "8080";
    
    public static final int STATUS_FULL = 1;
    public static final int STATUS_ALLOCABLE = 2;
    public static final int STATUS_DISABLED = 3;

    private int id;
    private String name;
    private String module;
    private String ip;
    private String port = null;
    private int capacity = CAPACITY_MAX;
    private int usedCapacity = 0;
    private int status = STATUS_ALLOCABLE;
    private static Logger logger = Logger.getLogger(ProcessResBean.class.getName());
    
    public String getName() {
        return name;
    }

    public ProcessResBean setName(String name) {
        this.name = name;
        return this;
    }

    public String getModule() {
        return module;
    }

    public ProcessResBean setModule(String module) {
        this.module = module;
        return this;
    }

    public String getIp() {
        return ip;
    }

    public ProcessResBean setIp(String ip) {
        this.ip = ip;
        return this;
    }

	public String getPort() {
		if (port == null) {
			int tempPort = -1;
			try {
				tempPort = MaoCommonUtil.getLocalPort();
			} catch (MaoCommonException e) {
				logger.error(e.getMessage(), e);
			}
			if (tempPort > 0) {
				port = String.valueOf(tempPort);
			}
		}
		return port;
	}

    public ProcessResBean setPort(String port) {
        this.port = port;
        return this;
    }

    public int getCapacity() {
        return capacity;
    }

    public ProcessResBean setCapacity(int capacity) {
        this.capacity = capacity;
        return this;
    }

    public int getUsedCapacity() {
        return usedCapacity;
    }

    public ProcessResBean setUsedCapacity(int usedCapacity) {
        this.usedCapacity = usedCapacity;
        return this;
    }

    public int getStatus() {
        return this.status;
    }

    public ProcessResBean setStatus(int status) {
        this.status = status;
        return this;
    }

    public int getId() {
        return id;
    }

    public ProcessResBean setId(int id) {
        this.id = id;
        return this;
    }

    public String getKeyString() {
        return this.module + this.ip + this.port;
    }
}
