package top.asimov.sparrow.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Locale;
import org.springframework.web.servlet.LocaleResolver;

public class HeaderLocaleResolver implements LocaleResolver {

  @Override
  public Locale resolveLocale(HttpServletRequest request) {
    String language = request.getHeader("Accept-Language");
    return (language == null || language.isEmpty()) ? Locale.getDefault() : Locale.forLanguageTag(language);
  }

  @Override
  public void setLocale(HttpServletRequest request, HttpServletResponse response, Locale locale) {

  }

}
