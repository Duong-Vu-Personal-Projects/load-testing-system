package com.vn.ptit.duongvct.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(1)
public class RequestIdFilter implements Filter {

    private static final String REQUEST_ID = "requestId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            HttpServletRequest req = (HttpServletRequest) request;
            String requestId = req.getHeader(REQUEST_ID);

            // If no request ID in header, generate one
            if (requestId == null || requestId.isEmpty()) {
                requestId = UUID.randomUUID().toString().replace("-", "");
            }

            // Add the request ID to the MDC
            MDC.put(REQUEST_ID, requestId);

            // Continue with the request
            chain.doFilter(request, response);
        } finally {
            // Always clear the MDC after the request is processed
            MDC.clear();
        }
    }
}