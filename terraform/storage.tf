resource "aws_s3_bucket" "project_storage" {
  bucket = "budget-manager-pro-hw19-narekkar-tech"

  tags = {
    Name       = "budget-manager-pro-hw19-storage"
    Assignment = "HW19"
  }
}

resource "aws_s3_bucket_public_access_block" "project_storage" {
  bucket = aws_s3_bucket.project_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "project_storage" {
  bucket = aws_s3_bucket.project_storage.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "project_storage" {
  bucket = aws_s3_bucket.project_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "project_storage" {
  bucket = aws_s3_bucket.project_storage.id

  rule {
    id     = "expire-old-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 7
    }
  }

  depends_on = [aws_s3_bucket_versioning.project_storage]
}

resource "aws_s3_object" "storage_check" {
  bucket       = aws_s3_bucket.project_storage.id
  key          = "storage-check.txt"
  content      = "Budget Manager Pro HW19 private storage verification."
  content_type = "text/plain"

  depends_on = [
    aws_s3_bucket_public_access_block.project_storage
  ]
}
