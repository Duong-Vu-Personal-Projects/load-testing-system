package com.vn.ptit.duongvct.util;

import org.slf4j.Logger;
import org.slf4j.MDC;
import org.slf4j.event.Level;

import java.util.HashMap;
import java.util.Map;

public class LoggerUtil {

    public static void log(Logger logger, Level level, String message, Object... args) {
        switch (level) {
            case INFO:
                logger.info(message, args);
                break;
            case DEBUG:
                logger.debug(message, args);
                break;
            case WARN:
                logger.warn(message, args);
                break;
            case ERROR:
                logger.error(message, args);
                break;
            case TRACE:
                logger.trace(message, args);
                break;
        }
    }

    public static void logWithContext(Logger logger, Level level, String message, Map<String, String> context, Object... args) {
        try {
            // Add all context values to MDC
            for (Map.Entry<String, String> entry : context.entrySet()) {
                MDC.put(entry.getKey(), entry.getValue());
            }
            // Log the message
            log(logger, level, message, args);
        } finally {
            // Remove context values from MDC to prevent memory leaks
            for (String key : context.keySet()) {
                MDC.remove(key);
            }
        }
    }

    public static Map<String, String> createContext(String key, String value) {
        Map<String, String> context = new HashMap<>();
        context.put(key, value);
        return context;
    }

    public static Map<String, String> createContext(Map<String, String> existing, String key, String value) {
        Map<String, String> context = new HashMap<>(existing);
        context.put(key, value);
        return context;
    }
}