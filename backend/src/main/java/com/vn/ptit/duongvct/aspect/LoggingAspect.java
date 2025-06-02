package com.vn.ptit.duongvct.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Around("execution(* com.vn.ptit.duongvct.service.*.*(..)) || execution(* com.vn.ptit.duongvct.service.impl.*.*(..))")
    public Object logServiceMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        // Log method entry with truncated arguments (to avoid logging sensitive data)
        logger.debug("Entering {}.{}() with {} arguments", className, methodName, args.length);

        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            // Log method exit with execution time
            if (duration > 1000) {
                logger.warn("{}.{}() took {}ms to execute - potential performance issue",
                        className, methodName, duration);
            } else {
                logger.debug("{}.{}() executed in {}ms", className, methodName, duration);
            }

            return result;
        } catch (Throwable e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("{}.{}() failed after {}ms with exception: {}",
                    className, methodName, duration, e.getMessage(), e);
            throw e;
        }
    }

    @Around("execution(* com.vn.ptit.duongvct.controller.*.*(..))")
    public Object logControllerMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        logger.info("API request received: {}.{}()", className, methodName);

        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            logger.info("API request completed: {}.{}() - took {}ms", className, methodName, duration);

            return result;
        } catch (Throwable e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("API request failed: {}.{}() - took {}ms - exception: {}",
                    className, methodName, duration, e.getMessage());
            throw e;
        }
    }
}