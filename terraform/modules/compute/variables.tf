variable "project_prefix" {
  description = "Prefix used for resource names"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for ALB and ASG"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID for the ALB"
  type        = string
}

variable "aws_region" {
  type = string
}

variable "app_security_group_id" {
  type = string
}

variable "iam_instance_profile_name" {
  type = string
}

variable "storage_bucket_name" {
  type = string
}

variable "rds_address" {
  type = string
}

variable "rds_secret_arn" {
  type = string
}

variable "ssh_public_key_path" {
  type    = string
  default = "~/.ssh/hw18-aws-key.pub"
}