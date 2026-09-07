variable "aws_region" {
  type        = string
  description = "Target AWS region"
  default     = "us-east-1"
}

variable "project_prefix" {
  type        = string
  description = "Resource prefix for naming"
  default     = "budget-hw18"
}

variable "my_ip" {
  type        = string
  description = "My public IP in CIDR format, for example 1.2.3.4/32"
}

variable "db_password" {
  type        = string
  description = "PostgreSQL master password"
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 10
    error_message = "The db_password must be at least 10 characters long."
  }
}