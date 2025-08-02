package top.asimov.sparrow.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
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

  @PostMapping("/logout")
  public SaResult logout() {
    StpUtil.logout();
    return SaResult.ok("Logout successful");
  }

  @GetMapping("/send-registration-verification-code")
  public SaResult sendVerificationCode(@RequestParam(name = "email") String email) {
    authService.sendRegistrationVerificationCode(email);
    return SaResult.ok();
  }

  @PostMapping("/register")
  public SaResult register(@RequestBody User user) {
    int result = authService.userRegister(user);
    return SaResult.ok().setData(result);
  }

  @GetMapping("/send-forget-password-verification-code")
  public SaResult sendForgetPasswordVerificationCode(@RequestParam(name = "email") String email) {
    authService.sendForgetPasswordVerificationCode(email);
    return SaResult.ok();
  }

  @PostMapping("/forget-password")
  public SaResult forgetPassword(@RequestBody User user) {
    authService.forgetPassword(user);
    return SaResult.ok();
  }

}
