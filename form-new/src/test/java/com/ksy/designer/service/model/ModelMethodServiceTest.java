package com.ksy.designer.service.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.support.membermodification.MemberModifier;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.CommonConst;
import com.ksy.designer.entity.model.IModelMethod;
import com.ksy.designer.service.DesignerEnvService;

public class ModelMethodServiceTest {
    private static String TEST_DIR;
    private ModelMethodService modelMethodService;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        TEST_DIR = ModelDefinitionServiceTest.class.getResource("/").getPath() + "model";
    }

    @Before
    public void setUp() throws Exception {
        modelMethodService = new ModelMethodService();
    }

    @Test
    public void testModelMethod() {
        mockDesignerEnvService();

        List<IModelMethod> actualModelMtdList = modelMethodService.getModelMethod();
        assertEquals(1, actualModelMtdList.size());

        ObjectMapper objectMapper = new ObjectMapper();
        File expectedFile = new File(TEST_DIR + File.separator + "method" + File.separator + "test1.mm");
        try {
            String expectedMethodJson = FileUtils.readFileToString(expectedFile, CommonConst.UTF_8);
            assertEquals(expectedMethodJson, objectMapper.writeValueAsString(actualModelMtdList.get(0)));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    private void mockDesignerEnvService() {
        try {
            DesignerEnvService designerEnvService = Mockito.mock(DesignerEnvService.class);
            Mockito.when(designerEnvService.getDesignerDataDir()).thenReturn(TEST_DIR);

            MemberModifier.field(ModelMethodService.class, "designerEnvService").set(modelMethodService, designerEnvService);
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
}
