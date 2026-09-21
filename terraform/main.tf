module "networking" {
  source = "./modules/networking"

  project_prefix = var.project_prefix
  aws_region      = var.aws_region
  environment     = var.environment

  vpc_cidr = "10.18.0.0/16"

  subnet_cidrs = {
    public_app_a = "10.18.1.0/24"
    public_app_b = "10.18.4.0/24"
    private_db_a = "10.18.2.0/24"
    private_db_b = "10.18.3.0/24"
  }
}

module "compute" {
  source = "./modules/compute"

  project_prefix = var.project_prefix
  aws_region     = var.aws_region

  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids

  alb_security_group_id = aws_security_group.alb_sg.id
  app_security_group_id = aws_security_group.app_sg.id

  iam_instance_profile_name = aws_iam_instance_profile.app.name

  storage_bucket_name = aws_s3_bucket.project_storage.bucket

  rds_address    = aws_db_instance.postgres.address
  rds_secret_arn = aws_db_instance.postgres.master_user_secret[0].secret_arn

  depends_on = [
    aws_db_instance.postgres,
    aws_iam_role_policy.rds_secret,
    aws_iam_role_policy.app_env_s3
  ]
}