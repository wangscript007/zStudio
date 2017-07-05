package com.zte.mao.workbench.service;

import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class FormLockService {
	private static Logger logger = Logger.getLogger(FormLockService.class.getName());
	
	private static final long LOCK_TIMEOUT_MS = 10 * 60 * 1000;
	private static final long LOCK_MONITER_INTERVAL_MS = 1 * 60 * 1000;
	
	private ConcurrentHashMap<String, LockInfo> url2Timestamp = new ConcurrentHashMap<String, LockInfo>();
	
	private ScheduledExecutorService clearLockJob;
	
	public FormLockService() {
		clearLockJob = Executors.newSingleThreadScheduledExecutor();
		clearLockJob.scheduleAtFixedRate(new LockMonitor(this), 0, LOCK_MONITER_INTERVAL_MS, TimeUnit.MILLISECONDS);
	}
	
	public boolean requireFormLock(String formUrl, String loginName, String token, String tenantId) {
		String urlId = getUrlId(formUrl, tenantId);
		LockInfo lockInfo = url2Timestamp.putIfAbsent(urlId, new LockInfo(loginName, token, System.currentTimeMillis()));
		return lockInfo == null || updateTimestamp(formUrl, loginName, token, tenantId);
	}
	
	public boolean releaseFormLock(String formUrl, String loginName, String token, String tenantId) {
		String urlId = getUrlId(formUrl, tenantId);
		
		LockInfo lockInfo = url2Timestamp.get(urlId);
		if (lockInfo == null) {
			return true;
		}
		
		if (lockInfo.getUsername().equals(loginName) && lockInfo.getToken().equals(token)) {
			url2Timestamp.remove(urlId);
			return true;
		} else {
			return false;
		}
	}
	
	public boolean updateTimestamp(String formUrl, String loginName, String token, String tenantId) {
		String urlId = getUrlId(formUrl, tenantId);
		
		LockInfo lockInfo = url2Timestamp.get(urlId);
		if (lockInfo == null) {
			return false;
		}
		
		if (lockInfo.getUsername().equals(loginName) && lockInfo.getToken().equals(token)) {
			lockInfo.setTimestamp(System.currentTimeMillis());
			return true;
		} else {
			return false;
		}
	}
	
	private void clearTimeoutLocks() {
		logger.info("begin checking lock timeout..");
		
		final long checkpoint = System.currentTimeMillis();
		Iterator<String> keyIt = url2Timestamp.keySet().iterator();
		while (keyIt.hasNext()) {
			String urlId = keyIt.next();
			LockInfo lockInfo = url2Timestamp.get(urlId);
			
			if (lockInfo == null) {
				continue;
			}
			
			if (checkpoint - lockInfo.getTimestamp() >= LOCK_TIMEOUT_MS) {
				logger.info("remove lock -> " + urlId + ", " + lockInfo.getUsername() + ", " + lockInfo.getToken());
				keyIt.remove();
			}
		}
	}
	
	private String getUrlId(String formUrl, String tenantId) {
		return tenantId + "_" + formUrl;
	}
	
	private static class LockMonitor implements Runnable {
		private FormLockService formService;
		
		public LockMonitor(FormLockService formService) {
			this.formService = formService;
		}
		
		@Override
		public void run() {
			formService.clearTimeoutLocks();
		}
	}
	
	private static class LockInfo {
		private String username;
		private String token;
		private long timestamp;
		
		public LockInfo(String username, String token, long timestamp) {
			super();
			this.username = username;
			this.token = token;
			this.timestamp = timestamp;
		}

		public String getUsername() {
			return username;
		}

		public long getTimestamp() {
			return timestamp;
		}

		public void setTimestamp(long timestamp) {
			this.timestamp = timestamp;
		}
		
		public String getToken() {
			return token;
		}

		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + ((token == null) ? 0 : token.hashCode());
			result = prime * result + ((username == null) ? 0 : username.hashCode());
			return result;
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			LockInfo other = (LockInfo) obj;
			if (token == null) {
				if (other.token != null)
					return false;
			} else if (!token.equals(other.token))
				return false;
			if (username == null) {
				if (other.username != null)
					return false;
			} else if (!username.equals(other.username))
				return false;
			return true;
		}
	}
}
