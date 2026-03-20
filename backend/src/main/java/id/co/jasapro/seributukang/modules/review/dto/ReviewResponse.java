package id.co.jasapro.seributukang.modules.review.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long jobId;
    private Long userId;
    private Long providerId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}