package id.co.jasapro.seributukang.modules.job.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JobRequest {

    @NotNull(message = "Service category ID is required")
    private Long serviceCategoryId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String location;
    private BigDecimal budget;
    private LocalDateTime scheduledAt;
}