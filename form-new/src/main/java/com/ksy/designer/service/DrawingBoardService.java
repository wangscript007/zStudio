package com.ksy.designer.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.FormDrawingBoard;
import com.ksy.designer.entity.IDrawingBoard;

@Service
public class DrawingBoardService {
    private static final Logger LOGGER = Logger.getLogger(DrawingBoardService.class.getName());
    @Resource
    private DesignerEnvService designerEnvService;

    public IDrawingBoard getDrawingBoard(String designFileName) throws DesignerException {
        String designerFilesDir = designerEnvService.getDesignerFilesDir();
        File designFile = FileUtils.getFile(designerFilesDir, designFileName);
        if (designFile.exists() == false || designFile.isFile() == false) {
            return new FormDrawingBoard();
        }
        FormDrawingBoard drawingBoard = new FormDrawingBoard();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            drawingBoard.setContent(objectMapper.readValue(new FileInputStream(designFile), Map.class));
        } catch (JsonParseException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        } catch (JsonMappingException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        }
        return drawingBoard;
    }
}
