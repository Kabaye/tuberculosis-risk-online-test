package by.bsu.fpmi.webtest.model.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebTestInput {
    private Integer age;
    private Integer reactionSizeNum;
    private Boolean affectedByChernobyl;
    private Integer epidemicFactor;
    private Boolean medicalFactor;
    private Boolean socialFactor;
}
