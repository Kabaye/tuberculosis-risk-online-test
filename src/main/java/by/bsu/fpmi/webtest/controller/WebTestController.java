package by.bsu.fpmi.webtest.controller;

import by.bsu.fpmi.webtest.model.rest.WebTestInput;
import by.bsu.fpmi.webtest.model.rest.WebTestResult;
import by.bsu.fpmi.webtest.service.WebTestResultCalculator;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/web-test")
@ResponseStatus(HttpStatus.OK)
public class WebTestController {

    private final WebTestResultCalculator webTestResultCalculator;

    public WebTestController(WebTestResultCalculator webTestResultCalculator) {
        this.webTestResultCalculator = webTestResultCalculator;
    }

    @PostMapping("/calculate")
    public WebTestResult calculateResult(@RequestBody WebTestInput webTestInput) {
        return webTestResultCalculator.calculateResult(webTestInput);
    }
}
