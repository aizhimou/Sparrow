package top.asimov.sparrow.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import top.asimov.sparrow.mapper.UserMapper;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.UserService;
import top.asimov.sparrow.util.PasswordUtil;

@Component
public class DataInitializer {

  private final UserMapper userMapper;

  public DataInitializer(UserMapper userMapper) {
    this.userMapper = userMapper;
  }

  @PostConstruct
  public void init() {
    // Check if the user exists, if not create a default user
    QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
    User rootUser = userMapper.selectOne(userQueryWrapper.eq("username", "root"));
    if (ObjectUtils.isEmpty(rootUser)) {
      User root = new User();
      root.setUsername("root");
      String password = "root@user.123"; // 设置默认密码
      String salt = PasswordUtil.generateSalt(10);
      root.setSalt(salt);
      root.setPassword(PasswordUtil.generateEncryptedPassword(password, salt));
      root.setRole(-1); // 设置为 root 用户
      userMapper.insert(root);
      System.out.println("created default root user: root / root@user.123");
    }
  }
}