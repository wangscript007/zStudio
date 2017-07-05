package com.zte.iui.layoutit.common;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

public class FileUtil {

    private FileUtil() {
        super();
    }
    
    public static String getApplicationRealPath(final HttpServletRequest request) {
        return request.getServletContext().getRealPath("");
    }
    
    public static File createFileOrMultistageDirectoryOfFile(final String fileUrl) throws IOException {
        File file = new File(fileUrl);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        if (!file.exists()) {
            file.createNewFile();
        }
        return file;
    }
    
    public static File createFileOrMultistageDirectoryOfFile(final File file) throws IOException {
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        if (!file.exists()) {
            file.createNewFile();
        }
        return file;
    }
}
