package id.co.jasapro.seributukang.modules.jobapplication;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.job.JobService;
import id.co.jasapro.seributukang.modules.job.JobStatus;
import id.co.jasapro.seributukang.modules.jobapplication.dto.JobApplicationRequest;
import id.co.jasapro.seributukang.modules.jobapplication.dto.JobApplicationResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

        private final JobApplicationRepository applicationRepository;
        private final JobService jobService; // ✅ talks to service, not repository!

        // ─────────────────────────────────────────
        // PUBLIC API — for other modules to call
        // ─────────────────────────────────────────

        // Who was accepted for this job? — used by review module
        public Long getAcceptedProviderForJob(Long jobId) {
                return applicationRepository
                                .findByJobIdAndStatus(jobId, JobApplicationStatus.ACCEPTED)
                                .stream()
                                .findFirst()
                                .map(JobApplication::getProviderId)
                                .orElseThrow(() -> new BadRequestException(
                                                "No accepted provider found for this job!"));
        }

        // ─────────────────────────────────────────
        // INTERNAL — own module operations
        // ─────────────────────────────────────────

        @Transactional
        public JobApplicationResponse applyToJob(Long jobId, Long providerId,
                        JobApplicationRequest request) {

                // Ask JobService — don't touch jobs table directly! ✅
                JobStatus status = jobService.getJobStatus(jobId);
                if (status != JobStatus.OPEN) {
                        throw new BadRequestException(
                                        "Cannot apply to a job with status: " + status);
                }

                // Provider can't apply to their own job
                Long jobOwnerId = jobService.getJobOwnerId(jobId);
                if (jobOwnerId.equals(providerId)) {
                        throw new BadRequestException(
                                        "You cannot apply to your own job!");
                }

                // Provider can't apply twice
                applicationRepository.findByJobIdAndProviderId(jobId, providerId)
                                .ifPresent(existing -> {
                                        throw new BadRequestException(
                                                        "You have already applied to this job!");
                                });

                JobApplication application = new JobApplication(
                                jobId,
                                providerId,
                                request.getMessage(),
                                request.getProposedPrice());

                return mapToResponse(applicationRepository.save(application));
        }

        @Transactional(readOnly = true)
        public List<JobApplicationResponse> getApplicationsForJob(
                        Long jobId, Long userId) {

                // Verify job exists and belongs to this user
                Long jobOwnerId = jobService.getJobOwnerId(jobId);
                if (!jobOwnerId.equals(userId)) {
                        throw new BadRequestException(
                                        "You can only view applications for your own jobs!");
                }

                return applicationRepository.findByJobId(jobId)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<JobApplicationResponse> getMyApplications(Long providerId) {
                return applicationRepository.findByProviderId(providerId)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public JobApplicationResponse acceptApplication(Long jobId,
                        Long applicationId, Long userId) {

                // Ask JobService for ownership + status ✅
                Long jobOwnerId = jobService.getJobOwnerId(jobId);
                if (!jobOwnerId.equals(userId)) {
                        throw new BadRequestException(
                                        "You can only manage applications for your own jobs!");
                }

                JobStatus jobStatus = jobService.getJobStatus(jobId);
                if (jobStatus != JobStatus.OPEN) {
                        throw new BadRequestException(
                                        "This job is no longer open for acceptance!");
                }

                JobApplication application = applicationRepository
                                .findById(applicationId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Application not found with id: " + applicationId));

                if (!application.getJobId().equals(jobId)) {
                        throw new BadRequestException(
                                        "Application does not belong to this job!");
                }

                if (application.getStatus() != JobApplicationStatus.PENDING) {
                        throw new BadRequestException(
                                        "This application is already " + application.getStatus());
                }

                // Accept this application
                application.setStatus(JobApplicationStatus.ACCEPTED);
                applicationRepository.save(application);

                // Auto-reject all other PENDING applications
                applicationRepository
                                .findByJobIdAndStatus(jobId, JobApplicationStatus.PENDING)
                                .forEach(other -> {
                                        other.setStatus(JobApplicationStatus.REJECTED);
                                        applicationRepository.save(other);
                                });

                // Tell JobService to mark job as ASSIGNED ✅
                jobService.markJobAsAssigned(jobId);

                return mapToResponse(application);
        }

        @Transactional
        public JobApplicationResponse rejectApplication(Long jobId,
                        Long applicationId, Long userId) {

                Long jobOwnerId = jobService.getJobOwnerId(jobId);
                if (!jobOwnerId.equals(userId)) {
                        throw new BadRequestException(
                                        "You can only manage applications for your own jobs!");
                }

                JobApplication application = applicationRepository
                                .findById(applicationId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Application not found with id: " + applicationId));

                if (!application.getJobId().equals(jobId)) {
                        throw new BadRequestException(
                                        "Application does not belong to this job!");
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