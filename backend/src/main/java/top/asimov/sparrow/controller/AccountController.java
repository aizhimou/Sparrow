package top.asimov.sparrow.controller;

import cn.dev33.satoken.util.SaResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.AccountService;

@RestController
@RequestMapping("/api/account")
public class AccountController {

  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @PostMapping("/resetPassword")
  public SaResult resetPassword(@RequestBody User user) {
    accountService.resetPassword(user.getId(), user.getPassword(), user.getNewPassword());
    return SaResult.data(user);
  }

  @PostMapping("/sendVerificationEmail")
  public SaResult sendVerificationEmail(@RequestBody User user) {
    accountService.sendBindEmailVerificationCode(user.getId(), user.getEmail());
    return SaResult.ok();
  }

  @PostMapping("/bindEmail")
  public SaResult bindEmail(@RequestBody User user) {
    accountService.bindEmail(user.getId(), user.getEmail(), user.getVerificationCode());
    return SaResult.ok();
  }

}
