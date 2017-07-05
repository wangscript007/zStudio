package com.zte.ums.bcp.orm.utils;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;

public class JsonConverter {

	private static ObjectMapper mapper = new ObjectMapper();

	/**
	 * json array -> java list eg [{},{}...] -> List<T>
	 * 
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	public static <T> List<T> fromJson2List(String jsonStr)
			throws JsonParseException, JsonMappingException, IOException {
		List<T> list = mapper.readValue(jsonStr, new TypeReference<List<T>>() {
		});
		return list;
	}

	/**
	 * json object -> java Map eg {....} -> Map<String, T>
	 */
	public static <T> Map<String, T> fromJson2Map(String json)
			throws JsonParseException, JsonMappingException, IOException {
		Map<String, T> map = mapper.readValue(json,
				new TypeReference<Map<String, T>>() {
				});
		return map;
	}

	public static <T> T fromJson(String json, Class<T> clzz)
			throws JsonParseException, JsonMappingException, IOException {
		return mapper.readValue(json, clzz);
	}

	public static <T> String toJson(T obj) throws OrmException {
		DateFormat myFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		mapper.setDateFormat(myFormat);
		//mapper.getSerializationConfig().
		
		try {
			return mapper.writeValueAsString(obj);
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			throw new OrmException(e);
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			throw new OrmException(e);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new OrmException(e);
		}
	}

}
