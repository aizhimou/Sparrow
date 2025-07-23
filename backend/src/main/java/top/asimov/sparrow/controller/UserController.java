package top.asimov.sparrow.controller;

import cn.dev33.satoken.util.SaResult;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/list")
  public SaResult listUsers(@RequestParam(required = false) String name,
                            @RequestParam(required = false) String email,
                            @RequestParam(defaultValue = "1") Integer page,
                            @RequestParam(defaultValue = "10") Integer size) {
    User user = User.builder().username(name).email(email).build();
    return SaResult.data(userService.listUsers(user, new Page<>(page, size)));
  }

  @PostMapping("/add")
  public SaResult addUser(@RequestBody User user) {
    userService.addUser(user);
    return SaResult.data(user);
  }

  @PostMapping("/forbid")
  public SaResult forbidUser(@RequestBody String userId) {
    User user = userService.forbidUser(userId);
    return SaResult.data(user);
  }

  @PostMapping("/enable")
  public SaResult enableUser(@RequestBody String userId) {
    User user = userService.enableUser(userId);
    return SaResult.data(user);
  }

  @PostMapping("/upgrade")
  public SaResult upgradeUser(@RequestBody String userId) {
    User user = userService.upgradeUser(userId);
    return SaResult.data(user);
  }

  @PostMapping("/downgrade")
  public SaResult downgradeUser(@RequestBody String userId) {
    User user = userService.downgradeUser(userId);
    return SaResult.data(user);
  }

}
