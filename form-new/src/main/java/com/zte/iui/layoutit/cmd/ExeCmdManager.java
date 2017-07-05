package com.zte.iui.layoutit.cmd;

import java.io.File;
import java.util.Arrays;

import org.apache.log4j.Logger;

import com.ksy.designer.common.DesignerException;

/**
 * 执行命令通用管理类，可以通过该类执行操作系统命令，并获得从进程输出流和错误流中读取的信息。 注意，如果需要获取命令执行结果输出信息，建议使用join接口
 * 
 * @author jiangyong188311
 * 
 */
public class ExeCmdManager {
    private static Logger logger = Logger.getLogger(ExeCmdManager.class);

    /** 命令行数组模式 */
    private String[] commands;
    /** 单命令行模式 */
    private String command;

    private String[] envp;
    private File workingDir;

    /** 等待模式 */
    private long waitTime = -1;// 等待返回结果是否超时，-1则永不超时
    private boolean isJoin = false;// 等待返回结果是否等待输出流读取完毕，true表示等待输出流读取完毕

    /** 结果解析相关 */
    private String processNickName;
    private LineParser lineParser;
    private boolean isMsgIgnore = false;// 截获进程输出流是否忽略，true表示忽略，但一般仍然会打印

    private String[] inputStreamResults;
    private String[] errorStreamResults;
    private boolean isTimeout = false;

    /**
     * 非超时执行命令行
     * 
     * @param command
     */
    public ExeCmdManager(String command) {
        this(command, -1);
    }

    /**
     * 非超时执行命令行
     * 
     * @param command
     */
    public ExeCmdManager(String command, boolean isJoin) {
        this(command, -1);
        this.isJoin = isJoin;
    }

    /**
     * 非超时执行命令行数组
     * 
     * @param commands
     */
    public ExeCmdManager(String[] commands) {
        this(commands, -1);
    }

    /**
     * 非超时执行命令行数组
     * 
     * @param commands
     */
    public ExeCmdManager(String[] commands, boolean isJoin) {
        this(commands, -1);
        this.isJoin = isJoin;
    }

    /**
     * 
     * @param command
     * @param waitTime 单位为ms，-1时表示使用默认的waitFor(),否则使用超时机制
     */
    public ExeCmdManager(String command, long waitTime) {
        this(command, null, null, waitTime, null, null);
    }

    /**
     * 
     * @param commands
     * @param waitTime 单位为ms，-1时表示使用默认的waitFor(),否则使用超时机制
     */
    public ExeCmdManager(String[] commands, long waitTime) {
        this(commands, null, null, waitTime, null, null);
    }

    public ExeCmdManager(String command, String[] envp, File workingDir, long waitTime, String processNickName, LineParser lineParser) {
        this(command, envp, workingDir, waitTime, false, processNickName, lineParser, false);
    }

    /**
     * 
     * @param command
     * @param envp
     * @param workingDir
     * @param waitTime
     * @param processNickName
     * @param lineParser
     * @param outInfoType
     */
    public ExeCmdManager(String command, String[] envp, File workingDir, long waitTime, boolean isJoin, String processNickName, LineParser lineParser, boolean outInfoType) {
        this.command = command;
        this.envp = envp;
        this.workingDir = workingDir;
        this.waitTime = waitTime;
        this.isJoin = isJoin;
        this.processNickName = processNickName;
        this.lineParser = lineParser;
        this.isMsgIgnore = outInfoType;
    }

    public ExeCmdManager(String[] commands, String[] envp, File workingDir, long waitTime, String processNickName, LineParser lineParser) {
        this(commands, envp, workingDir, waitTime, false, processNickName, lineParser, false);
    }

    /**
     * 
     * @param commands 待执行的命令
     * @param envp 设置的环境变量
     * @param workingDir 命令的启动路径
     * @param waitTime
     * @param processNickName
     * @param lineParser
     * @param outInfoType
     */
    public ExeCmdManager(String[] commands, String[] envp, File workingDir, long waitTime, boolean isJoin, String processNickName, LineParser lineParser, boolean outInfoType) {
        this.commands = commands;
        this.envp = envp;
        this.workingDir = workingDir;
        this.waitTime = waitTime;
        this.isJoin = isJoin;
        this.processNickName = processNickName;
        this.lineParser = lineParser;
        this.isMsgIgnore = outInfoType;
    }

    public int exeCmd() throws Exception {
        return exeCmd(true);
    }

    /**
     * 执行命令，返回命令进程返回值
     * 
     * @throws DesignerException
     */
    public int exeCmd(boolean showCMD) throws Exception {
        String commandForShow = null;
        Process process;
        try {
            if (commands != null) {
                commandForShow = Arrays.asList(commands).toString();
                process = Runtime.getRuntime().exec(commands, envp, workingDir);
            } else {
                commandForShow = command;
                process = Runtime.getRuntime().exec(command, envp, workingDir);
            }
            if (showCMD) {
                logger.info("Execute commands:" + commandForShow);
            }
        } catch (Exception e) {
            throw new Exception("Fail to run command:" + commandForShow, e);
        }
        if (lineParser == null) {
            lineParser = new DefaultParse(processNickName, LogLevel.DEBUG);
        }
        ProcessRunner inputThread = new ProcessRunner(process, StreamType.INPUT, lineParser, isMsgIgnore);
        ProcessRunner errorThread = new ProcessRunner(process, StreamType.ERROR, lineParser, isMsgIgnore);
        ProcessRunnerManager manager = new ProcessRunnerManager(process, inputThread, errorThread, processNickName, null);
        int result = -1;
        if (waitTime >= 0) {
            manager.setTimeout(waitTime);
            result = manager.waitForWithTimeout();
        } else if (isJoin) {
            result = manager.waitForJoin();
        } else {
            result = manager.waitFor();
        }
        if (result != 0) {
            isTimeout = manager.executeTimeout();
            logger.info("Run command no result:" + commandForShow);
        }
        inputStreamResults = inputThread.getResults();
        errorStreamResults = errorThread.getResults();
        if (inputStreamResults.length > 0) {
            logger.debug("Results:" + Arrays.toString(inputStreamResults));
        }
        if (errorStreamResults.length > 0) {
            logger.debug("Results from error stream:" + Arrays.asList(errorStreamResults));
        }
        return result;
    }

    /**
     * 获取命令输出流信息
     * 
     * @return
     */
    public String[] getInputStreamResults() {
        return inputStreamResults;
    }

    /**
     * 获取命令错误流信息
     * 
     * @return
     */
    public String[] getErrorStreamResults() {
        return errorStreamResults;
    }

    /**
     * 命令执行是否超时（仅超时机制执行命令时有效）
     * 
     * @return
     */
    public boolean isTimeout() {
        return isTimeout;
    }
}
