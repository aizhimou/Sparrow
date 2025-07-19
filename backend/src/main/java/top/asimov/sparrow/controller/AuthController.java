package top.asimov.sparrow.controller;

import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.UserService;

@RestController
@RequestMapping("/api")
public class AuthController {

  private final UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/login")
  public SaResult login(@RequestBody User user) {
    User exsitUser = userService.checkUserCredentials(user.getUsername(),user.getPassword());
    if (ObjectUtils.isEmpty(exsitUser)) {
      return SaResult.error("username or password is incorrect");
    }
    StpUtil.login(exsitUser.getId());
    SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
    exsitUser.setToken(tokenInfo.getTokenValue());
    return SaResult.data(exsitUser);
  }

  @PostMapping("/logout")
  public SaResult logout() {
    StpUtil.logout();
    return SaResult.ok("Logout successful");
  }
}
