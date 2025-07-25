package top.asimov.sparrow.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import java.util.List;
import org.springframework.stereotype.Service;
import top.asimov.sparrow.mapper.ConfigMapper;
import top.asimov.sparrow.model.Config;

@Service
public class ConfigService {

  private final ConfigMapper configMapper;

  public ConfigService(ConfigMapper configMapper) {
    this.configMapper = configMapper;
  }

  public List<Config> getAllConfigs() {
    return configMapper.selectList(null);
  }

  public String getConfig(String name) {
    QueryWrapper<Config> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("name", name);
    Config config = configMapper.selectOne(queryWrapper);
    if (ObjectUtils.isEmpty(config)) {
      return null;
    }
    return config.getValue();
  }

  public String getPublicConfig(String name) {
    QueryWrapper<Config> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("name", name);
    queryWrapper.eq("is_public", 1);
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
      result += setConfig(config);
    }
    return result;
  }

  public int setConfig(Config config) {
    // check if the option exists
    QueryWrapper<Config> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("name", config.getName());
    Config existConfig = configMapper.selectOne(queryWrapper);
    if (existConfig != null) {
      // update existing option
      existConfig.setValue(config.getValue());
      return configMapper.updateById(existConfig);
    } else {
      // create new option
      Config newConfig = Config.builder()
          .name(config.getName())
          .value(config.getValue())
          .isPublic(config.getIsPublic())
          .build();
      return configMapper.insert(newConfig);
    }
  }

}
