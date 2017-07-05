package com.zte.mao.common.util.cmd;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;


/**
 * 系统进程辅助线程类，支持进程输出流或错误流中信息解析 <br>
 * 不建议直接使用
 * 
 * @author jiangyong188311
 * 
 */
public class ProcessRunner implements Runnable {
	private static Logger logger = Logger.getLogger(ProcessRunner.class);
	protected Process process;
	protected StreamType type;
	protected LineParser parser;
	private List<String> list = new ArrayList<String>();
	protected boolean isMsgIgnore = false;// 截获输出流是否返回

	/**
	 * 仅读取流，不解析处理流
	 * 
	 * @param process
	 * @param streamType
	 */
	public ProcessRunner(Process process, StreamType streamType) {
		this(process, streamType, null, false);
	}

	public ProcessRunner(Process process, StreamType streamType, LineParser parser, boolean isMsgIgnore) {
		if (process == null || streamType == null) {
			throw new IllegalArgumentException("Process and StreamType can't be null.");
		}
		this.process = process;
		this.type = streamType;
		this.parser = parser;
		this.isMsgIgnore = isMsgIgnore;
	}

	public void run() {
		BufferedReader br = null;
		try {
			String line;
			InputStream is = process.getInputStream();
			if (type == StreamType.ERROR) {
				is = process.getErrorStream();
			}
			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				if (parser != null) {
					line = parser.parse(line);
				} 
				if (!isMsgIgnore) {
					list.add(line);
				}
			}
		} catch (IOException e) {
			printException(e);
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					logger.debug("", e);
				}
			}
		}
	}

	private void printException(IOException e) {
		if ("Stream closed".equals(e.getMessage())
				|| "Bad file descriptor".equals(e.getMessage())) {
			logger.debug(e.getMessage());
		}
		else {
			logger.debug("", e);
		}
	}

	/** 获得从进程的指定类型的流中解析获取的结果信息 */
	public String[] getResults() {
		return list.toArray(new String[] {});
	}
}
