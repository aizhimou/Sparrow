package top.asimov.sparrow.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import top.asimov.sparrow.mapper.ConfigMapper;
import top.asimov.sparrow.model.Config;

@Service
public class ConfigService {

  private final ConfigMapper configMapper;

  public ConfigService(ConfigMapper configMapper) {
    this.configMapper = configMapper;
  }

  public Map<String, String> getPublicConfigs() {
    List<String> publicConfigNames = List.of(
        "RegisterEnabled", "EmailVerificationEnabled", "ForgetPasswordEnabled"
    );
    List<Config> configs = getConfigsByNames(publicConfigNames);
    return configs.stream()
        .collect(Collectors.toMap(Config::getName, Config::getValue));
  }

  public List<Config> getAllConfigs() {
    return configMapper.selectList(null);
  }

  public String getConfig(String Name) {
    QueryWrapper<Config> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("name", Name);
    Config config = configMapper.selectOne(queryWrapper);
    if (ObjectUtils.isEmpty(config)) {
      return null;
    }
    return config.getValue();
  }

  public List<Config> getConfigsByNames(List<String> names) {
    QueryWrapper<Config> queryWrapper = new QueryWrapper<>();
    queryWrapper.in("name", names);
    return configMapper.selectList(queryWrapper);
  }

  public int batchSetConfigs(List<Config> configList) {
    int result = 0;
    for (Config config : configList) {
      result += setConfig(config.getName(), config.getValue());
    }
    return result;
  }

  public int setConfig(String name, String value) {
    // check if the option exists
    QueryWrapper<Config> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("name", name);
    Config existConfig = configMapper.selectOne(queryWrapper);
    if (existConfig != null) {
      // update existing option
      existConfig.setValue(value);
      return configMapper.updateById(existConfig);
    } else {
      // create new option
      Config newConfig = Config.builder().name(name).value(value).build();
      return configMapper.insert(newConfig);
    }
  }

}
