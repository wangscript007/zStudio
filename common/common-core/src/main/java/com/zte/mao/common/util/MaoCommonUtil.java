package com.zte.mao.common.util;

import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Set;

import javax.management.AttributeNotFoundException;
import javax.management.InstanceNotFoundException;
import javax.management.MBeanException;
import javax.management.MBeanServer;
import javax.management.MBeanServerFactory;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import javax.management.ReflectionException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.catalina.core.StandardThreadExecutor;
import org.apache.commons.lang3.StringUtils;

import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.shema.SchemaTablesCache;

public class MaoCommonUtil {
	private static final String EXECUTOR_ZSTUDIO="zStudioThreadPool";
	private static final String EXECUTOR_ZSERVER="zServerThreadPool";
	private static final String EXECUTOR_PREFIX_ZSTUDIO="zStudio-exec-";
	private static final String EXECUTOR_PREFIX_ZSERVER="zServer-exec-";
	
	private static HttpRequestUtils httpRequestUtils = new HttpRequestUtils();
   
    public static String parseTableNameFromURL(String requestURI) {
        requestURI = requestURI.substring(requestURI.indexOf("/", 1) + 1,
                requestURI.length());
        String tableName = "";
        if (requestURI.startsWith("orm/table/")) {
            tableName = requestURI.split("/")[2];
        } else if (requestURI.startsWith("orm/tables/")) {
            tableName = requestURI.split("/")[2];
        } else if (requestURI.startsWith("orm/metadata/table/")) {
            tableName = requestURI.split("/")[3];
        }
        if(tableName.indexOf("?") > -1) {
        	return tableName.substring(0, tableName.indexOf("?"));
        }
        return tableName;
    }
    
    public static String getConvertDspUrl(String uri, String tenantId, String queryString, String platformType) {
		String tableName = MaoCommonUtil.parseTableNameFromURL(uri),
				schemaName = SchemaTablesCache.getInstance().getSchemaName(tableName),
				database = "",
				dbPrefix = "";
		String dspNginxURL = httpRequestUtils.getLocalPath();
		//设计平台中，如果传入了其他平台变量则需要改变dbPrefix的值
		if(ConfigManage.getInstance().getPlatformType().equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
			dbPrefix = "d_";
			if(!platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
				dbPrefix = "";
			}
		}
		
		if(schemaName.equals(SchemaTablesCache.SCHEMA_GLOBAL)) {
			database = dbPrefix+SchemaTablesCache.SCHEMA_GLOBAL;
		}
		else {
			database = dbPrefix + "tenant_" + tenantId;
		}
		if(StringUtils.isNotBlank(queryString)) {
			return dspNginxURL + uri + "?" + queryString + "&tenantId=" + tenantId + "&database=" + database;
		}
		else {
			return dspNginxURL + uri + "?tenantId=" + tenantId + "&database=" + database;
		}
	}
    
    public static String getLocalIP() throws MaoCommonException {
        try {
            if (OSCommonUtil.getInstanse().isWindows()) {
                return InetAddress.getLocalHost().getHostAddress();
            }
            for (Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces(); interfaces.hasMoreElements();) {
                NetworkInterface networkInterface = interfaces.nextElement();
                if (networkInterface.isLoopback() || networkInterface.isVirtual() || !networkInterface.isUp()) {
                    continue;
                }
                Enumeration<InetAddress> addresses = networkInterface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress address = addresses.nextElement();
                    if (address instanceof Inet6Address) {
                        continue;
                    }
                    return address.getHostAddress();
                }
            }
        } catch (UnknownHostException e) {
            throw new MaoCommonException(e);
        } catch (SocketException e) {
            throw new MaoCommonException(e);
        }
        return "";
    }
    
	public static int getLocalPort() throws MaoCommonException {
		if (httpPort == null) {
			int port = getPortByMBean();
			if (port > 0) {
				httpPort = port;
			}
		}
		if (httpPort != null) {
			return httpPort;
		} else {
			throw new MaoCommonException("Unknown port");
		}
	}

	private static int getPortByMBean() throws MaoCommonException {
		int port = -1;
		ArrayList<MBeanServer> mBeanServers = MBeanServerFactory.findMBeanServer(null);
		if (mBeanServers.size() > 0) {
			MBeanServer mBeanServer = mBeanServers.get(0);
			Set<ObjectName> objectNames = null;
			try {
				objectNames = mBeanServer.queryNames(new ObjectName("Catalina:type=Connector,*"), null);
			} catch (MalformedObjectNameException e) {
				throw new MaoCommonException(e);
			} catch (NullPointerException e) {
				throw new MaoCommonException(e);
			}
			if (objectNames == null || objectNames.size() <= 0) {
				throw new MaoCommonException("没有发现JVM中关联的MBeanServer : " + mBeanServer.getDefaultDomain() + " 中的对象名称.");
			}
            try {
                for (ObjectName objectName : objectNames) {
                    String protocol = (String) mBeanServer.getAttribute(objectName, "protocol");
                    if (protocol.equals("HTTP/1.1") == false) {
                        continue;
                    }
                    Object executorObject = mBeanServer.getAttribute(objectName, "executor");
                    if (executorObject instanceof StandardThreadExecutor == false) {
                        continue;
                    }

                    String threadName = Thread.currentThread().getName();
                    String executorName = ((StandardThreadExecutor) executorObject).getName();
                    if (threadName.startsWith(EXECUTOR_PREFIX_ZSTUDIO)) {
                        if (EXECUTOR_ZSTUDIO.equals(executorName)) {
                            port = (Integer) mBeanServer.getAttribute(objectName, "port");
                        }
                    } else {
                        if (EXECUTOR_ZSERVER.equals(executorName)) {
                            port = (Integer) mBeanServer.getAttribute(objectName, "port");
                        }
                    }
                
                
                }
			} catch (AttributeNotFoundException e) {
				throw new MaoCommonException(e);
			} catch (InstanceNotFoundException e) {
				throw new MaoCommonException(e);
			} catch (MBeanException e) {
				throw new MaoCommonException(e);
			} catch (ReflectionException e) {
				throw new MaoCommonException(e);
			}
		} else {
			throw new MaoCommonException("没有发现JVM中关联的MBeanServer.");
		}
		return port;
	}
	
	public static String getCookie(HttpServletRequest request, String cookieName) {
		String token = "";
		if(request.getCookies() != null) {
			for(Cookie item : request.getCookies()) {
				if(item.getName().equals(cookieName)) {
					token = item.getValue();
					break;
				}
			}
		}
		return token;
	}
	private static Integer httpPort = null;
}
