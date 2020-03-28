package by.bsu.fpmi.webtest.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Value("${localization.supported}")
    private String localizations;

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        String[] locs = localizations.split(", ");
        for (String localization : locs) {
            registry.addViewController("/"+localization).setViewName("index.html");
        }
    }
}
