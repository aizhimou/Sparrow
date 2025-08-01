package top.asimov.sparrow.config;

import cn.dev33.satoken.model.wrapperInfo.SaDisableWrapperInfo;
import cn.dev33.satoken.stp.StpInterface;
import cn.dev33.satoken.stp.StpUtil;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class StpInterfaceImpl implements StpInterface {

  @Override
  public List<String> getPermissionList(Object loginId, String loginType) {
    return List.of();
  }

  @Override
  public List<String> getRoleList(Object loginId, String loginType) {
    String role = (String) StpUtil.getSession().get("role");
    return List.of(role);
  }

  @Override
  public SaDisableWrapperInfo isDisabled(Object loginId, String service) {
    return StpInterface.super.isDisabled(loginId, service);
  }
}
