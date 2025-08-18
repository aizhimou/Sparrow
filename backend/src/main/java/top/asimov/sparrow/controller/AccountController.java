package top.asimov.sparrow.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.annotation.SaCheckRoleOrApiKey;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.AccountService;

@RestController
@RequestMapping("/api/account")
@SaCheckRoleOrApiKey
public class AccountController {

  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/info")
  public SaResult info() {
    String userId = (String) StpUtil.getLoginId();
    User user = accountService.getUserInfo(userId);
    return SaResult.data(user);
  }

  @PostMapping("/change-username")
  public SaResult changeUsername(@RequestBody User user) {
    return SaResult.data(accountService.changeUsername(user.getId(), user.getUsername()));
  }

  @GetMapping("/generate-api-key")
  public SaResult generateApiKey() {
    String apiKey = accountService.generateApiKey();
    return SaResult.data(apiKey);
  }

  @PostMapping("/reset-password")
  public SaResult resetPassword(@RequestBody User user) {
    accountService.resetPassword(user.getId(), user.getPassword(), user.getNewPassword());
    return SaResult.data(user);
  }

  @PostMapping("/send-verification-email")
  public SaResult sendVerificationEmail(@RequestBody User user) {
    accountService.sendBindEmailVerificationCode(user.getId(), user.getEmail());
    return SaResult.ok();
  }

  @PostMapping("/bind-email")
  public SaResult bindEmail(@RequestBody User user) {
    accountService.bindEmail(user.getId(), user.getEmail(), user.getVerificationCode());
    return SaResult.ok();
  }

}
