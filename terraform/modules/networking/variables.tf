variable "project_prefix" {
  description = "Prefix used for resource names"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "subnet_cidrs" {
  description = "CIDR blocks for public and private subnets"

  type = object({
    public_app_a = string
    public_app_b = string
    private_db_a = string
    private_db_b = string
  })
}

variable "environment" {
  description = "Environment name"
  type        = string
}