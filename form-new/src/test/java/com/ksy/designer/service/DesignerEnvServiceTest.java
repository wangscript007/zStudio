package com.ksy.designer.service;

import static org.junit.Assert.*;

import java.io.File;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

@RunWith(PowerMockRunner.class)
@PrepareForTest({ System.class, DesignerEnvService.class })
public class DesignerEnvServiceTest {
    private DesignerEnvService designerEnvService;

    @Before
    public void setup() {
        designerEnvService = new DesignerEnvService();
    }

    @Test
    public void testGetDesignerHome() {
        mockSystemClass();

        assertEquals("/home", designerEnvService.getDesignerHome());
    }

    @Test
    public void testGetProductHome() {
        this.designerEnvService = PowerMockito.spy(this.designerEnvService);
        try {
            PowerMockito.doReturn("123").when(designerEnvService,"getProductType");
            PowerMockito.doReturn("/home").when(designerEnvService,"getAppHomePath");
        } catch (Exception e) {
            fail(e.getMessage());
        }

        String expected = "/home" + File.separator + "app" + File.separator + "123";

        assertEquals(expected, designerEnvService.getProductHome());
    }

    private void mockSystemClass() {
        PowerMockito.mockStatic(System.class);
        PowerMockito.when(System.getProperty("catalina.home")).thenReturn("/home");
    }
}
