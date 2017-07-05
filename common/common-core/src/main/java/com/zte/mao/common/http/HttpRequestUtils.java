package com.zte.mao.common.http;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.util.MaoCommonUtil;

@Service
public class HttpRequestUtils {
	private static Logger logger = Logger.getLogger(HttpRequestUtils.class.getName());
	public static final String charset = "utf-8";
	private Integer connectTimeout = 20000;
	private Integer socketTimeout = 20000;
	public static final String BOUNDARYSTR = "7deployprocess2317gs7816510d1hq";
	public static final String BOUNDARY = "--" + BOUNDARYSTR + "\r\n";

	private ConfigManage configManage = ConfigManage.getInstance();
	/**
	 * 获取request中的body参数内容
	 * 
	 * @param request
	 * @return body参数字符串
	 */
	public static String getRequestBodyString(ServletRequest request) throws Exception {
		StringBuilder sb = new StringBuilder();
		InputStream inputStream = null;
		BufferedReader reader = null;
		try {
			inputStream = request.getInputStream();
			reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName(charset)));
			String line = "";
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				}
			}
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				}
			}
		}
		return sb.toString();
	}

	/**
	 * 拼接本机ip和端口的url
	 * 
	 * @return
	 * @throws Exception
	 */
	public String getLocalPath() {
		String path = "";
		try {
			path = "http://" + MaoCommonUtil.getLocalIP() + ":" + MaoCommonUtil.getLocalPort();
		}
		catch(Exception e) {
			logger.error(e.getMessage(), e);
			path = "http://127.0.0.1:8080";
		}
		return path;
	}
	
	public String getPlatformType() {
		return configManage.getPlatformType();
	}

	public String sendGetRequest(String urlString) throws IOException {
		URL url = new URL(urlString);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setRequestMethod("GET");
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestProperty("Content-Type", "application/x-javascript; charset=UTF-8");

		connection.connect();
		// 读取响应
		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), charset));
		String lines;
		StringBuffer sb = new StringBuffer("");
		while ((lines = reader.readLine()) != null) {
			sb.append(lines);
		}
		reader.close();
		// 断开连接
		connection.disconnect();
		return sb.toString();
	}

	/**
	 * Do GET request
	 * 
	 * @param url
	 *            url中包含所有参数
	 * @return Get result
	 * @throws Exception
	 */
	public String doGet(String url) throws Exception {
		HttpURLConnection connection = getConnection(url);
		setAttribute(connection, null, "GET");
		connection.connect();
		return processResult(connection);
	}

	public void doGetImage(String url, HttpServletResponse response) throws IOException {
		HttpURLConnection connection;
		OutputStream outputStream = null;
		OutputStreamWriter outputStreamWriter = null;
		InputStream inputStream = null;
		try {
			outputStream = response.getOutputStream();
			connection = getConnection(url);
			connection.setDoOutput(true);
			setAttribute(connection, null, "GET");
			connection.connect();
			inputStream = connection.getInputStream();
			//
			ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
			byte[] buff = new byte[8192]; // 8K buff用于存放循环读取的临时数据
			int rc = 0;
			while ((rc = inputStream.read(buff, 0, 8192)) > 0) {
				swapStream.write(buff, 0, rc);
			}
			outputStream.write(swapStream.toByteArray());
			outputStream.flush();
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (outputStreamWriter != null) {
				outputStreamWriter.close();
			}
			if (outputStream != null) {
				outputStream.close();
			}

			if (inputStream != null) {
				inputStream.close();
			}
		}

	}

	/**
	 * Do DELETE request
	 * 
	 * @param url
	 *            url中包含所有参数
	 * @return Get result
	 * @throws Exception
	 */
	public String doDelete(String url) throws Exception {
		HttpURLConnection connection = getConnection(url);
		setAttribute(connection, null, "DELETE");
		connection.connect();
		return processResult(connection);
	}

	/**
	 * Do GET request
	 * 
	 * @param url
	 *            url中包含所有参赛
	 * @param tenantId
	 *            租户id，跨进程调用时必须传入该值
	 * @return
	 * @throws Exception
	 */
	public String doGet(String url, String tenantId) throws Exception {
		HttpURLConnection connection = getConnection(url);
		setAttribute(connection, tenantId, "GET");
		connection.connect();
		return processResult(connection);
	}

	private void setAttribute(HttpURLConnection connection, String tenantId, String method) throws ProtocolException {
		connection.setRequestProperty("Accept-Charset", charset);
		connection.setRequestProperty("Content-Type", "application/json");
		if (StringUtils.isNotBlank(tenantId)) {
			connection.setRequestProperty("tenantId", tenantId);
		}
		connection.setRequestMethod(method);
	}

	private HttpURLConnection getConnection(String url) throws IOException {
		int indexOf = url.indexOf('?');
		if (indexOf > -1) {
			String param = url.substring(indexOf + 1);
			param = param.replaceAll(" ", "%20");
			param = param.replaceAll("\\+", "%2B");
			url = url.substring(0, indexOf + 1) + param;
		}
		URL localURL = new URL(url);
		URLConnection connection = openConnection(localURL);
		HttpURLConnection httpURLConnection = (HttpURLConnection) connection;
		return httpURLConnection;
	}

	private String processResult(HttpURLConnection httpURLConnection) throws IOException, Exception {
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader reader = null;
		StringBuffer resultBuffer = new StringBuffer();
		String tempLine = null;

		if (httpURLConnection.getResponseCode() >= 300) {
			throw new Exception("HTTP Request is not success, Response code is " + httpURLConnection.getResponseCode()
					+ " url:" + httpURLConnection.getURL().toString());
		}
		try {
			inputStream = httpURLConnection.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, Charset.forName(charset));
			reader = new BufferedReader(inputStreamReader);
			while ((tempLine = reader.readLine()) != null) {
				resultBuffer.append(tempLine);
			}
		} finally {
			if (reader != null) {
				reader.close();
			}
			if (inputStreamReader != null) {
				inputStreamReader.close();
			}
			if (inputStream != null) {
				inputStream.close();
			}
		}
		return resultBuffer.toString();
	}

	/**
	 * Do POST request
	 * 
	 * @param url
	 * @param jsonParam
	 *            必须是json格式的文本参数
	 * @return post Result
	 * @throws Exception
	 */
	public String doPost(String url, String jsonParam) throws Exception {
		return sendRequest(url, jsonParam, null, "POST");
	}

	/**
	 * Do POST request ： body中有files
	 * 
	 * @param url
	 * @param jsonParam
	 * @param files
	 * @return
	 * @throws Exception
	 */
	public String doPostMultiFile(String url, String jsonParam, MultipartFile[] files, String tenantId)
			throws Exception {
		return sendRequest(url, jsonParam, files, tenantId, "POST");
	}

	/**
	 * Do POST request ： body中有files
	 * 
	 * @param url
	 * @param jsonParam
	 * @param files
	 * @return
	 * @throws IOException
	 * @throws MalformedURLException
	 * @throws Exception
	 */
	
	public String doPostFile(String url, String jsonParam, String fileName, InputStream stream, String tenantId)
			throws IOException {
		return sendRequest(url, jsonParam, fileName, stream, tenantId, "POST",false);
	}
	
	public String doPostFile(String url, String jsonParam, String fileName, InputStream stream, String tenantId,boolean iszip)
			throws IOException {
		return sendRequest(url, jsonParam, fileName, stream, tenantId, "POST",iszip);
	}

	/**
	 * Do POST request
	 * 
	 * @param url
	 * @param jsonParam
	 *            必须是json格式的文本参数
	 * @return post Result
	 * @throws Exception
	 */
	public String doPut(String url, String jsonParam) throws Exception {
		return doPut(url, jsonParam, null);
	}

    public String doPut(String url, String jsonParam, String tenantId) throws Exception {
        return sendRequest(url, jsonParam, tenantId, "PUT");
    }

	/**
	 * Do POST request
	 * 
	 * @param url
	 * @param jsonParam
	 *            必须是json格式的文本参数
	 * @return post Result
	 * @throws Exception
	 */
	public String doPost(String url, String jsonParam, String tenantId) throws Exception {
		return sendRequest(url, jsonParam, tenantId, "POST");
	}

	/**
	 * 删除数据
	 * 
	 * @param url
	 * @param jsonParam
	 * @return
	 * @throws Exception
	 */
	public String doDelete(String urlString, String jsonParam) throws Exception {
		URL url = new URL(urlString);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setRequestMethod("DELETE");
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestProperty("Content-Type", "application/x-javascript; charset=UTF-8");

		connection.connect();
		// 读取响应
		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		String lines;
		StringBuffer sb = new StringBuffer("");
		while ((lines = reader.readLine()) != null) {
			lines = new String(lines.getBytes(), "utf-8");
			sb.append(lines);
		}
		reader.close();
		// 断开连接
		connection.disconnect();
		return sb.toString();
	}

	/**
	 * 发送请求
	 * 
	 * @param url
	 * @param jsonParam
	 * @param method
	 * @return
	 * @throws Exception
	 */

	private String sendRequest(String url, String jsonParam, String tenantId, String method) throws Exception {
		HttpURLConnection httpURLConnection = getConnection(url);

		httpURLConnection.setDoOutput(true);
		setAttribute(httpURLConnection, tenantId, method);
		httpURLConnection.setRequestProperty("Content-Length", String.valueOf(jsonParam.length()));

		OutputStream outputStream = null;
		OutputStreamWriter outputStreamWriter = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader reader = null;
		StringBuffer resultBuffer = new StringBuffer();
		String tempLine = null;

		try {
			outputStream = httpURLConnection.getOutputStream();
			outputStreamWriter = new OutputStreamWriter(outputStream, charset);

			outputStreamWriter.write(jsonParam.toString());
			outputStreamWriter.flush();

			if (httpURLConnection.getResponseCode() >= 300) {
				throw new Exception("HTTP Request is not success, Response code is "
						+ httpURLConnection.getResponseCode() + "\nURL:\t" + url + "\njsonParam:\t" + jsonParam);
			}

			inputStream = httpURLConnection.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			reader = new BufferedReader(inputStreamReader);

			while ((tempLine = reader.readLine()) != null) {
				resultBuffer.append(tempLine);
			}

		} finally {

			if (outputStreamWriter != null) {
				outputStreamWriter.close();
			}
			if (outputStream != null) {
				outputStream.close();
			}
			if (reader != null) {
				reader.close();
			}
			if (inputStreamReader != null) {
				inputStreamReader.close();
			}
			if (inputStream != null) {
				inputStream.close();
			}
		}
		return resultBuffer.toString();
	}

	/**
	 * 发送请求
	 * 
	 * @param url
	 * @param jsonParam
	 * @param method
	 * @return
	 * @throws Exception
	 */

	private String sendRequest(String url, String jsonParam, MultipartFile[] files, String tenantId, String method)
			throws Exception {
		HttpURLConnection httpURLConnection = getConnection(url);

		httpURLConnection.setDoOutput(true);
		setAttribute(httpURLConnection, tenantId, method);
		httpURLConnection.setRequestProperty("Content-Length", String.valueOf(jsonParam.length()));
		httpURLConnection.setRequestProperty("Content-type", "multipart/form-data;boundary=" + BOUNDARYSTR);
		OutputStream outputStream = null;
		OutputStreamWriter outputStreamWriter = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader reader = null;
		StringBuffer resultBuffer = new StringBuffer();
		String tempLine = null;

		try {
			outputStream = httpURLConnection.getOutputStream();
			outputStreamWriter = new OutputStreamWriter(outputStream, charset);
			outputStreamWriter.write(jsonParam.toString());
			// post file data
			if (files != null && files.length > 0) {
				for (int i = 0; i < files.length; i++) {
					MultipartFile file = files[i];

					outputStreamWriter.write(BOUNDARY);
					StringBuilder filenamesb = new StringBuilder();
					filenamesb
							.append("Content-Disposition:form-data;Content-Type:application/octet-stream;name=\"files");
					filenamesb.append("\";filename=\"");
					filenamesb.append(file.getOriginalFilename() + "\"\r\n\r\n");
					outputStreamWriter.write(filenamesb.toString());
					outputStreamWriter.write(convertStreamToString(file.getInputStream()));
					outputStreamWriter.write("\r\n\r\n");
				}
			}
			outputStreamWriter.write("--" + BOUNDARYSTR + "--\r\n");

			outputStreamWriter.flush();

			if (httpURLConnection.getResponseCode() >= 300) {
				throw new Exception("HTTP Request is not success, Response code is "
						+ httpURLConnection.getResponseCode() + "\nURL:\t" + url + "\njsonParam:\t" + jsonParam);
			}

			inputStream = httpURLConnection.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			reader = new BufferedReader(inputStreamReader);

			while ((tempLine = reader.readLine()) != null) {
				resultBuffer.append(tempLine);
			}

		} finally {

			if (outputStreamWriter != null) {
				outputStreamWriter.close();
			}
			if (outputStream != null) {
				outputStream.close();
			}
			if (reader != null) {
				reader.close();
			}
			if (inputStreamReader != null) {
				inputStreamReader.close();
			}
			if (inputStream != null) {
				inputStream.close();
			}
		}
		return resultBuffer.toString();
	}

	private String sendRequest(String url, String jsonParam, String fileName, InputStream fileStream, String tenantId, String method,boolean isZip)
			throws IOException {
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader reader = null;
		StringBuffer resultBuffer = new StringBuffer();
		String tempLine = null;
		try {
			final String newLine = "\r\n";
			final String boundaryPrefix = "--";
			// 定义数据分隔线
			//String BOUNDARY = "========7d4a6d158c9";
			URL Uurl = new URL(url);
			HttpURLConnection conn = (HttpURLConnection) Uurl.openConnection();
			conn.setRequestMethod("POST");
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setUseCaches(false);
			// 设置请求头参数
			conn.setRequestProperty("connection", "Keep-Alive");
			conn.setRequestProperty("Charsert", "UTF-8");
			conn.setRequestProperty("Content-Type", "multipart/form-data; boundary===" + BOUNDARYSTR);
			if(isZip){
				conn.setRequestProperty("Accept-Encoding", "gzip, deflate");
			}
			OutputStream out = new DataOutputStream(conn.getOutputStream());
			// 上传文件
			// File file = new
			// File("D:\\mao30-1010\\mao3\\mao-design\\design\\webapps\\workbench\\a\\bpmns\\a.bpmn20.xml");
			StringBuilder sb = new StringBuilder();
			sb.append(boundaryPrefix);
			sb.append("=="+BOUNDARYSTR);
			sb.append(newLine);
			sb.append("Content-Disposition:form-data;name=\"file\";filename=\"" + fileName
					+ "\"" + newLine);
			sb.append("Content-Type:application/octet-stream");
			sb.append(newLine);
			sb.append(newLine);
			out.write(sb.toString().getBytes());
			//DataInputStream in = new DataInputStream(new FileInputStream(file));
			byte[] bufferOut = new byte[1024];
			int bytes = 0;
			while ((bytes = fileStream.read(bufferOut)) != -1) {
				out.write(bufferOut, 0, bytes);
			}
			out.write(newLine.getBytes());
			fileStream.close();
			byte[] end_data = (newLine + boundaryPrefix + "=="+ BOUNDARYSTR + boundaryPrefix + newLine).getBytes();
			out.write(end_data);
			out.flush();

			if (conn.getResponseCode() >= 300) {
				throw new Exception("HTTP Request is not success, Response code is " + conn.getResponseCode()
						+ "\nURL:\t" + url + "\njsonParam:\t" + jsonParam);
			}

			inputStream = conn.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			reader = new BufferedReader(inputStreamReader);

			while ((tempLine = reader.readLine()) != null) {
				resultBuffer.append(tempLine);
			}

			out.close();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (reader != null) {
				reader.close();
			}
			if (inputStreamReader != null) {
				inputStreamReader.close();
			}
			if (inputStream != null) {
				inputStream.close();
			}
		}
		return resultBuffer.toString();
	}

	private String convertStreamToString(InputStream is) {
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		}
		StringBuilder sb = new StringBuilder();

		String line = null;
		try {
			if (reader != null) {
				while ((line = reader.readLine()) != null) {
					sb.append(line + "\n");
				}
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}

		return sb.toString();
	}

	private URLConnection openConnection(URL localURL) throws IOException {
		URLConnection urlConnection = localURL.openConnection();
		renderRequest(urlConnection);
		return urlConnection;
	}

	/**
	 * Render request according setting
	 * 
	 * @param request
	 */
	private void renderRequest(URLConnection connection) {
		if (connectTimeout != null) {
			connection.setConnectTimeout(connectTimeout);
		}
		if (socketTimeout != null) {
			connection.setReadTimeout(socketTimeout);
		}
	}

	/*
	 * Getter & Setter
	 */
	public Integer getConnectTimeout() {
		return connectTimeout;
	}

	public void setConnectTimeout(Integer connectTimeout) {
		this.connectTimeout = connectTimeout;
	}

	public Integer getSocketTimeout() {
		return socketTimeout;
	}

	public void setSocketTimeout(Integer socketTimeout) {
		this.socketTimeout = socketTimeout;
	}

//	public static void main(String[] args) {
//		HttpRequestUtils utils = new HttpRequestUtils();
//		try {
//			getTest(utils);
//			// postTest(utils);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//	@SuppressWarnings("rawtypes")
//	private static Map getTest(HttpRequestUtils utils) throws Exception {
//		ObjectMapper mapper = new ObjectMapper();
//		String result = utils.doGet(
//				"http://127.0.0.1:8080/dsp/orm/sql/execute?sql=SELECT%20MAX(ID)%20AS%20MAX_ID%20FROM%20TENANT&opeType=QUERY&database=global");
//		// 把返回的json结果转化为map
//		return mapper.readValue(result, Map.class);
//	}

}
