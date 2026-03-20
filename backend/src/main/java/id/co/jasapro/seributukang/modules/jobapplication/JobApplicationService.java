package id.co.jasapro.seributukang.modules.jobapplication;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.job.Job;
import id.co.jasapro.seributukang.modules.job.JobRepository;
import id.co.jasapro.seributukang.modules.job.JobStatus;
import id.co.jasapro.seributukang.modules.jobapplication.dto.JobApplicationRequest;
import id.co.jasapro.seributukang.modules.jobapplication.dto.JobApplicationResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    // PROVIDER applies to a job
    @Transactional
    public JobApplicationResponse applyToJob(Long jobId, Long providerId,
            JobApplicationRequest request) {

        // 1. Job must exist
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        // 2. Job must be OPEN — can't apply to ASSIGNED/COMPLETED/CANCELLED
        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException(
                    "Cannot apply to a job with status: " + job.getStatus());
        }

        // 3. Provider can't apply twice to the same job
        applicationRepository.findByJobIdAndProviderId(jobId, providerId)
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "You have already applied to this job!");
                });

        // 4. Provider can't apply to their own job
        // (edge case — a provider might also be registered as a user)
        if (job.getUserId().equals(providerId)) {
            throw new BadRequestException("You cannot apply to your own job!");
        }

        // 5. Create the application
        JobApplication application = new JobApplication(
                jobId,
                providerId,
                request.getMessage(),
                request.getProposedPrice());

        return mapToResponse(applicationRepository.save(application));
    }

    // USER sees all applications for their job
    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsForJob(Long jobId, Long userId) {

        // Verify job exists and belongs to this user
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You can only view applications for your own jobs!");
        }

        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // PROVIDER sees all their own applications
    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getMyApplications(Long providerId) {
        return applicationRepository.findByProviderId(providerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // USER accepts a provider — THE MONEY MOMENT! 💰
    @Transactional
    public JobApplicationResponse acceptApplication(Long jobId, Long applicationId,
            Long userId) {

        // 1. Verify job belongs to this user
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You can only manage applications for your own jobs!");
        }

        // 2. Job must still be OPEN
        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException(
                    "This job is no longer open for acceptance!");
        }

        // 3. Find the specific application
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + applicationId));

        // 4. Application must belong to this job
        if (!application.getJobId().equals(jobId)) {
            throw new BadRequestException("Application does not belong to this job!");
        }

        // 5. Application must be PENDING
        if (application.getStatus() != JobApplicationStatus.PENDING) {
            throw new BadRequestException(
                    "This application is already " + application.getStatus());
        }

        // 6. Accept this application
        application.setStatus(JobApplicationStatus.ACCEPTED);
        applicationRepository.save(application);

        // 7. Auto-reject all other PENDING applications for this job 🔥
        applicationRepository
                .findByJobIdAndStatus(jobId, JobApplicationStatus.PENDING)
                .forEach(other -> {
                    other.setStatus(JobApplicationStatus.REJECTED);
                    applicationRepository.save(other);
                });

        // 8. Mark the job as ASSIGNED
        job.setStatus(JobStatus.ASSIGNED);
        jobRepository.save(job);

        return mapToResponse(application);
    }

    // USER rejects a specific application
    @Transactional
    public JobApplicationResponse rejectApplication(Long jobId, Long applicationId,
            Long userId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You can only manage applications for your own jobs!");
        }

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + applicationId));

        if (!application.getJobId().equals(jobId)) {
            throw new BadRequestException("Application does not belong to this job!");
        }

        if (application.getStatus() != JobApplicationStatus.PENDING) {
            throw new BadRequestException(
                    "This application is already " + application.getStatus());
        }

        application.setStatus(JobApplicationStatus.REJECTED);
        return mapToResponse(applicationRepository.save(application));
    }

    private JobApplicationResponse mapToResponse(JobApplication app) {
        return new JobApplicationResponse(
                app.getId(),
                app.getJobId(),
                app.getProviderId(),
                app.getMessage(),
                app.getProposedPrice(),
                app.getStatus(),
                app.getCreatedAt(),
                app.getUpdatedAt());
    }
}