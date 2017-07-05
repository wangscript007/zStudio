package com.ksy.designer.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.CommonConst;
import com.ksy.designer.common.DesignerException;

/**
 * 
 * @author 10089289
 *
 */
public abstract class FileService {
    /**
     * 创建目录
     * 
     * @param dirPath
     * @throws DesignerException 
     */
    public void createDir(String dirPath) throws DesignerException {
        String dataDir = getDataDir(null);
        File dir = new File(dataDir + File.separator + dirPath);
        if (!dir.exists())
            dir.mkdirs();
    }

    /**
     * 创建文件
     * 
     * @param fileName
     * @return
     * @throws DesignerException
     */
    public void createFile(String fileName) throws DesignerException {
        String dataDir = getDataDir(fileName);
        File file = new File(dataDir + File.separator + fileName);
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                throw new DesignerException(e);
            }
        }
    }

    /**
     * 判断文件是否存在
     * 
     * @return
     * @throws DesignerException 
     */
    public boolean isFileExists(String fileName) throws DesignerException {
        String dataDir = getDataDir(fileName);
        File file = new File(dataDir + File.separator + fileName);
        return file.exists();
    }

    /**
     * 删除文件
     * 
     * @param fileName
     * @return
     * @throws DesignerException 
     */
    public void deleteFile(String fileName) throws DesignerException {
        String dataDir = getDataDir(fileName);
        File file = new File(dataDir + File.separator + fileName);
        if (file.exists()) {
            file.delete();
        }
    }

    /**
     * 文件重命名
     * @param oldName 旧文件名
     * @param newName 新文件名
     * 
     * @throws DesignerException
     */
    public void renameFile(String oldName, String newName) throws DesignerException {
        String dataDir = getDataDir(oldName);
        File oldFile = new File(dataDir + File.separator + oldName);
        File newFile = new File(dataDir + File.separator + newName);
        oldFile.renameTo(newFile);
    }

    /**
     * 读取文件内容
     * 
     * @param fileName
     * @return
     * @throws DesignerException
     */
    public Map<?, ?> readFile(String fileName) throws DesignerException {
        String dataDir = getDataDir(fileName);
        File file = new File(dataDir + File.separator + fileName);
        if (!file.exists()) {
            return new HashMap<>();
        }
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(file, LinkedHashMap.class);
        } catch (IOException e) {
            throw new DesignerException(e);
        }
    }

    /**
     * 写入文件
     * 
     * @param content
     * @return
     * @throws Exception
     */
    public void writeFile(String fileName, String content) throws DesignerException {
        String dataDir = getDataDir(fileName);
        File file = new File(dataDir + File.separator + fileName);
        String checkedContent = checkContent(content, fileName);
        createFile(fileName);
        try {
            FileUtils.writeStringToFile(file, checkedContent, CommonConst.UTF_8);
        } catch (IOException e) {
            throw new DesignerException(e);
        }
    }
    
    protected abstract String checkContent(String content, String fileName) throws DesignerException;
    
    protected abstract String getDataDir(String fileName) throws DesignerException;
}
