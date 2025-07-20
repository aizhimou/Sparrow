package top.asimov.sparrow.controller;

import cn.dev33.satoken.util.SaResult;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.model.Option;
import top.asimov.sparrow.service.OptionService;

@RestController
@RequestMapping("/api/options")
public class OptionController {

  private final OptionService optionService;

  public OptionController(OptionService optionService) {
    this.optionService = optionService;
  }

  @GetMapping("/key")
  public SaResult getOption(@RequestParam(name = "key") String key) {
    String optionValue = optionService.getOption(key);
    return SaResult.ok().setData(optionValue);
  }

  @GetMapping("/topic")
  public SaResult getOptionsByTopic(@RequestParam(name = "topic") String topic) {
    Map<String, String> options = optionService.getOptionsByTopic(topic);
    return SaResult.ok().setData(options);
  }

  @PostMapping("/key")
  public SaResult setOption(@RequestBody Option option) {
    int result = optionService.setOption(option.getKey(), option.getValue());
    return SaResult.ok().setData(result);
  }

  @PostMapping("/batch")
  public SaResult batchSetOptions(@RequestBody Map<String, String> options) {
    int result = optionService.batchSetOptions(options);
    return SaResult.ok().setData(result);
  }

}
