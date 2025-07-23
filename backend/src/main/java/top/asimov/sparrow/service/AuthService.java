package top.asimov.sparrow.service;

import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
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
public class AuthService {

  private final UserMapper userMapper;
  private final ConfigService configService;
  private final MailSenderService mailSenderService;

  public AuthService(UserMapper userMapper, ConfigService configService,
      MailSenderService mailSenderService) {
    this.userMapper = userMapper;
    this.configService = configService;
    this.mailSenderService = mailSenderService;
  }

  public User checkUserCredentials(String username, String password) {
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("username", username);
    User existUser = query.one();
    if (ObjectUtils.isEmpty(existUser)) {
      throw new BusinessException("User not found");
    }

    boolean verified = PasswordUtil.verifyPassword(password, existUser.getSalt(),
        existUser.getPassword());
    if (!verified) {
      throw new BusinessException("Invalid password");
    }
    return existUser;
  }

  public int userRegister(User user) {
    if (ObjectUtils.isEmpty(user.getUsername()) || ObjectUtils.isEmpty(user.getPassword())) {
      throw new BusinessException("Username and password cannot be empty");
    }

    String registerEnabled = configService.getConfig("RegisterEnabled");
    if (!Boolean.parseBoolean(registerEnabled)) {
      throw new BusinessException("User registration is disabled");
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
      throw new BusinessException("Username is already taken");
    }

    String salt = PasswordUtil.generateSalt(10);
    User registerUser = User.builder()
        .username(user.getUsername())
        .password(PasswordUtil.generateEncryptedPassword(user.getPassword(), salt))
        .email(user.getEmail())
        .salt(salt)
        .role(1) // default role is 1 (user)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
    return userMapper.insert(registerUser);
  }

  public void sendRegistrationVerificationCode(String email) {
    if (!StringUtils.hasText(email)) {
      throw new BusinessException("Email cannot be empty");
    }

    // check if email is already registered
    QueryChainWrapper<User> query = new QueryChainWrapper<>(userMapper);
    query.eq("email", email);
    User existingUser = query.one();
    if (!ObjectUtils.isEmpty(existingUser)) {
      throw new BusinessException("Email is already registered");
    }

    String code = VerificationCodeManager.generateCode();
    VerificationCodeManager.saveCode("new_user", email, code);

    String emailContent = String.format(
        "Hello,\n\nYour registration verification code is: %s\n\nThis code is valid for 5 minutes.",
        code);
    String subject = "Sparrow Registration Verification Code";
    mailSenderService.send(email, subject, emailContent);
  }

  public void checkRegistrationVerificationCode(String email, String code) {
    if (!StringUtils.hasText(email) || !StringUtils.hasText(code)) {
      throw new BusinessException("Email and verification code cannot be empty");
    }

    boolean valid = VerificationCodeManager.checkCode("new_user", email, code);
    if (!valid) {
      throw new BusinessException("Invalid or expired verification code");
    }
  }

}
