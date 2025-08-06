package top.asimov.sparrow.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
import java.time.LocalDateTime;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.constant.Role;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.mapper.UserMapper;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.util.PasswordUtil;
import top.asimov.sparrow.util.VerificationCodeManager;

@Service
public class AuthService {

  private final UserMapper userMapper;
  private final ConfigService configService;
  private final MailSenderService mailSenderService;
  private final MessageSource messageSource;

  public AuthService(UserMapper userMapper, ConfigService configService,
      MailSenderService mailSenderService, MessageSource messageSource) {
    this.userMapper = userMapper;
    this.configService = configService;
    this.mailSenderService = mailSenderService;
    this.messageSource = messageSource;
  }

  public User login(String username, String password) {
    User user = checkUserCredentials(username, password);
    StpUtil.login(user.getId());

    String role = user.getRole();
    StpUtil.getSession().set("role", role);
    return user;
  }

  public int userRegister(User user) {
    if (ObjectUtils.isEmpty(user.getUsername()) || ObjectUtils.isEmpty(user.getPassword())) {
      throw new BusinessException(messageSource.getMessage("user.empty.username.password", null, LocaleContextHolder.getLocale()));
    }

    String registerEnabled = configService.getConfig("RegisterEnabled");
    if (!StringUtils.hasText(registerEnabled) || !Boolean.parseBoolean(registerEnabled)) {
      throw new BusinessException(messageSource.getMessage("user.register.disabled", null, LocaleContextHolder.getLocale()));
    }

    String emailVerificationEnabled = configService.getConfig("EmailVerificationEnabled");
    if (Boolean.parseBoolean(emailVerificationEnabled)) {
      checkRegistrationVerificationCode(user.getEmail(), user.getVerificationCode());
    }

    // check if username already exists
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("username", user.getUsername());
    User existingUser = query.one();
    if (!ObjectUtils.isEmpty(existingUser)) {
      throw new BusinessException(messageSource.getMessage("user.username.taken", null, LocaleContextHolder.getLocale()));
    }

    String salt = PasswordUtil.generateSalt(10);
    User registerUser = User.builder()
        .username(user.getUsername())
        .password(PasswordUtil.generateEncryptedPassword(user.getPassword(), salt))
        .email(user.getEmail())
        .salt(salt)
        .status(1)
        .role(Role.USER)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
    return userMapper.insert(registerUser);
  }

  public void sendRegistrationVerificationCode(String email) {
    if (!StringUtils.hasText(email)) {
      throw new BusinessException(messageSource.getMessage("user.empty.email", null, LocaleContextHolder.getLocale()));
    }

    // check if email is already registered
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("email", email);
    User existingUser = query.one();
    if (!ObjectUtils.isEmpty(existingUser)) {
      throw new BusinessException(messageSource.getMessage("user.email.registered", null, LocaleContextHolder.getLocale()));
    }

    String code = VerificationCodeManager.generateCode();
    VerificationCodeManager.saveCode("new_user", email, code);

    String emailContent = String.format(
        "Welcome! <br><br>Your registration verification code is: <b>%s</b> <br><br>This code is valid for 5 minutes.",
        code);
    String subject = "Sparrow Registration Verification Code";
    mailSenderService.send(email, subject, emailContent);
  }

  public void checkRegistrationVerificationCode(String email, String code) {
    if (!StringUtils.hasText(email) || !StringUtils.hasText(code)) {
      throw new BusinessException(messageSource.getMessage("user.empty.email.code", null, LocaleContextHolder.getLocale()));
    }

    boolean valid = VerificationCodeManager.checkCode("new_user", email, code);
    if (!valid) {
      throw new BusinessException(messageSource.getMessage("user.verification.invalid", null, LocaleContextHolder.getLocale()));
    }
  }

  public void sendForgetPasswordVerificationCode(String email) {
    if (!StringUtils.hasText(email)) {
      throw new BusinessException(messageSource.getMessage("user.empty.email", null, LocaleContextHolder.getLocale()));
    }

    // check if email is registered
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("email", email);
    User existingUser = query.one();
    if (ObjectUtils.isEmpty(existingUser)) {
      throw new BusinessException(messageSource.getMessage("user.email.not.registered", null, LocaleContextHolder.getLocale()));
    }

    String code = VerificationCodeManager.generateCode();
    VerificationCodeManager.saveCode(existingUser.getId(), email, code);

    String emailContent = String.format(
        "Hello %s,<br><br>Your password reset verification code is: <b>%s</b> <br><br>This code is valid for 5 minutes.",
        existingUser.getUsername(), code);
    String subject = "Sparrow Password Reset Verification Code";
    mailSenderService.send(email, subject, emailContent);
  }

  public void forgetPassword(User user) {
    if (ObjectUtils.isEmpty(user.getEmail()) || !StringUtils.hasText(user.getVerificationCode())) {
      throw new BusinessException(messageSource.getMessage("user.empty.email.code", null, LocaleContextHolder.getLocale()));
    }

    String forgetPasswordEnabled = configService.getConfig("ForgetPasswordEnabled");
    if (!StringUtils.hasText(forgetPasswordEnabled) || !Boolean.parseBoolean(
        forgetPasswordEnabled)) {
      throw new BusinessException(messageSource.getMessage("user.forget.password.disabled", null, LocaleContextHolder.getLocale()));
    }

    // check if email is registered
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("email", user.getEmail());
    User existingUser = query.one();
    if (ObjectUtils.isEmpty(existingUser)) {
      throw new BusinessException(messageSource.getMessage("user.email.not.registered", null, LocaleContextHolder.getLocale()));
    }

    boolean valid = VerificationCodeManager.checkCode(existingUser.getId(), user.getEmail(),
        user.getVerificationCode());
    if (!valid) {
      throw new BusinessException(messageSource.getMessage("user.verification.invalid", null, LocaleContextHolder.getLocale()));
    }

    String salt = PasswordUtil.generateSalt(10);
    existingUser.setPassword(PasswordUtil.generateEncryptedPassword(user.getPassword(), salt));
    existingUser.setSalt(salt);
    existingUser.setUpdatedAt(LocalDateTime.now());

    userMapper.updateById(existingUser);
  }

  private User checkUserCredentials(String username, String password) {
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("username", username);
    User existUser = query.one();
    if (ObjectUtils.isEmpty(existUser)) {
      throw new BusinessException(messageSource.getMessage("user.not.found", null, LocaleContextHolder.getLocale()));
    }

    if (1 != existUser.getStatus()) {
      throw new BusinessException(messageSource.getMessage("user.not.active", null, LocaleContextHolder.getLocale()));
    }

    boolean verified = PasswordUtil.verifyPassword(password, existUser.getSalt(),
        existUser.getPassword());
    if (!verified) {
      throw new BusinessException(messageSource.getMessage("user.invalid.password", null, LocaleContextHolder.getLocale()));
    }
    return existUser;
  }

}
