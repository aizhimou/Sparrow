package top.asimov.sparrow.service;

import cn.dev33.satoken.apikey.model.ApiKeyModel;
import cn.dev33.satoken.apikey.template.SaApiKeyUtil;
import cn.dev33.satoken.stp.StpUtil;
import java.time.LocalDateTime;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
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
  private final MessageSource messageSource;

  public AccountService(UserMapper userMapper, MailSenderService mailSenderService, MessageSource messageSource) {
    this.userMapper = userMapper;
    this.mailSenderService = mailSenderService;
    this.messageSource = messageSource;
  }

  public User getUserInfo(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException(messageSource.getMessage("user.not.found", null, LocaleContextHolder.getLocale()));
    }
    // Clear sensitive fields
    user.setPassword(null);
    user.setSalt(null);
    return user;
  }

  public String generateApiKey() {
    String loginId = (String) StpUtil.getLoginId();
    User user = userMapper.selectById(loginId);

    String previousApiKey = user.getApiKey();
    if (StringUtils.hasText(previousApiKey)) {
      // If the user already has an API key, delete it
      SaApiKeyUtil.deleteApiKey(previousApiKey);
    }

    ApiKeyModel akModel = SaApiKeyUtil
        .createApiKeyModel(loginId)
        .setTitle(user.getUsername())
        .setExpiresTime(-1)
        .addScope(user.getRole());
    SaApiKeyUtil.saveApiKey(akModel);
    user.setApiKey(akModel.getApiKey());
    userMapper.updateById(user);
    return akModel.getApiKey();
  }

  public void sendBindEmailVerificationCode(String userId, String email) {
    User user = checkUserWithEmail(userId, email);

    String code = VerificationCodeManager.generateCode();
    VerificationCodeManager.saveCode(userId, email, code);

    String emailContent = String.format(
        "Hello %s,<br><br>Your verification code is: %s<br><br>This code is valid for 5 minutes.",
        user.getUsername(), code);
    mailSenderService.send(email, "Verification Code - Sparrow", emailContent);
  }

  public void bindEmail(String userId, String email, String code) {
    User user = checkUserWithEmail(userId, email);

    if (!VerificationCodeManager.checkCode(userId, email, code)) {
      throw new BusinessException(messageSource.getMessage("user.verification.invalid", null, LocaleContextHolder.getLocale()));
    }

    user.setEmail(email);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  public void resetPassword(String userId, String oldPassword, String newPassword) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException(messageSource.getMessage("user.not.found", null, LocaleContextHolder.getLocale()));
    }
    // Verify old password
    boolean verified = PasswordUtil.verifyPassword(oldPassword, user.getSalt(), user.getPassword());
    if (!verified) {
      throw new BusinessException(messageSource.getMessage("user.old.password.incorrect", null, LocaleContextHolder.getLocale()));
    }

    // Update to new password
    String salt = PasswordUtil.generateSalt(16);
    String encryptedPassword = PasswordUtil.generateEncryptedPassword(newPassword, salt);
    user.setPassword(encryptedPassword);
    user.setSalt(salt);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  private User checkUserWithEmail(String userId, String email) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException(messageSource.getMessage("user.not.found", null, LocaleContextHolder.getLocale()));
    }
    if (!StringUtils.hasText(email)) {
      throw new BusinessException(messageSource.getMessage("user.empty.email", null, LocaleContextHolder.getLocale()));
    }
    return user;
  }

}
