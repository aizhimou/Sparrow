package top.asimov.sparrow.controller;

import cn.dev33.satoken.util.SaResult;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.model.Config;
import top.asimov.sparrow.service.ConfigService;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

  private final ConfigService configService;

  public ConfigController(ConfigService configService) {
    this.configService = configService;
  }

  @GetMapping("/public")
  public SaResult getPublicConfig() {
    Map<String, String> publicConfigs = configService.getPublicConfigs();
    return SaResult.ok().setData(publicConfigs);
  }

  @GetMapping("/all")
  public SaResult getAllConfigs() {
    List<Config> allConfigs = configService.getAllConfigs();
    return SaResult.ok().setData(allConfigs);
  }

  @GetMapping("/name")
  public SaResult getConfig(@RequestParam(name = "name") String name) {
    String optionValue = configService.getConfig(name);
    return SaResult.ok().setData(optionValue);
  }

  @PostMapping("/name")
  public SaResult setConfig(@RequestBody Config config) {
    int result = configService.setConfig(config.getName(), config.getValue());
    return SaResult.ok().setData(result);
  }

  @PostMapping("/batch")
  public SaResult batchSetConfigs(@RequestBody List<Config> configList) {
    int result = configService.batchSetConfigs(configList);
    return SaResult.ok().setData(result);
  }

}
