output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of public application subnets"
  value = [
    aws_subnet.public_app_a.id,
    aws_subnet.public_app_b.id
  ]
}

output "private_db_subnet_ids" {
  description = "IDs of private database subnets"
  value = [
    aws_subnet.private_db_a.id,
    aws_subnet.private_db_b.id
  ]
}