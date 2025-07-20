package top.asimov.sparrow.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;
import top.asimov.sparrow.config.MailConfig;

@Service
public class MailSenderService {

  public void send(String to, String subject, String htmlContent, MailConfig config) {
    JavaMailSenderImpl mailSender = buildJavaMailSender(config);

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true);
      helper.setFrom(config.getUsername());
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
    props.put("mail.smtp.starttls.enable", String.valueOf(config.isStarttls()));
    props.put("mail.debug", "false");

    return sender;
  }
}
