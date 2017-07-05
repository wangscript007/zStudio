package com.zte.ums.bcp.orm.tabledata.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zte.dataservice.mongoextension.dao.MongoFileHelper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestFileRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseFileRecord;
import org.apache.log4j.Logger;

@Service(value = "fileRecordService")
public class MongoFileRecordService implements FileRecordService {
    private static final Logger dMsg = Logger.getLogger(MongoFileRecordService.class.getName());
    @Resource
    private MongoFileHelper mongoDBUtil;

    /**
     * 文件上传
     * 
     * @param requestFileRecord
     * @param files
     * @return
     * @throws OrmException
     */
    public List<String> upload(RequestFileRecord requestFileRecord, MultipartFile[] files) throws OrmException {
        if (files == null || files.length < 0) {
            throw new OrmException("MultipartFile is empty");
        }

        List<String> result = new ArrayList<String>();
        for (MultipartFile file : files) {
            try {
                String fileName = file.getOriginalFilename();
                requestFileRecord.setFileName(fileName);
                requestFileRecord.setFileType(fileName.substring(fileName.lastIndexOf('.') + 1));
                result.add(mongoDBUtil.SaveFile(requestFileRecord, file.getInputStream()));
            } catch (IOException e) {
                dMsg.error(e.getMessage(), e.fillInStackTrace());
                throw new OrmException(e.getMessage());
            }
        }
        return result;
    }

    /**
     * 文件下载
     * 
     * @param requestFileRecord
     * @param response
     * @throws OrmException
     */
    public void download(RequestFileRecord requestFileRecord, HttpServletResponse response) throws OrmException {
        ResponseFileRecord fileRecord = mongoDBUtil.retrieveFileOne(requestFileRecord);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Date date = new Date();
        String fileName = sdf.format(date) + fileRecord.getFileName();
        InputStream contents = fileRecord.getInputStream();
        OutputStream myout = null;
        try {
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment;filename="
                    + new String(fileName.getBytes("gbk"), "iso-8859-1"));

            byte[] b = new byte[1024];
            myout = response.getOutputStream();
            int temp = 0;
            while ((temp = contents.read(b)) != -1) {
                myout.write(b, 0, temp);
            }
            myout.flush();
        } catch (IOException err) {
            dMsg.error(err.getMessage());
        } finally {
            if (contents != null) {
                try {
                    contents.close();
                } catch (IOException e) {
                    dMsg.error(e.getMessage());
                }
            }
            if (myout != null) {
                try {
                    myout.close();
                } catch (IOException e) {
                    dMsg.error(e.getMessage());
                }
            }
        }
    }
}
