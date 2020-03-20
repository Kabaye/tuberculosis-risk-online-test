package by.bsu.fpmi.webtest;

import lombok.SneakyThrows;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

public class FileUtils {
    private FileUtils() {
    }

    @SneakyThrows
    public static List<String> readLines(String path) {
        return new BufferedReader(new InputStreamReader(FileUtils.class.getResourceAsStream(path)))
                .lines()
                .collect(Collectors.toList());
    }
}
