package top.asimov.sparrow.model;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Option {

  @TableId
  private String id; // Option ID
  private String topic; // Topic to which the option belongs, e.g., "system", "user", "assistant"
  private String key; // Option key
  private String value; // Option value

}
