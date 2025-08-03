package top.asimov.sparrow.annotation.handle;

import cn.dev33.satoken.annotation.handler.SaAnnotationHandlerInterface;
import cn.dev33.satoken.apikey.template.SaApiKeyUtil;
import cn.dev33.satoken.context.SaHolder;
import cn.dev33.satoken.exception.NotPermissionException;
import cn.dev33.satoken.stp.StpUtil;
import java.lang.reflect.AnnotatedElement;
import org.springframework.stereotype.Component;
import top.asimov.sparrow.annotation.SaCheckRoleOrApiKey;
import top.asimov.sparrow.constant.Role;

@Component
public class SaCheckRoleOrApiKeyHandler implements SaAnnotationHandlerInterface<SaCheckRoleOrApiKey> {

  @Override
  public Class<SaCheckRoleOrApiKey> getHandlerAnnotationClass() {
    return SaCheckRoleOrApiKey.class;
  }

  @Override
  public void checkMethod(SaCheckRoleOrApiKey at, AnnotatedElement element) {
    String apiKey = SaApiKeyUtil.readApiKeyValue(SaHolder.getRequest());

    // if has admin role or API key, skip further checks
    if (isAdmin(apiKey)) {
      return;
    }

    // Check if the user has the required requiredRole or API key
    String requiredRole = at.role();
    boolean hasRole = StpUtil.hasRole(requiredRole);
    boolean hasApiKeyScope = SaApiKeyUtil.hasApiKeyScope(apiKey, requiredRole);
    if (!hasRole && !hasApiKeyScope) {
      // If neither requiredRole nor API key scope is present, throw an exception
      throw new NotPermissionException(requiredRole);
    }
  }

  boolean isAdmin(String apiKey) {
    // Check if the user has the admin role
    boolean hasAdminRole = StpUtil.hasRole(Role.ADMIN);
    boolean hasAdminScope = SaApiKeyUtil.hasApiKeyScope(apiKey, Role.ADMIN);
    return hasAdminRole || hasAdminScope;
  }
}
