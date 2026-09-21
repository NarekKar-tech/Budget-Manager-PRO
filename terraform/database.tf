resource "aws_db_subnet_group" "rds_subnets" {
  name        = "${var.project_prefix}-db-subnet-group"
  description = "RDS subnet group across two Availability Zones"

  subnet_ids = module.networking.private_db_subnet_ids

  tags = {
    Name = "${var.project_prefix}-db-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier          = "${var.project_prefix}-rds"
  snapshot_identifier = "budget-hw18-final-backup"

  instance_class        = "db.t3.micro"
  allocated_storage     = 20
  max_allocated_storage = 20
  storage_type          = "gp3"

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.rds_subnets.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  publicly_accessible     = false
  multi_az                = false
  skip_final_snapshot     = true
  backup_retention_period = 0
  deletion_protection     = false

  tags = {
    Name = "${var.project_prefix}-postgres-rds"
  }
}