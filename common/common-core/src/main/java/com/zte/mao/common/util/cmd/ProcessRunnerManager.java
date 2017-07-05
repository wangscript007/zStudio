package com.zte.mao.common.util.cmd;

import java.io.IOException;
import java.io.OutputStream;

import org.apache.log4j.Logger;

import com.zte.mao.common.exception.MaoCommonException;


/**
 * 操作系统进程管理类：通过运行传入的或默认的线程辅助系统进程运行，包含超时机制等待和原生等待机制 默认超时30mins，超时检测时间粒度为500ms <br>
 * 不建议直接使用
 * 
 * @author jiangyong188311
 * 
 */
public class ProcessRunnerManager {
	private static Logger logger = Logger.getLogger(ProcessRunnerManager.class);
	private static final String DEFAULT_PROCESS_NICKNAME = "DEFAULT_SUBPROCESS";

	private Process process;
	private String processNickName = DEFAULT_PROCESS_NICKNAME;
	private ProcessRunner inputThread;
	private ProcessRunner errorThread;

	private long timeout = 10 * 1000;
	private long sleep = 500;
	private int defaultReturnValue = -1;
	/** 子进程输入参数 */
	private String inputCommand;

	/**
	 * 
	 * @param process 相关的子进程
	 * @param inputThread 子进程输出流解析线程
	 * @param errorThread 子进程错误流解析线程
	 * @param processNickName 子进程代号（解析线程命令）
	 * @param inputCommand 子进程执行过程中输入命令
	 */
	public ProcessRunnerManager(Process process, ProcessRunner inputThread, ProcessRunner errorThread, String processNickName, String inputCommand) {
		if (process == null) {
			throw new IllegalArgumentException("Process can't be null.");
		}
		this.process = process;
		this.inputThread = inputThread;
		this.errorThread = errorThread;
		if (inputThread == null) {
			this.inputThread = new ProcessRunner(process, StreamType.INPUT);
		}
		if (errorThread == null) {
			this.errorThread = new ProcessRunner(process, StreamType.ERROR);
		}
		if (processNickName != null) {
			this.processNickName = processNickName;
		}
		this.inputCommand = inputCommand;
	}

	/**
	 * 带有超时的等待逻辑
	 * 
	 * @param destroyWhenExit 当为true时，则在超时后杀掉等待的进程；否则，不杀掉（可能有风险
	 * @return
	 * @throws MaoCommonException
	 */
	public int waitForWithTimeout(boolean destroyWhenExit) throws MaoCommonException {
		int returnValue = defaultReturnValue;
		try {
			Thread t1 = new Thread(inputThread, processNickName);
			Thread t2 = new Thread(errorThread, processNickName);
			t1.start();
			t2.start();
			if (inputCommand != null) {
				/***********************************************************************
				 * 如果子进程还要求有输入，则增加这样的方法
				 */
				OutputStream outputToChild = process.getOutputStream();
				try {
					outputToChild.write(inputCommand.getBytes());
					outputToChild.flush();
				} catch (IOException e) {
					logger.error("", e);
				}
			}
			while ((t1.isAlive() || t2.isAlive()) && timeout > 0) {
				Thread.sleep(sleep);
				timeout -= sleep;
			}
			do {
				try {
					returnValue = process.exitValue();
					break;
				} catch (IllegalThreadStateException e) {
					if (timeout > 0) {
						Thread.sleep(sleep);
						timeout -= sleep;
					} else {
						break;
					}
				}
			} while (timeout > 0);
		} catch (Exception e) {
			throw new MaoCommonException(e);
		} finally {
			if (process != null && destroyWhenExit) {
				process.destroy();
			}
		}
		return returnValue;
	}

	/**
	 * 带有超时的waitFor的实现
	 * 
	 * @return
	 * @throws MaoCommonException
	 */
	public int waitForWithTimeout() throws MaoCommonException {
		int returnValue = waitForWithTimeout(true);
		return returnValue;
	}

	/**
	 * 设置操作的超时时间
	 * 
	 * @param timeout
	 */
	public void setTimeout(long timeout) {
		this.timeout = timeout;
	}

	/**
	 * 设置sleep时间
	 * 
	 * @param sleep
	 */
	public void setSleep(long sleep) {
		this.sleep = sleep;
	}

	/**
	 * 执行完成之后获取是否该操作在超时时间内完成
	 * 
	 * @return
	 */
	public boolean executeTimeout() {
		return timeout <= 0;
	}

	/**
	 * java原生的waitFor，在某些情况下可能导致挂起
	 * 
	 * @return
	 * @throws MaoCommonException
	 */
	public int waitFor() throws MaoCommonException {
		int returnValue = defaultReturnValue;
		try {
			Thread tInput = new Thread(inputThread, processNickName);
			Thread eInput = new Thread(errorThread, processNickName);
			tInput.start();
			eInput.start();
			process.waitFor();
			returnValue = process.exitValue();
		} catch (Exception e) {
			throw new MaoCommonException(e);
		} finally {
			if (process != null)
				process.destroy();
		}
		return returnValue;
	}

	/**
	 * 有时还未读完输出流，就已经返回，关闭process了
	 * 
	 * @return
	 * @throws MaoCommonException
	 */
	public int waitForJoin() throws MaoCommonException {
		int returnValue = defaultReturnValue;
		try {
			Thread tInput = new Thread(inputThread, processNickName);
			Thread eInput = new Thread(errorThread, processNickName);
			tInput.start();
			eInput.start();
			// AIX系统destroy后，就不能读输出流。windwos上则可以。
			tInput.join();
			eInput.join();
			process.waitFor();
			returnValue = process.exitValue();
		} catch (Exception e) {
			throw new MaoCommonException(e);
		} finally {
			if (process != null)
				process.destroy();
		}
		return returnValue;
	}
}
