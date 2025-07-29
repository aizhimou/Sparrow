package top.asimov.sparrow.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.mapper.UserMapper;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.util.PasswordUtil;

@Service
public class UserService {

  private final UserMapper userMapper;

  public UserService(UserMapper userMapper) {
    this.userMapper = userMapper;
  }

  public IPage<User> listUsers(String keyword, Page<User> page) {
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper.like("username", keyword)
                .or()
                .like("email", keyword)
        .orderByDesc("created_at");
    return userMapper.selectPage(page, queryWrapper);
  }

  public void addUser(User user) {
    String username = user.getUsername().trim();
    String password = user.getPassword();

    if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
      throw new BusinessException("Username and password cannot be empty");
    }

    if (userMapper.selectOne(new QueryWrapper<User>().eq("username", username)) != null) {
      throw new BusinessException("Username already exists");
    }

    String email = user.getEmail().trim().isEmpty() ? null : user.getEmail().trim();
    if (StringUtils.hasText(email)) {
      if (userMapper.selectOne(new QueryWrapper<User>().eq("email", email)) != null) {
        throw new BusinessException("Email already exists");
      }
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

  public void forbidUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setStatus(0);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);

    // Logout the user if they are currently logged in
    StpUtil.logout(userId);
  }

  public void enableUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    user.setStatus(1);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  public void upgradeUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    Integer oldRole = user.getRole();
    if (oldRole == -1) {
      throw new BusinessException("User is already an root user");
    }
    user.setRole(oldRole - 1);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

  public void downgradeUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException("User not found");
    }
    Integer oldRole = user.getRole();
    if (oldRole == 1) {
      throw new BusinessException("User is already a regular user");
      }
    user.setRole(oldRole + 1);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

}
