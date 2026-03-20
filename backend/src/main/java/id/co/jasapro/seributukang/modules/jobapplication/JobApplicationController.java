package id.co.jasapro.seributukang.modules.jobapplication;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import id.co.jasapro.seributukang.common.ApiResponse;
import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.modules.jobapplication.dto.JobApplicationRequest;
import id.co.jasapro.seributukang.modules.jobapplication.dto.JobApplicationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    // PROVIDER applies to a job
    // POST /jobs/{jobId}/apply
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> applyToJob(
            @PathVariable Long jobId,
            @Valid @RequestBody JobApplicationRequest request,
            HttpServletRequest httpRequest) {

        Long providerId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"PROVIDER".equals(role)) {
            throw new BadRequestException("Only providers can apply to jobs!");
        }

        JobApplicationResponse response = applicationService.applyToJob(
                jobId, providerId, request);

        ApiResponse<JobApplicationResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Application submitted successfully!";
        apiResponse.data = response;

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    // USER sees all applications for their job
    // GET /jobs/{jobId}/applications
    @GetMapping("/{jobId}/applications")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getApplicationsForJob(
            @PathVariable Long jobId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only job owners can view applications!");
        }

        List<JobApplicationResponse> responses = applicationService
                .getApplicationsForJob(jobId, userId);

        ApiResponse<List<JobApplicationResponse>> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Applications retrieved successfully";
        apiResponse.data = responses;

        return ResponseEntity.ok(apiResponse);
    }

    // PROVIDER sees their own applications
    // GET /jobs/my-applications
    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getMyApplications(
            HttpServletRequest httpRequest) {

        Long providerId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"PROVIDER".equals(role)) {
            throw new BadRequestException(
                    "Only providers can view their applications!");
        }

        List<JobApplicationResponse> responses = applicationService
                .getMyApplications(providerId);

        ApiResponse<List<JobApplicationResponse>> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Your applications retrieved successfully";
        apiResponse.data = responses;

        return ResponseEntity.ok(apiResponse);
    }

    // USER accepts a provider's application
    // POST /jobs/{jobId}/applications/{applicationId}/accept
    @PostMapping("/{jobId}/applications/{applicationId}/accept")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> acceptApplication(
            @PathVariable Long jobId,
            @PathVariable Long applicationId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only job owners can accept applications!");
        }

        JobApplicationResponse response = applicationService
                .acceptApplication(jobId, applicationId, userId);

        ApiResponse<JobApplicationResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Provider accepted! Job is now ASSIGNED 🎉";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }

    // USER rejects a provider's application
    // POST /jobs/{jobId}/applications/{applicationId}/reject
    @PostMapping("/{jobId}/applications/{applicationId}/reject")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> rejectApplication(
            @PathVariable Long jobId,
            @PathVariable Long applicationId,
            HttpServletRequest httpRequest) {

        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("userRole");

        if (!"USER".equals(role)) {
            throw new BadRequestException("Only job owners can reject applications!");
        }

        JobApplicationResponse response = applicationService
                .rejectApplication(jobId, applicationId, userId);

        ApiResponse<JobApplicationResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Application rejected";
        apiResponse.data = response;

        return ResponseEntity.ok(apiResponse);
    }
}