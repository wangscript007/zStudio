package com.zte.ums.bcp.orm.tabledata.service;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.I18n;
import com.zte.ums.bcp.orm.framework.request.entry.RequestFileRecord;

@Service(value = "fileRecordService")
public class OrmFileRecordService implements FileRecordService {
    @Resource
    private I18n i18n;

    @Override
    public List<String> upload(RequestFileRecord requestFileRecord, MultipartFile[] files) throws OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "OrmFileRecordService.upload()", "ORM"));
    }

    @Override
    public void download(RequestFileRecord requestFileRecord, HttpServletResponse response) throws OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "OrmFileRecordService.download()",  "ORM"));
    }
}
