package com.zte.iui.layoutit.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.log4j.Logger;

import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.msb.MSBDataSourceAdapter;

public class HttpUtils {
	private static Logger logger = Logger.getLogger(HttpUtils.class.getName());
	private static final String charset = "utf-8";
	/**
	 * 发送http get 请求
	 * @param urlPath
	 * @return
	 * @throws IOException
	 */
	public String sendGetRequest(String urlPath) throws IOException {
		URL url = new URL(urlPath);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.connect();
		InputStream inputStream = connection.getInputStream();
		// 对应的字符编码转换
		Reader reader = new InputStreamReader(inputStream, charset);
		BufferedReader bufferedReader = new BufferedReader(reader);
		String str = null;
		StringBuffer sb = new StringBuffer();
		while ((str = bufferedReader.readLine()) != null) {
			sb.append(str);
		}
		reader.close();
		connection.disconnect();
		return sb.toString();
	}

	public static void main(String[] args) throws IOException {
		SourceInfo source = new SourceInfo();
		source.setDisplayName("microservices");
		source.setIp("10.74.216.90");
		source.setPort("10080");
		source.setSourceName("microservices");
		source.setUriPrefix("apijson/microservices/v1");
		
		MSBDataSourceAdapter adapter = new MSBDataSourceAdapter();
		String contents = adapter.getDataSourceJson(source);		
		
//		//String fileDir = ContextLoader.getCurrentWebApplicationContext()
//				.getServletContext().getRealPath("/")
//				+ File.separator + "json-extension/datasource/";
		
		String fileDir = "d:/"+  "json-extension/datasource/";
		
		FileOperation file = new FileOperation(fileDir,"microservices.json");
		try {
			file.writeTxtFile(contents);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
}
