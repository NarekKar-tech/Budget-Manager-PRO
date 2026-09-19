resource "aws_iam_role" "app" {
  name = "${var.project_prefix}-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "rds_secret" {
  name = "${var.project_prefix}-rds-secret-read"
  role = aws_iam_role.app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Resource = aws_db_instance.postgres.master_user_secret[0].secret_arn
    }]
  })
}

resource "aws_iam_instance_profile" "app" {
  name = "${var.project_prefix}-app-profile"
  role = aws_iam_role.app.name
}

resource "aws_iam_role_policy" "app_env_s3" {
  name = "${var.project_prefix}-app-env-read"
  role = aws_iam_role.app.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject"
      ]
      Resource = "${aws_s3_bucket.project_storage.arn}/deployment/app.env"
    }]
  })
}