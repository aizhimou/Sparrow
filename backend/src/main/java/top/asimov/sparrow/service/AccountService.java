package top.asimov.sparrow.service;

import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.mapper.UserMapper;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.util.PasswordUtil;
import top.asimov.sparrow.util.VerificationCodeManager;

@Service
public class AccountService {

  private final UserMapper userMapper;
  private final MailSenderService mailSenderService;

  public AccountService(UserMapper userMapper, MailSenderService mailSenderService) {
    this.userMapper = userMapper;
    this.mailSenderService = mailSenderService;
  }

  public void sendBindEmailVerificationCode(String userId, String email) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    if (!StringUtils.hasText(email)) {
      throw new BusinessException("Email cannot be empty");
    }

    String code = VerificationCodeManager.generateCode();
    VerificationCodeManager.saveCode(userId, email, code);

    String emailContent = String.format(
        "Hello %s,<br><br>Your verification code is: %s<br><br>This code is valid for 5 minutes.",
        user.getUsername(), code);
    mailSenderService.send(email, "Verification Code - Sparrow", emailContent);
  }

  public void bindEmail(String userId, String email, String code) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    if (!StringUtils.hasText(email)) {
      throw new BusinessException("Email cannot be empty");
    }
    if (!VerificationCodeManager.checkCode(userId, email, code)) {
      throw new BusinessException("Invalid or expired verification code");
    }

    user.setEmail(email);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  public void resetPassword(String userId, String oldPassword, String newPassword) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    // Verify old password
    boolean verified = PasswordUtil.verifyPassword(oldPassword, user.getSalt(), user.getPassword());
    if (!verified) {
      throw new BusinessException("Old password is incorrect");
    }

    // Update to new password
    String salt = PasswordUtil.generateSalt(16);
    String encryptedPassword = PasswordUtil.generateEncryptedPassword(newPassword, salt);
    user.setPassword(encryptedPassword);
    user.setSalt(salt);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

}
