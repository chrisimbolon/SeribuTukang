package id.co.jasapro.seributukang.modules.review.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProviderRatingResponse {
    private Long providerId;
    private Double averageRating; // e.g. 4.7
    private Long totalReviews; // e.g. 23
    private List<ReviewResponse> reviews;
}