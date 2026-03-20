package id.co.jasapro.seributukang.modules.job;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.job.dto.JobRequest;
import id.co.jasapro.seributukang.modules.job.dto.JobResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    // ─────────────────────────────────────────
    // PUBLIC API — for other modules to call
    // ─────────────────────────────────────────

    // Get raw Job entity — used by jobapplication + review modules
    public Job getJobOrThrow(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));
    }

    // Is this job OPEN? — used by jobapplication module
    public boolean isJobOpen(Long jobId) {
        return getJobOrThrow(jobId).getStatus() == JobStatus.OPEN;
    }

    // Is this job COMPLETED? — used by review module
    public boolean isJobCompleted(Long jobId) {
        return getJobOrThrow(jobId).getStatus() == JobStatus.COMPLETED;
    }

    // Does this user own this job? — used by review module
    public boolean isJobOwnedByUser(Long jobId, Long userId) {
        return getJobOrThrow(jobId).getUserId().equals(userId);
    }

    // Get job status — used by jobapplication module
    public JobStatus getJobStatus(Long jobId) {
        return getJobOrThrow(jobId).getStatus();
    }

    // Get job owner — used by jobapplication module
    public Long getJobOwnerId(Long jobId) {
        return getJobOrThrow(jobId).getUserId();
    }

    // Mark job as ASSIGNED — called by jobapplication module
    @Transactional
    public void markJobAsAssigned(Long jobId) {
        Job job = getJobOrThrow(jobId);
        job.setStatus(JobStatus.ASSIGNED);
        jobRepository.save(job);
    }

    // ─────────────────────────────────────────
    // INTERNAL — own module operations
    // ─────────────────────────────────────────

    @Transactional
    public JobResponse createJob(Long userId, JobRequest request) {
        Job job = new Job(
                userId,
                request.getServiceCategoryId(),
                request.getTitle(),
                request.getDescription(),
                request.getLocation(),
                request.getBudget(),
                request.getScheduledAt());
        return mapToResponse(jobRepository.save(job));
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        return mapToResponse(getJobOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<JobResponse> listOpenJobs(Long serviceCategoryId) {
        List<Job> jobs;
        if (serviceCategoryId != null) {
            jobs = jobRepository.findByServiceCategoryIdAndStatus(
                    serviceCategoryId, JobStatus.OPEN);
        } else {
            jobs = jobRepository.findByStatus(JobStatus.OPEN);
        }
        return jobs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs(Long userId, JobStatus status) {
        List<Job> jobs;
        if (status != null) {
            jobs = jobRepository.findByUserIdAndStatus(userId, status);
        } else {
            jobs = jobRepository.findByUserId(userId);
        }
        return jobs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public JobResponse completeJob(Long jobId, Long userId) {
        Job job = getJobOrThrow(jobId);

        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException("You can only complete your own jobs!");
        }
        if (job.getStatus() != JobStatus.ASSIGNED) {
            throw new BadRequestException(
                    "Only ASSIGNED jobs can be marked as completed. " +
                            "Current status: " + job.getStatus());
        }

        job.setStatus(JobStatus.COMPLETED);
        return mapToResponse(jobRepository.save(job));
    }

    @Transactional
    public JobResponse cancelJob(Long jobId, Long userId) {
        Job job = getJobOrThrow(jobId);

        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own jobs!");
        }
        if (job.getStatus() == JobStatus.COMPLETED) {
            throw new BadRequestException(
                    "Cannot cancel a job that is already COMPLETED!");
        }
        if (job.getStatus() == JobStatus.CANCELLED) {
            throw new BadRequestException("Job is already CANCELLED!");
        }

        job.setStatus(JobStatus.CANCELLED);
        return mapToResponse(jobRepository.save(job));
    }

    private JobResponse mapToResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getUserId(),
                job.getServiceCategoryId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getBudget(),
                job.getStatus(),
                job.getScheduledAt(),
                job.getCreatedAt());
    }
}