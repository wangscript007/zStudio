package com.zte.dataservice.mongoextension.dao;

import java.io.InputStream;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.framework.request.entry.RequestFileRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseFileRecord;
import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

@Service
public class MongoFileHelper extends MongoHelperBase {		
	
	/**
	 * 保存文件
	 * 
	 * @param fileRecord
	 * @return
	 */
	public String SaveFile(RequestFileRecord fileRecord, InputStream fileContens) {
		DB db = this.getDB(fileRecord.getDbName());
		GridFS gridFS = new GridFS(db, fileRecord.getCollectionName());
		GridFSInputFile gfs = gridFS.createFile(fileContens);
		gfs.setContentType(fileRecord.getFileType());
		gfs.setFilename(fileRecord.getFileName());
		gfs.save();
		return gfs.getId().toString();
	}

	/**
	 * 下载文件
	 * 
	 * @param fileRecord
	 */
	public ResponseFileRecord retrieveFileOne(RequestFileRecord fileRecord) {
		ResponseFileRecord record = new ResponseFileRecord();

		DB db = this.getDB(fileRecord.getDbName());
		GridFS gridFS = new GridFS(db, fileRecord.getCollectionName());
		ObjectId fileId = new ObjectId(fileRecord.getFileId());
		GridFSDBFile dbfile = gridFS.findOne(fileId);
		record.setFileName(dbfile.getFilename());
		record.setFileType(dbfile.getContentType());
		record.setInputStream(dbfile.getInputStream());

		return record;
	}
}
