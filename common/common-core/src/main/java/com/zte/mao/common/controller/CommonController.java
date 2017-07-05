package com.zte.mao.common.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.common.service.LogInterceptorService;
import com.zte.mao.common.service.UserMembershipCredentialsService;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.MaoCommonUtil;

import org.apache.log4j.Logger;

@RequestMapping("/mao/")
@Controller
public class CommonController {
	private static Logger logger = Logger.getLogger(CommonController.class.getName());
	@Resource
	private SessionManager sessionManager;
	
	@Resource
	private HttpRequestUtils httpRequestUtils;
	
	@Resource
	com.zte.mao.common.service.LoginUserService loginMaoUserService;
	
	@Resource
    private UserMembershipCredentialsService userMembershipCredentialsService;
	
	@Resource
	private LogInterceptorService logInterceptorService;
	
	@RequestMapping(value = "common/platformtype", method = RequestMethod.GET)
	@ResponseBody
	public CommonResponse getProcessURL(HttpServletRequest request) {
		CommonResponse commonResponse;
		try {
			commonResponse = new DataResponse(ConfigManage.getInstance().getPlatformType());
		} catch (Exception e) {
			logger.error(e.getMessage());
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return commonResponse;
	}
	
	@RequestMapping(value = "common/login/check", method = RequestMethod.GET)
	@ResponseBody
	public CommonResponse isLoginCheck(HttpServletRequest request) {
		CommonResponse commonResponse = new CommonResponse();
		try {
			sessionManager.checkSignin(request);
		} catch (Exception e) {
			logger.error(e.getMessage());
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return commonResponse;
	}
	
	@RequestMapping(value = "common/isSupportProcess", method = RequestMethod.GET)
	@ResponseBody
	public CommonResponse isSupportProcess(HttpServletRequest request) {
		CommonResponse commonResponse;
		try {
			commonResponse = new DataResponse(ConfigManage.getInstance().isSupportProcess());
		} catch (Exception e) {
			logger.error(e.getMessage());
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return commonResponse;
	}
	
	@RequestMapping(value = "user/loginout", method = RequestMethod.GET)
	@ResponseBody
	public CommonResponse loginout(HttpServletRequest request) {
		CommonResponse commonResponse = new CommonResponse();
		try {
			UserSimpleEntity user = sessionManager.loginOut(request.getParameter("token"));
			logInterceptorService.addLoginLog(CommonConst.LOGINOUT_LOG,
					request, 
					String.valueOf(user.getTenantId()),
					user.getLoginName());
		} catch (Exception e) {
			logger.error(e.getMessage());
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return commonResponse;
	}
	
	/**
	 * 查询当前登录用户信息
	 * 
	 * @param
	 * @return
	 */
	@RequestMapping(value = "login/currentuser", method = RequestMethod.GET)
	@ResponseBody
	public CommonResponse getUsers(HttpServletRequest request) {
		CommonResponse response = null;
		try {
			response = loginMaoUserService.getResultMap(request);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			response = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return response;
	}
	
	@RequestMapping(value = "upload", method = RequestMethod.POST)  
    @ResponseBody
    public CommonResponse upload(HttpServletRequest request)  
            throws IllegalStateException, IOException {
    	 // 设置上下方文  
    	ServletContext servletContext = request.getSession().getServletContext();
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(servletContext); 
        //默认文件存储在服务器的根目录/upload
        String absolutePath = getPath(servletContext);
        
        List<String> urls = new ArrayList<String>();
        DataResponse response = new DataResponse(CommonResponse.STATUS_FAIL,"上传文件失败!",null);
  
        // 检查form是否有enctype="multipart/form-data"  
        if (multipartResolver.isMultipart(request)) {  
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;  
            Iterator<String> iter = multiRequest.getFileNames();  
            while (iter.hasNext()) {  
                // 由CommonsMultipartFile继承而来,拥有上面的方法.  
                MultipartFile file = multiRequest.getFile(iter.next());  
                if (file != null) { 
                	String path = upload(request, absolutePath, file);                    
                    urls.add(path);
                }  
            }
        }
        response.setStatus(CommonResponse.STATUS_SUCCESS);
        response.setMessage("上传文件成功!");
        if(urls.size()>0){
        	response.setData(urls.get(0));
        }
        return response;   
    }

	private String upload(HttpServletRequest request, String absolutePath,
			MultipartFile file) throws IOException {
		String time = String.valueOf(System.currentTimeMillis() + (int)(1+Math.random()*10));
		String fileName = file.getOriginalFilename();
		int position = fileName.lastIndexOf('.');
		fileName = fileName.substring(0, position) + time + fileName.substring(position);
		String localPath = absolutePath + fileName;  
  
		File localFile = new File(localPath);  
		file.transferTo(localFile);  
		return request.getContextPath()+"/upload/"+fileName;
	}

	private String getPath(ServletContext servletContext) {
		String absolutePath = servletContext.getRealPath("/")+"upload"+File.separator;
        absolutePath = absolutePath.replaceAll("\\\\", "/");
        File parent = new File(absolutePath);
        
        if(!parent.isDirectory()){
        	parent.mkdirs();
        }
		return absolutePath;
	}
	

    @RequestMapping(value = "userMembershipCredentials", method = RequestMethod.GET)
    public CommonResponse getUserMembershipCredentialsService(HttpServletRequest request) {
    	return userMembershipCredentialsService.getUserMembershipCredentialsService(request);
    }
}
