# SeribuTukang API Documentation
**Base URL:** `http://localhost:8080/api`  
**Auth:** Bearer JWT token in `Authorization` header  
**Version:** MVP 1.0

---

## Authentication

### Register User (Pemesan)
```
POST /auth/register/user
```
**Body:**
```json
{
  "fullName": "Budi Santoso",
  "email": "budi@test.com",
  "password": "password123"
}
```
**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJ...",
    "role": "USER",
    "userId": 1,
    "email": "budi@test.com",
    "fullName": "Budi Santoso"
  }
}
```

---

### Register Provider (Tukang)
```
POST /auth/register/provider
```
**Body:**
```json
{
  "fullName": "Bu Tukang",
  "email": "butukang@test.com",
  "password": "password123",
  "specialization": "Plumber",
  "bio": "5 years experience",
  "yearsOfExperience": 5
}
```
**Response:** `201 Created` — same shape as register user

---

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "budi@test.com",
  "password": "password123"
}
```
**Response:** `200 OK` — same shape as register

---

## Jobs

### Create Job 🔐 USER only
```
POST /jobs
Authorization: Bearer {token}
```
**Body:**
```json
{
  "serviceCategoryId": 1,
  "title": "Need a plumber ASAP",
  "description": "Pipa bocor di kamar mandi lantai 2",
  "location": "Jakarta Selatan",
  "budget": 500000,
  "scheduledAt": "2026-03-25T10:00:00"
}
```
**Response:** `201 Created`

---

### List Open Jobs 🌐 Public
```
GET /jobs
GET /jobs?serviceCategoryId=1
```
**Response:** `200 OK` — array of jobs with status OPEN

---

### Get Job by ID 🌐 Public
```
GET /jobs/{id}
```

---

### My Jobs 🔐 USER only
```
GET /jobs/my-jobs
GET /jobs/my-jobs?status=OPEN
GET /jobs/my-jobs?status=ASSIGNED
GET /jobs/my-jobs?status=COMPLETED
GET /jobs/my-jobs?status=CANCELLED
Authorization: Bearer {token}
```

---

### Complete Job 🔐 USER only
```
POST /jobs/{id}/complete
Authorization: Bearer {token}
```
**Rules:** Job must be ASSIGNED. Only job owner.

---

### Cancel Job 🔐 USER only
```
POST /jobs/{id}/cancel
Authorization: Bearer {token}
```
**Rules:** Job must be OPEN or ASSIGNED. Only job owner.

---

## Job Applications

### Apply to Job 🔐 PROVIDER only
```
POST /jobs/{jobId}/apply
Authorization: Bearer {token}
```
**Body:**
```json
{
  "message": "Saya berpengalaman 5 tahun, siap kerja besok!",
  "proposedPrice": 450000
}
```
**Rules:** Job must be OPEN. Provider can only apply once.

---

### View Applications for Job 🔐 USER only
```
GET /jobs/{jobId}/applications
Authorization: Bearer {token}
```
**Rules:** Only job owner can see applications.

---

### My Applications 🔐 PROVIDER only
```
GET /jobs/my-applications
Authorization: Bearer {token}
```

---

### Accept Application 🔐 USER only
```
POST /jobs/{jobId}/applications/{applicationId}/accept
Authorization: Bearer {token}
```
**Rules:** Auto-rejects all other applications. Job moves to ASSIGNED.

---

### Reject Application 🔐 USER only
```
POST /jobs/{jobId}/applications/{applicationId}/reject
Authorization: Bearer {token}
```

---

## Reviews & Ratings

### Submit Review 🔐 USER only
```
POST /jobs/{jobId}/review
Authorization: Bearer {token}
```
**Body:**
```json
{
  "rating": 5,
  "comment": "Sangat profesional dan cepat!"
}
```
**Rules:** Job must be COMPLETED. One review per job ever.  
**Rating:** 1-5 stars only.

---

### Get Review for Job 🌐 Public
```
GET /jobs/{jobId}/review
```

---

### Get Provider Rating Page 🌐 Public
```
GET /providers/{providerId}/reviews
```
**Response:**
```json
{
  "success": true,
  "data": {
    "providerId": 2,
    "averageRating": 4.8,
    "totalReviews": 23,
    "reviews": [...]
  }
}
```

---

## Service Categories

### Create Category 🔐 Authenticated
```
POST /categories
Authorization: Bearer {token}
```
**Body:**
```json
{
  "name": "Plumbing",
  "description": "Jasa pipa dan sanitasi",
  "iconUrl": "https://cdn.seributukang.id/icons/plumbing.png"
}
```

---

### List All Active Categories 🌐 Public
```
GET /categories
```

---

### Get Category by ID 🌐 Public
```
GET /categories/{id}
```

---

### Update Category 🔐 Authenticated
```
PUT /categories/{id}
Authorization: Bearer {token}
```

---

### Delete Category (Soft Delete) 🔐 Authenticated
```
DELETE /categories/{id}
Authorization: Bearer {token}
```

---

## Users & Providers

### Get User Profile 🔐 Authenticated
```
GET /users/{id}
Authorization: Bearer {token}
```

### Get Provider Profile 🔐 Authenticated
```
GET /providers/{id}
Authorization: Bearer {token}
```

---

## Error Responses

All errors follow this shape:
```json
{
  "success": false,
  "message": "Human readable error message",
  "data": null
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 400 | Bad request / business rule violation |
| 401 | Missing or invalid token |
| 403 | Valid token but wrong role |
| 404 | Resource not found |
| 500 | Unexpected server error |

---

## Job Lifecycle
```
OPEN → (provider applies)
     → (user accepts application) → ASSIGNED
     → (user completes job)       → COMPLETED → (user reviews provider)
     → (user cancels)             → CANCELLED
```

## Application Lifecycle
```
PENDING → (user accepts) → ACCEPTED
        → (user rejects) → REJECTED
        → (another app accepted) → REJECTED (auto)
```

---

## Test Users (Development Only)

| Role | Email | Password | ID |
|------|-------|----------|----|
| USER | budi@test.com | password123 | 1 |
| PROVIDER | tukang@test.com | password123 | 1 |
| PROVIDER | butukang@test.com | password123 | 2 |