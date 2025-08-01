package top.asimov.sparrow.controller;

import cn.dev33.satoken.annotation.SaCheckRole;
import cn.dev33.satoken.util.SaResult;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.constant.Role;
import top.asimov.sparrow.model.User;
import top.asimov.sparrow.service.UserService;

@RestController
@RequestMapping("/api/user")
@SaCheckRole(Role.ADMIN)
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/list")
  public SaResult listUsers(@RequestParam(required = false) String keyword,
                            @RequestParam(defaultValue = "1") Integer page,
                            @RequestParam(defaultValue = "10") Integer size) {
    return SaResult.data(userService.listUsers(keyword, new Page<>(page, size)));
  }

  @PostMapping("/add")
  public SaResult addUser(@RequestBody User user) {
    userService.addUser(user);
    return SaResult.data(user);
  }

  @PostMapping("/forbid")
  public SaResult forbidUser(@RequestBody User user) {
    userService.forbidUser(user.getId());
    return SaResult.data(user);
  }

  @PostMapping("/enable")
  public SaResult enableUser(@RequestBody User user) {
    userService.enableUser(user.getId());
    return SaResult.data(user);
  }

}
