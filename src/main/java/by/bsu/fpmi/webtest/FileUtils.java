package by.bsu.fpmi.webtest;

import lombok.SneakyThrows;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class FileUtils {
    private FileUtils() {
    }

    @SneakyThrows
    public static List<String> readLines(URI fileURI) {
        return Files.readAllLines(Paths.get(fileURI));
    }

    @SneakyThrows
    public static URI getFileURI(String path) {
        return Thread.currentThread().getContextClassLoader().getResource(path).toURI();
    }
}
