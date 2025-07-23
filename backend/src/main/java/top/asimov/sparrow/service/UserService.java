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

  public UserService(UserMapper userMapper) {
    this.userMapper = userMapper;
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

  public void addUser(User user) {
    String username = user.getUsername();
    String password = user.getPassword();
    String email = user.getEmail();
    if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
      throw new BusinessException("Username and password cannot be empty");
    }
    String salt = PasswordUtil.generateSalt(16);
    String encryptedPassword = PasswordUtil.generateEncryptedPassword(password, salt);
    user.setUsername(username);
    user.setPassword(encryptedPassword);
    user.setSalt(salt);
    user.setEmail(email);
    user.setRole(1);
    userMapper.insert(user);
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
