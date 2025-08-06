package top.asimov.sparrow.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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

@Service
public class UserService {

  private final UserMapper userMapper;
  private final MessageSource messageSource;

  public UserService(UserMapper userMapper, MessageSource messageSource) {
    this.userMapper = userMapper;
    this.messageSource = messageSource;
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
      throw new BusinessException(messageSource.getMessage("user.empty.username.password", null, LocaleContextHolder.getLocale()));
    }

    if (userMapper.selectOne(new QueryWrapper<User>().eq("username", username)) != null) {
      throw new BusinessException(messageSource.getMessage("user.username.taken", null, LocaleContextHolder.getLocale()));
    }

    String email = user.getEmail().trim().isEmpty() ? null : user.getEmail().trim();
    if (StringUtils.hasText(email)) {
      if (userMapper.selectOne(new QueryWrapper<User>().eq("email", email)) != null) {
        throw new BusinessException(messageSource.getMessage("user.email.registered", null, LocaleContextHolder.getLocale()));
      }
    }

    String salt = PasswordUtil.generateSalt(16);
    String encryptedPassword = PasswordUtil.generateEncryptedPassword(password, salt);
    user.setUsername(username);
    user.setPassword(encryptedPassword);
    user.setSalt(salt);
    user.setEmail(email);
    user.setStatus(1);
    userMapper.insert(user);
  }

  public void forbidUser(String userId) {
    User user = userMapper.selectById(userId);
    if (ObjectUtils.isEmpty(user)) {
      throw new BusinessException(messageSource.getMessage("user.not.found", null, LocaleContextHolder.getLocale()));
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
      throw new BusinessException(messageSource.getMessage("user.not.found", null, LocaleContextHolder.getLocale()));
    }
    user.setStatus(1);
    user.setUpdatedAt(LocalDateTime.now());
    userMapper.updateById(user);
  }

}
