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
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + id));
        return mapToResponse(job);
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

    // USER sees their own jobs — optionally filtered by status
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

    // USER marks job as COMPLETED
    @Transactional
    public JobResponse completeJob(Long jobId, Long userId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        // Only the job owner can complete it
        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You can only complete your own jobs!");
        }

        // Job must be ASSIGNED before it can be completed
        if (job.getStatus() != JobStatus.ASSIGNED) {
            throw new BadRequestException(
                    "Only ASSIGNED jobs can be marked as completed. " +
                            "Current status: " + job.getStatus());
        }

        job.setStatus(JobStatus.COMPLETED);
        return mapToResponse(jobRepository.save(job));
    }

    // USER cancels their job
    @Transactional
    public JobResponse cancelJob(Long jobId, Long userId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found with id: " + jobId));

        // Only the job owner can cancel it
        if (!job.getUserId().equals(userId)) {
            throw new BadRequestException(
                    "You can only cancel your own jobs!");
        }

        // Can only cancel OPEN or ASSIGNED jobs
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