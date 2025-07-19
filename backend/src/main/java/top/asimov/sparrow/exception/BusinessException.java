package top.asimov.sparrow.exception;

import lombok.Getter;
import lombok.Setter;

/**
 * 业务异常类
 */
public class BusinessException extends RuntimeException {

  @Setter
  @Getter
  private Integer code;
  @Setter
  @Getter
  private String message;

  public BusinessException(String message) {
    super(message);
    this.code = 400; // Default error code
    this.message = message;
  }

  public BusinessException(Integer code, String message) {
    super(message);
    this.code = code;
    this.message = message;
  }

}
