data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_prefix}-key"
  public_key = file("~/.ssh/hw18-aws-key.pub")
}

resource "aws_launch_template" "app" {
  name_prefix   = "${var.project_prefix}-app-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name

  iam_instance_profile {
    name = aws_iam_instance_profile.app.name
  }

  vpc_security_group_ids = [
    aws_security_group.app_sg.id
  ]

  user_data = base64encode(<<-EOF
  #!/bin/bash
  set -euo pipefail

  exec > >(tee -a /var/log/project-bootstrap.log) 2>&1

  apt-get update
  apt-get install -y docker.io docker-compose-v2 git postgresql-client awscli python3

  systemctl enable --now docker
  usermod -aG docker ubuntu

  APP_DIR=/opt/budget-manager-pro

  git clone --branch hw21 --single-branch https://github.com/NarekKar-tech/Budget-Manager-PRO.git "$APP_DIR"
  cd "$APP_DIR"

  # Ներբեռնում ենք երկու EC2-ների ընդհանուր կարգավորումները։
  aws s3 cp \
    "s3://${aws_s3_bucket.project_storage.bucket}/deployment/app.env" \
    "$APP_DIR/.env" \
    --region "${var.aws_region}" \
    --only-show-errors

  chmod 600 "$APP_DIR/.env"
  sed -i 's|ALB_DNS_NAME|${aws_lb.app.dns_name}|g' "$APP_DIR/.env"

  # RDS-ի գաղտնաբառը ստանում ենք AWS-ից՝ առանց լոգերում տպելու։
  SECRET_JSON=$(aws secretsmanager get-secret-value \
    --secret-id "${aws_db_instance.postgres.master_user_secret[0].secret_arn}" \
    --region "${var.aws_region}" \
    --query SecretString \
    --output text)

  export SECRET_JSON
  export DB_HOST="${aws_db_instance.postgres.address}"

  python3 - <<'PY'
import json
import os
from pathlib import Path
from urllib.parse import quote

credentials = json.loads(os.environ["SECRET_JSON"])
username = quote(credentials["username"], safe="")
password = quote(credentials["password"], safe="")
host = os.environ["DB_HOST"]

database_url = (
    f"postgresql+psycopg2://{username}:{password}"
    f"@{host}:5432/budget_manager_pro"
)

env_path = Path("/opt/budget-manager-pro/.env")
with env_path.open("a") as env_file:
    env_file.write(f"\nDATABASE_URL={database_url}\n")
PY

  unset SECRET_JSON DB_HOST

  docker compose up -d --build

  echo "Application deployment completed"
EOF
  )

  block_device_mappings {
    device_name = "/dev/sda1"

    ebs {
      volume_size = 20
      volume_type = "gp3"
    }
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${var.project_prefix}-asg-app"
    }
  }
}