package top.asimov.sparrow.config;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailConfig {

  private String host;
  private Integer port;
  private String username;
  private String password;
  private String protocol = "smtp";
  private boolean auth = true;
  private boolean starttls = true;

}
