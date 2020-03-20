package by.bsu.fpmi.webtest.exception;

import by.bsu.fpmi.webtest.model.exception.APIExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class WebTestExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIExceptionResponse> handleAPIException(Exception exc) {
        return new ResponseEntity<>(APIExceptionResponse.builder()
                .exceptionMessage("API has exception with the message: " + exc.getMessage())
                .build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
