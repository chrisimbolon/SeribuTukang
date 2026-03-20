package id.co.jasapro.seributukang.modules.review;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import id.co.jasapro.seributukang.common.ApiResponse;
import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.modules.review.dto.ProviderRatingResponse;
import id.co.jasapro.seributukang.modules.review.dto.ReviewRequest;
import id.co.jasapro.seributukang.modules.review.dto.ReviewResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // POST /jobs/{jobId}/review — USER reviews after completion
    @PostMapping("/jobs/{jobId}/review")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long jobId,
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException(
                    "Only users can leave reviews!");
        }

        ReviewResponse response = reviewService.createReview(
                jobId, userId, request);

        ApiResponse<ReviewResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Review submitted! Terima kasih! ⭐";
        apiResponse.data = response;

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    // GET /jobs/{jobId}/review — get review for a job (public)
    @GetMapping("/jobs/{jobId}/review")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewByJob(
            @PathVariable Long jobId) {

        ReviewResponse response = reviewService.getReviewByJobId(jobId);

        ApiResponse<ReviewResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Review retrieved successfully";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }

    // GET /providers/{providerId}/reviews — provider's full rating page (public)
    @GetMapping("/providers/{providerId}/reviews")
    public ResponseEntity<ApiResponse<ProviderRatingResponse>> getProviderReviews(
            @PathVariable Long providerId) {

        ProviderRatingResponse response = reviewService
                .getProviderReviews(providerId);

        ApiResponse<ProviderRatingResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Provider reviews retrieved successfully";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }
}