package id.co.jasapro.seributukang.modules.jobapplication.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JobApplicationRequest {

    @NotBlank(message = "Message is required — tell the customer why you're the best tukang!")
    private String message;

    private BigDecimal proposedPrice;
}