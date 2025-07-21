package top.asimov.sparrow.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MailConfig {

  private String host;
  private Integer port;
  private String username;
  private String password;
  private String protocol;
  private boolean auth;
  private boolean ssl;

}
