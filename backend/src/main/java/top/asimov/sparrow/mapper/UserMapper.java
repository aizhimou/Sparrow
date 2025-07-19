package top.asimov.sparrow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import top.asimov.sparrow.model.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}
