package id.co.jasapro.seributukang.modules.jobapplication;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // All applications for a specific job (for the job owner to review)
    List<JobApplication> findByJobId(Long jobId);

    // All applications by a specific provider (their dashboard)
    List<JobApplication> findByProviderId(Long providerId);

    // Check if provider already applied to this job
    Optional<JobApplication> findByJobIdAndProviderId(Long jobId, Long providerId);

    // All PENDING applications for a job (to auto-reject when one is accepted)
    List<JobApplication> findByJobIdAndStatus(Long jobId, JobApplicationStatus status);
}