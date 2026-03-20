package id.co.jasapro.seributukang.modules.review;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.job.JobService;
import id.co.jasapro.seributukang.modules.jobapplication.JobApplicationService;
import id.co.jasapro.seributukang.modules.review.dto.ProviderRatingResponse;
import id.co.jasapro.seributukang.modules.review.dto.ReviewRequest;
import id.co.jasapro.seributukang.modules.review.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final JobService jobService; // ✅ service call
    private final JobApplicationService applicationService; // ✅ service call

    @Transactional
    public ReviewResponse createReview(Long jobId, Long userId,
            ReviewRequest request) {

        // Ask JobService — clean boundary! ✅
        if (!jobService.isJobOwnedByUser(jobId, userId)) {
            throw new BadRequestException(
                    "You can only review jobs that you posted!");
        }

        if (!jobService.isJobCompleted(jobId)) {
            throw new BadRequestException(
                    "You can only review COMPLETED jobs. Current status: "
                            + jobService.getJobStatus(jobId));
        }

        // One review per job
        reviewRepository.findByJobId(jobId).ifPresent(existing -> {
            throw new BadRequestException(
                    "You have already reviewed this job!");
        });

        // Ask JobApplicationService — clean boundary! ✅
        Long providerId = applicationService
                .getAcceptedProviderForJob(jobId);

        Review review = new Review(
                jobId,
                userId,
                providerId,
                request.getRating(),
                request.getComment());

        return mapToResponse(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public ProviderRatingResponse getProviderReviews(Long providerId) {
        List<ReviewResponse> reviews = reviewRepository
                .findByProviderId(providerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Double averageRating = reviewRepository
                .getAverageRatingByProviderId(providerId);

        Long totalReviews = reviewRepository.countByProviderId(providerId);

        if (averageRating != null) {
            averageRating = Math.round(averageRating * 10.0) / 10.0;
        }

        return new ProviderRatingResponse(
                providerId,
                averageRating != null ? averageRating : 0.0,
                totalReviews,
                reviews);
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReviewByJobId(Long jobId) {
        Review review = reviewRepository.findByJobId(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No review found for job: " + jobId));
        return mapToResponse(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getJobId(),
                review.getUserId(),
                review.getProviderId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt());
    }
}