package top.asimov.sparrow.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import java.security.PublicKey;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.mapper.OptionMapper;
import top.asimov.sparrow.model.Option;

@Service
public class OptionService {

  private final OptionMapper optionMapper;

  public OptionService(OptionMapper optionMapper) {
    this.optionMapper = optionMapper;
  }

  public String getOption(String key) {
    QueryWrapper<Option> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("key", key);
    Option option = optionMapper.selectOne(queryWrapper);
    if (ObjectUtils.isEmpty(option)) {
      return null;
    }
    return option.getValue();
  }

  public Map<String, String> getOptionsByTopic(String topic) {
    QueryWrapper<Option> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("topic", topic);
    queryWrapper.select("key", "value");
    return optionMapper.selectMaps(queryWrapper).stream()
        .collect(Collectors.toMap(map -> (String) map.get("key"), map -> (String) map.get("value")));
  }

  public int batchSetOptions(Map<String, String> options) {
    int result = 0;
    for (Map.Entry<String, String> entry : options.entrySet()) {
      result += setOption(entry.getKey(), entry.getValue());
    }
    return result;
  }

  public int setOption(String key, String value) {
    // check if the option exists
    QueryWrapper<Option> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("key", key);
    Option existOption = optionMapper.selectOne(queryWrapper);
    if (existOption != null) {
      // update existing option
      existOption.setValue(value);
      return optionMapper.updateById(existOption);
    } else {
      // create new option
      Option newOption = Option.builder().key(key).value(value).build();
      return optionMapper.insert(newOption);
    }
  }

}
