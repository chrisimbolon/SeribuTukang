// ============================================================
// SeribuTukang TypeScript Types
// Mirrors our Spring Boot DTOs exactly!
// ============================================================

// API Response wrapper — matches ApiResponse<T> in Spring Boot
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterProviderRequest {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
  bio: string;
  yearsOfExperience: number;
}

export interface AuthResponse {
  token: string;
  role: 'USER' | 'PROVIDER';
  userId: number;
  email: string;
  fullName: string;
}

// ─────────────────────────────────────────
// SERVICE CATEGORIES
// ─────────────────────────────────────────
export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────
export type JobStatus = 'OPEN' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';

export interface JobResponse {
  id: number;
  userId: number;
  serviceCategoryId: number;
  title: string;
  description: string;
  location: string;
  budget: number;
  status: JobStatus;
  scheduledAt: string | null;
  createdAt: string;
}

export interface CreateJobRequest {
  serviceCategoryId: number;
  title: string;
  description: string;
  location: string;
  budget: number;
  scheduledAt?: string;
}

// ─────────────────────────────────────────
// JOB APPLICATIONS
// ─────────────────────────────────────────
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface JobApplicationResponse {
  id: number;
  jobId: number;
  providerId: number;
  message: string;
  proposedPrice: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyJobRequest {
  message: string;
  proposedPrice?: number;
}

// ─────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────
export interface ReviewResponse {
  id: number;
  jobId: number;
  userId: number;
  providerId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProviderRatingResponse {
  providerId: number;
  averageRating: number;
  totalReviews: number;
  reviews: ReviewResponse[];
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

// ─────────────────────────────────────────
// USER / PROVIDER
// ─────────────────────────────────────────
export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProviderResponse {
  id: number;
  fullName: string;
  email: string;
  specialization: string;
  bio: string;
  yearsOfExperience: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}