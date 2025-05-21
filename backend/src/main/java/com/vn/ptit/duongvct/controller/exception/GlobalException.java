package com.vn.ptit.duongvct.controller.exception;

import com.vn.ptit.duongvct.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAllException(Exception exception) {
        var result = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage() , null, "INTERNAL_SERVER_ERROR");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    @ExceptionHandler(
            value = {
                    IllegalArgumentException.class,
                    NoSuchElementException.class
            }

    )
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(Exception exception) {
        var result = new ApiResponse<>(HttpStatus.BAD_REQUEST, exception.getMessage() , null, "BAD_REQUEST");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @ExceptionHandler(value = {
            BadCredentialsException.class
    })
    public ResponseEntity<ApiResponse<?>> handleLoginException(BadCredentialsException exception) {
        var result = new ApiResponse<>(HttpStatus.UNAUTHORIZED, exception.getMessage() , null, "UNAUTHORIZED");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> validationError(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        final List<FieldError> fieldErrors = result.getFieldErrors();
        List<String> errors = new ArrayList<>();
        for (FieldError error : fieldErrors) {
            errors.add(error.getDefaultMessage());
        }
        Object message = errors.size() > 1 ? errors : errors.get(0);
        ApiResponse<Object> res = new ApiResponse<>(HttpStatus.BAD_REQUEST, message, null, ex.getBody().getDetail());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);

    }
}
