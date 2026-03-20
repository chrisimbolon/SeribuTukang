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

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest request,
            HttpServletRequest httpRequest) {

        // Extract userId from JWT (set by JwtAuthFilter)
        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        // Only USERs (pemesan) can create jobs, not PROVIDERs
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse response = jobService.getJobById(id);

        ApiResponse<JobResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Job retrieved successfully";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> listOpenJobs(
            @RequestParam(name = "serviceCategoryId", required = false) Long serviceCategoryId) {

        List<JobResponse> jobs = jobService.listOpenJobs(serviceCategoryId);

        ApiResponse<List<JobResponse>> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Jobs retrieved successfully";
        apiResponse.data = jobs;

        return ResponseEntity.ok(apiResponse);
    }
}