package id.co.jasapro.seributukang.modules.jobapplication.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import id.co.jasapro.seributukang.modules.jobapplication.JobApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
    private Long id;
    private Long jobId;
    private Long providerId;
    private String message;
    private BigDecimal proposedPrice;
    private JobApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}