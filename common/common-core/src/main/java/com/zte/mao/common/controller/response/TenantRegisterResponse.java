package com.zte.mao.common.controller.response;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.service.register.TenantRegisterService;

@Service
public class TenantRegisterResponse extends AbstractUapResponse {

    @Resource
    private TenantRegisterService tenantRegisterService;

    @SuppressWarnings("rawtypes")
    @Override
    public Object onResponse(Map data) throws Exception {
        return tenantRegisterService.tenantRegister(data.get("username")
                .toString(), data.get("password").toString());
    }

    @Override
    public CommonResponse getResponse(String message, byte status, Object obj) {
        return new CommonResponse(status, message);
    }
}
