package top.asimov.sparrow.exception;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import cn.dev33.satoken.util.SaResult;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global Exception Handler
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle custom business exceptions
     */
    @ExceptionHandler(BusinessException.class)
    public SaResult handleBusinessException(BusinessException e) {
        return SaResult.code(e.getCode()).setMsg(e.getMessage());
    }

    /**
     * Handle parameter validation exceptions
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public SaResult handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        String message = bindingResult.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return SaResult.code(400).setMsg(message);
    }

    /**
     * Handle binding exceptions
     */
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public SaResult handleBindException(BindException e) {
        BindingResult bindingResult = e.getBindingResult();
        String message = bindingResult.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return SaResult.code(400).setMsg(message);
    }

    /**
     * Handle all other runtime exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public SaResult handleRuntimeException(RuntimeException e) {
        return SaResult.error(e.getMessage());
    }

    /**
     * Handle not logged in exceptions
     * @param e Not logged in exception
     * @return Not logged in error response
     */
    @ExceptionHandler(NotLoginException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public SaResult handleNotLoginException(NotLoginException e) {
        return SaResult.error(e.getMessage());
    }

    /**
     * Handle not permission exceptions
     * @param e Not permission exception
     * @return Not permission error response
     */
    @ExceptionHandler(NotPermissionException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public SaResult handleNotPermissionException(NotPermissionException e) {
        return SaResult.error(e.getMessage());
    }

}
