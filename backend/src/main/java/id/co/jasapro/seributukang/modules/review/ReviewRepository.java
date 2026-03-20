package id.co.jasapro.seributukang.modules.review;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Check if a review already exists for this job
    Optional<Review> findByJobId(Long jobId);

    // All reviews for a provider (public profile)
    List<Review> findByProviderId(Long providerId);

    // All reviews written by a user
    List<Review> findByUserId(Long userId);

    // Calculate provider's average rating — THE TRUST SCORE! ⭐
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.providerId = :providerId")
    Double getAverageRatingByProviderId(@Param("providerId") Long providerId);

    // Count total reviews for a provider
    Long countByProviderId(Long providerId);
}