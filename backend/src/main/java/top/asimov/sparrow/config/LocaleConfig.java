package top.asimov.sparrow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;

@Component
public class LocaleConfig {

  @Bean
  public LocaleResolver localeResolver() {
    return new HeaderLocaleResolver();
  }
}
