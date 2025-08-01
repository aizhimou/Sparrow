package top.asimov.sparrow.controller;

import cn.dev33.satoken.util.SaResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.service.ConfigService;

@RestController
@RequestMapping("/api/public")
public class PubController {

  private final ConfigService configService;

  public PubController(ConfigService configService) {
    this.configService = configService;
  }

  @GetMapping("/config")
  public SaResult getPublicConfig(@RequestParam(name = "name") String name) {
    String configValue = configService.getPublicConfig(name);
    return SaResult.ok().setData(configValue);
  }

}
