import {
  ApiResponse,
  ApplyJobRequest,
  AuthResponse,
  CategoryResponse,
  CreateJobRequest,
  CreateReviewRequest,
  JobApplicationResponse,
  JobResponse,
  LoginRequest,
  ProviderRatingResponse,
  RegisterProviderRequest,
  RegisterUserRequest,
  ReviewResponse,
} from '@/types';
import apiClient from './axios';

// ─────────────────────────────────────────
// AUTH — returns AuthResponse directly (no ApiResponse wrapper!)
// ─────────────────────────────────────────
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  registerUser: (data: RegisterUserRequest) =>
    apiClient.post<AuthResponse>('/auth/register/user', data),

  registerProvider: (data: RegisterProviderRequest) =>
    apiClient.post<AuthResponse>('/auth/register/provider', data),
};

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────
export const categoryApi = {
  getAll: () =>
    apiClient.get<ApiResponse<CategoryResponse[]>>('/categories'),

  getById: (id: number) =>
    apiClient.get<ApiResponse<CategoryResponse>>(`/categories/${id}`),
};

// ─────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────
export const jobApi = {
  listOpen: (serviceCategoryId?: number) =>
    apiClient.get<ApiResponse<JobResponse[]>>('/jobs', {
      params: serviceCategoryId ? { serviceCategoryId } : {},
    }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<JobResponse>>(`/jobs/${id}`),

  create: (data: CreateJobRequest) =>
    apiClient.post<ApiResponse<JobResponse>>('/jobs', data),

  getMyJobs: (status?: string) =>
    apiClient.get<ApiResponse<JobResponse[]>>('/jobs/my-jobs', {
      params: status ? { status } : {},
    }),

  complete: (id: number) =>
    apiClient.post<ApiResponse<JobResponse>>(`/jobs/${id}/complete`),

  cancel: (id: number) =>
    apiClient.post<ApiResponse<JobResponse>>(`/jobs/${id}/cancel`),
};

// ─────────────────────────────────────────
// JOB APPLICATIONS
// ─────────────────────────────────────────
export const applicationApi = {
  apply: (jobId: number, data: ApplyJobRequest) =>
    apiClient.post<ApiResponse<JobApplicationResponse>>(
      `/jobs/${jobId}/apply`, data),

  getForJob: (jobId: number) =>
    apiClient.get<ApiResponse<JobApplicationResponse[]>>(
      `/jobs/${jobId}/applications`),

  getMyApplications: () =>
    apiClient.get<ApiResponse<JobApplicationResponse[]>>(
      '/jobs/my-applications'),

  accept: (jobId: number, applicationId: number) =>
    apiClient.post<ApiResponse<JobApplicationResponse>>(
      `/jobs/${jobId}/applications/${applicationId}/accept`),

  reject: (jobId: number, applicationId: number) =>
    apiClient.post<ApiResponse<JobApplicationResponse>>(
      `/jobs/${jobId}/applications/${applicationId}/reject`),
};

// ─────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────
export const reviewApi = {
  create: (jobId: number, data: CreateReviewRequest) =>
    apiClient.post<ApiResponse<ReviewResponse>>(
      `/jobs/${jobId}/review`, data),

  getForJob: (jobId: number) =>
    apiClient.get<ApiResponse<ReviewResponse>>(`/jobs/${jobId}/review`),

  getForProvider: (providerId: number) =>
    apiClient.get<ApiResponse<ProviderRatingResponse>>(
      `/providers/${providerId}/reviews`),
};