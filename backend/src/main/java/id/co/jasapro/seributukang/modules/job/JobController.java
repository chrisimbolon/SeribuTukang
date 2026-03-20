package id.co.jasapro.seributukang.modules.job;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import id.co.jasapro.seributukang.common.ApiResponse;
import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.modules.job.dto.JobRequest;
import id.co.jasapro.seributukang.modules.job.dto.JobResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // POST /jobs — USER creates a job
    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest request,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only users can create jobs");
        }

        JobResponse response = jobService.createJob(userId, request);

        ApiResponse<JobResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Job created successfully";
        apiResponse.data = response;

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    // GET /jobs — public, list open jobs
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> listOpenJobs(
            @RequestParam(required = false) Long serviceCategoryId) {

        List<JobResponse> jobs = jobService.listOpenJobs(serviceCategoryId);

        ApiResponse<List<JobResponse>> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Jobs retrieved successfully";
        apiResponse.data = jobs;

        return ResponseEntity.ok(apiResponse);
    }

    // GET /jobs/my-jobs — USER sees their own jobs
    @GetMapping("/my-jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs(
            @RequestParam(required = false) String status,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only users can view their jobs!");
        }

        // Parse status if provided
        JobStatus jobStatus = null;
        if (status != null) {
            try {
                jobStatus = JobStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException(
                        "Invalid status. Must be: OPEN, ASSIGNED, COMPLETED, CANCELLED");
            }
        }

        List<JobResponse> jobs = jobService.getMyJobs(userId, jobStatus);

        ApiResponse<List<JobResponse>> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Your jobs retrieved successfully";
        apiResponse.data = jobs;

        return ResponseEntity.ok(apiResponse);
    }

    // GET /jobs/{id} — public
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable Long id) {

        JobResponse response = jobService.getJobById(id);

        ApiResponse<JobResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Job retrieved successfully";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }

    // POST /jobs/{id}/complete — USER marks job as done
    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<JobResponse>> completeJob(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only job owners can complete jobs!");
        }

        JobResponse response = jobService.completeJob(id, userId);

        ApiResponse<JobResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Job completed! Don't forget to leave a review 🌟";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }

    // POST /jobs/{id}/cancel — USER cancels their job
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<JobResponse>> cancelJob(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only job owners can cancel jobs!");
        }

        JobResponse response = jobService.cancelJob(id, userId);

        ApiResponse<JobResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Job cancelled";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }
}