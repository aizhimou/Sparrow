package top.asimov.sparrow.service;

import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.model.MailConfig;
import top.asimov.sparrow.model.Config;

@Service
public class MailSenderService {

  private final ConfigService configService;

  public MailSenderService(ConfigService configService) {
    this.configService = configService;
  }

  public void send(String to, String subject, String htmlContent) {
    MailConfig mainConfig = getMainConfig();
    JavaMailSenderImpl mailSender = buildJavaMailSender(mainConfig);

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true);
      helper.setFrom(mainConfig.getUsername());
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(htmlContent, true); // true = HTML

      mailSender.send(message);
    } catch (Exception e) {
      throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
    }
  }

  private JavaMailSenderImpl buildJavaMailSender(MailConfig config) {
    JavaMailSenderImpl sender = new JavaMailSenderImpl();
    sender.setHost(config.getHost());
    sender.setPort(config.getPort());
    sender.setUsername(config.getUsername());
    sender.setPassword(config.getPassword());

    Properties props = sender.getJavaMailProperties();
    props.put("mail.transport.protocol", config.getProtocol());
    props.put("mail.smtp.auth", String.valueOf(config.isAuth()));
    props.put("mail.smtp.ssl.enable", String.valueOf(config.isSsl()));
    props.put("mail.debug", "false");

    return sender;
  }

  private MailConfig getMainConfig() {
    List<String> configNames = List.of(
        "SMTPServer", "SMTPPort", "SMTPAccount", "SMTPToken"
    );
    Map<String, String> emailConfigMap = configService.getConfigsByNames(configNames).stream()
        .collect(Collectors.toMap(Config::getName, Config::getValue));
    return MailConfig.builder()
        .host(emailConfigMap.get("SMTPServer"))
        .port(StringUtils.hasLength(emailConfigMap.get("SMTPPort")) ?
            Integer.parseInt(emailConfigMap.get("SMTPPort")) : 587)
        .username(emailConfigMap.get("SMTPAccount"))
        .password(emailConfigMap.get("SMTPToken"))
        .protocol("smtp")
        .auth(true)
        .ssl(true)
        .build();
  }
}
