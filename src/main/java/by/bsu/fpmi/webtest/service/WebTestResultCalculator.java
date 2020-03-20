package by.bsu.fpmi.webtest.service;

import by.bsu.fpmi.webtest.FileUtils;
import by.bsu.fpmi.webtest.model.rest.WebTestInput;
import by.bsu.fpmi.webtest.model.rest.WebTestResult;
import by.bsu.fpmi.webtest.model.risk.Risk;
import com.google.common.collect.Range;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

@Service
public class WebTestResultCalculator {
    public static final String AGE_COEFFICIENTS_TXT = "/data/coefficients/age_coefficients.txt";
    public static final String REACTION_SIZE_COEFFICIENTS_TXT = "/data/coefficients/reaction_size_coefficients.txt";
    public static final String EPIDEMIC_COEFFICIENTS_TXT = "/data/coefficients/epidemic_coefficients.txt";
    public static final String MEDICAL_COEFFICIENTS_TXT = "/data/coefficients/medical_coefficients.txt";
    public static final String SOCIAL_COEFFICIENTS_TXT = "/data/coefficients/medical_coefficients.txt";
    public static final String RANGES_TXT = "/data/ranges/ranges.txt";
    public static final String EMPTY = " ";

    private final Map<Integer, Double> ageCoefficients;
    private final Map<Integer, Double> reactionCoefficients;
    private final Map<Integer, Double> epidemicCoefficients;
    private final Map<Integer, Double> medicalCoefficients;
    private final Map<Integer, Double> socialCoefficients;
    private final Map<Risk, Range<Double>> ranges;

    @SneakyThrows
    public WebTestResultCalculator() {
        Map<Integer, Double> map = new HashMap<>();
        for (String line : FileUtils.readLines(AGE_COEFFICIENTS_TXT)) {
            String[] strings = line.split(EMPTY);
            map.put(Integer.valueOf(strings[0]), Double.valueOf(strings[1]));
        }
        ageCoefficients = Collections.unmodifiableMap(map);

        map = new HashMap<>();
        for (String line : FileUtils.readLines(REACTION_SIZE_COEFFICIENTS_TXT)) {
            String[] strings = line.split(EMPTY);
            map.put(Integer.valueOf(strings[0]), Double.valueOf(strings[1]));
        }
        reactionCoefficients = Collections.unmodifiableMap(map);

        map = new HashMap<>();
        for (String line : FileUtils.readLines(EPIDEMIC_COEFFICIENTS_TXT)) {
            String[] strings = line.split(EMPTY);
            map.put(Integer.valueOf(strings[0]), Double.valueOf(strings[1]));
        }
        epidemicCoefficients = Collections.unmodifiableMap(map);

        map = new HashMap<>();
        for (String line : FileUtils.readLines(MEDICAL_COEFFICIENTS_TXT)) {
            String[] strings = line.split(EMPTY);
            map.put(Integer.valueOf(strings[0]), Double.valueOf(strings[1]));
        }
        medicalCoefficients = Collections.unmodifiableMap(map);

        map = new HashMap<>();
        for (String line : FileUtils.readLines(SOCIAL_COEFFICIENTS_TXT)) {
            String[] strings = line.split(EMPTY);
            map.put(Integer.valueOf(strings[0]), Double.valueOf(strings[1]));
        }
        socialCoefficients = Collections.unmodifiableMap(map);

        Map<Risk, Range<Double>> rangeMap = new HashMap<>();
        int i = 0;
        Risk[] risks = Risk.values();
        for (String line : FileUtils.readLines(RANGES_TXT)) {
            String[] strings = line.split(EMPTY);
            rangeMap.put(risks[i++], Range.closed(Double.valueOf(strings[0]), Double.valueOf(strings[1])));
        }
        ranges = Collections.unmodifiableMap(rangeMap);
    }

    public WebTestResult calculateResult(WebTestInput webTestInput) {
        double sum = 0D;
        sum += ageCoefficients.get(webTestInput.getAge());
        sum += reactionCoefficients.get(webTestInput.getReactionSizeNum());
        sum += epidemicCoefficients.get(webTestInput.getEpidemicFactor());
        int livingInChernobylDistrict = webTestInput.getAffectedByChernobyl() ? 1 : 0;
        sum += medicalCoefficients.get(webTestInput.getMedicalFactor() ? 1 + livingInChernobylDistrict : 0);
        sum += socialCoefficients.get(webTestInput.getSocialFactor() ? 1 + livingInChernobylDistrict : 0);
        double finalSum = sum;
        Optional<Entry<Risk, Range<Double>>> entry = ranges.entrySet().stream().filter(riskRangeEntry -> riskRangeEntry.getValue().contains(finalSum)).findFirst();
        return WebTestResult.builder().risk(entry.orElseThrow(() -> new RuntimeException("Something wrong happened!")).getKey().name()).build();
    }
}
