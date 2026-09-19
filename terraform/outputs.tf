output "alb_dns_name" {
  description = "Public DNS name of the Application Load Balancer"
  value       = aws_lb.app.dns_name
}

output "rds_endpoint" {
  description = "Private endpoint of the RDS instance"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_address" {
  description = "Private hostname of the RDS instance"
  value       = aws_db_instance.postgres.address
}