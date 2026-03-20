package id.co.jasapro.seributukang.modules.jobapplication;

public enum JobApplicationStatus {
    PENDING, // Provider applied, waiting for user decision
    ACCEPTED, // User accepted this provider
    REJECTED // User rejected, or auto-rejected when another was accepted
}