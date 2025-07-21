package top.asimov.sparrow.model;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Config {

  @TableId
  private String id;
  private String name;
  private String value;

}
