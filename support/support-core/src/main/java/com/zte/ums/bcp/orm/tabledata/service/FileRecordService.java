package com.zte.ums.bcp.orm.tabledata.service;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestFileRecord;

public interface FileRecordService {

    /**
     * 文件上传
     * 
     * @param requestFileRecord
     * @param files
     * @return
     * @throws OrmException
     */
    List<String> upload(RequestFileRecord requestFileRecord, MultipartFile[] files) throws OrmException;

    /**
     * 文件下载
     * 
     * @param requestFileRecord
     * @param response
     * @throws OrmException
     */
    void download(RequestFileRecord requestFileRecord, HttpServletResponse response) throws OrmException;
}
