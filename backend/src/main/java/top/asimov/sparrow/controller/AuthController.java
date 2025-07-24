package top.asimov.sparrow.controller;

import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public SaResult login(@RequestBody User user) {
    User exsitUser = authService.checkUserCredentials(user.getUsername(),user.getPassword());
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

  @GetMapping("/sendRegistrationVerificationCode")
  public SaResult sendVerificationCode(@RequestParam (name = "email") String email) {
    authService.sendRegistrationVerificationCode(email);
    return SaResult.ok();
  }

  @PostMapping("/register")
  public SaResult register(@RequestBody User user) {
    int result = authService.userRegister(user);
    return SaResult.ok().setData(result);
  }

  @PostMapping("/forgetPassword")
  public SaResult forgetPassword(@RequestBody User user) {
    return SaResult.ok();
  }

}
