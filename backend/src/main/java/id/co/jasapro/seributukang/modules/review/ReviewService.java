package id.co.jasapro.seributukang.modules.review;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.job.Job;
import id.co.jasapro.seributukang.modules.job.JobRepository;
import id.co.jasapro.seributukang.modules.job.JobStatus;
import id.co.jasapro.seributukang.modules.jobapplication.JobApplication;
import id.co.jasapro.seributukang.modules.jobapplication.JobApplicationRepository;
import id.co.jasapro.seributukang.modules.jobapplication.JobApplicationStatus;
import id.co.jasapro.seributukang.modules.review.dto.ProviderRatingResponse;
import id.co.jasapro.seributukang.modules.review.dto.ReviewRequest;
import id.co.jasapro.seributukang.modules.review.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    // USER submits a review after job completion
    @Transactional
    public ReviewResponse createReview(Long jobId, Long userId,
            ReviewRequest request) {

        // 1. Job must exist
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        // 2. Only the job owner can review
        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You can only review jobs that you posted!");
        }

        // 3. Job MUST be COMPLETED — no review without completion!
        if (job.getStatus() != JobStatus.COMPLETED) {
            throw new BadRequestException(
                    "You can only review COMPLETED jobs. " +
                            "Current status: " + job.getStatus());
        }

        // 4. One review per job — ever!
        reviewRepository.findByJobId(jobId).ifPresent(existing -> {
            throw new BadRequestException(
                    "You have already reviewed this job!");
        });

        // 5. Find the ACCEPTED provider for this job
        JobApplication acceptedApplication = applicationRepository
                .findByJobIdAndStatus(jobId, JobApplicationStatus.ACCEPTED)
                .stream()
                .findFirst()
                .orElseThrow(() -> new BadRequestException(
                        "No accepted provider found for this job!"));

        Long providerId = acceptedApplication.getProviderId();

        // 6. Create the review!
        Review review = new Review(
                jobId,
                userId,
                providerId,
                request.getRating(),
                request.getComment());

        return mapToResponse(reviewRepository.save(review));
    }

    // Get all reviews + rating summary for a provider (public)
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

        // Round to 1 decimal — e.g. 4.666... → 4.7
        if (averageRating != null) {
            averageRating = Math.round(averageRating * 10.0) / 10.0;
        }

        return new ProviderRatingResponse(
                providerId,
                averageRating != null ? averageRating : 0.0,
                totalReviews,
                reviews);
    }

    // Get the review for a specific job
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