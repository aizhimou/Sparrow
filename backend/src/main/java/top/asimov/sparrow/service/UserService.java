package top.asimov.sparrow.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.mapper.UserMapper;
import top.asimov.sparrow.util.PasswordUtil;
import top.asimov.sparrow.util.VerificationCodeManager;

@Service
public class UserService {

  private final UserMapper userMapper;
  private final MailSenderService mailSenderService;

  public UserService(UserMapper userMapper, MailSenderService mailSenderService) {
    this.userMapper = userMapper;
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

  public User getCurrentUser() {
    Long userId = StpUtil.getLoginIdAsLong();
    if (ObjectUtils.isEmpty(userId)) {
      return null;
    }
    return userMapper.selectById(userId);
  }

  public void sendVerificationEmail(String userId, String email) {
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
        "Hello %s,\n\nYour verification code is: %s\n\nThis code is valid for 5 minutes.",
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
    //user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  public IPage<User> listUsers(User user, Page<User> page) {
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    if (StringUtils.hasText(user.getUsername())) {
      queryWrapper.like("username", user.getUsername());
    }
    if (StringUtils.hasText(user.getEmail())) {
      queryWrapper.like("email", user.getEmail());
    }
    return userMapper.selectPage(page, queryWrapper);
  }

  public void addUser(String username, String password, String email) {
    String salt = PasswordUtil.generateSalt(16);
    String encryptedPassword = PasswordUtil.generateEncryptedPassword(password, salt);
    User user = new User();
    user.setUsername(username);
    user.setPassword(encryptedPassword);
    user.setSalt(salt);
    user.setEmail(email);
    user.setRole(1);
    userMapper.insert(user);
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

  public void updateEmail(String userId, String newEmail) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setEmail(newEmail);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  public User forbidUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setStatus(0);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
    return user;
  }

  public User enableUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setStatus(1);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
    return user;
  }


  public User upgradeUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setRole(0); // Upgrade to admin
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
    return user;
  }

  public User downgradeUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setRole(1); // Downgrade to regular user
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
    return user;
  }


}
