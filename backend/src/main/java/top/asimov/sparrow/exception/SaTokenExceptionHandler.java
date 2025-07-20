package top.asimov.sparrow.exception;

import cn.dev33.satoken.exception.NotLoginException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class SaTokenExceptionHandler {

  @ExceptionHandler(NotLoginException.class)
  public ResponseEntity<String> handleNotLoginException(NotLoginException e) {
    return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED) // 401
        .body(e.getMessage());
  }
}
