resource "aws_lb" "app" {
  name               = "${var.project_prefix}-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [var.alb_security_group_id]
  subnets         = var.public_subnet_ids

  tags = {
    Name = "${var.project_prefix}-alb"
  }
}

resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_prefix}-frontend"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/login"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "backend" {
  name        = "${var.project_prefix}-backend"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "backend_api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/*"]
    }
  }
}

resource "aws_lb_listener_rule" "backend_health" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/health"]
    }
  }
}

resource "aws_autoscaling_group" "app" {
  name = "${var.project_prefix}-asg"

  min_size         = 2
  desired_capacity = 2
  max_size         = 2

  vpc_zone_identifier = var.public_subnet_ids

  target_group_arns = [
    aws_lb_target_group.frontend.arn,
    aws_lb_target_group.backend.arn
  ]

  health_check_type         = "ELB"
  health_check_grace_period = 600

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_prefix}-asg-app"
    propagate_at_launch = true
  }
}

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
  public_key = file(pathexpand(var.ssh_public_key_path))
}

resource "aws_launch_template" "app" {
  name_prefix   = "${var.project_prefix}-app-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name

  iam_instance_profile {
    name = var.iam_instance_profile_name
  }

  vpc_security_group_ids = [
    var.app_security_group_id
  ]

  user_data = base64encode(<<-EOF
#!/bin/bash
set -euo pipefail

exec > >(tee -a /var/log/project-bootstrap.log) 2>&1

apt-get update
apt-get install -y docker.io docker-compose-v2 git postgresql-client python3 curl unzip

curl -fsSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
/tmp/aws/install

systemctl enable --now docker
usermod -aG docker ubuntu

APP_DIR=/opt/budget-manager-pro

git clone --branch hw21 --single-branch https://github.com/NarekKar-tech/Budget-Manager-PRO.git "$APP_DIR"

cd "$APP_DIR"

aws s3 cp \
  "s3://${var.storage_bucket_name}/deployment/app.env" \
  "$APP_DIR/.env" \
  --region "${var.aws_region}" \
  --only-show-errors

chmod 600 "$APP_DIR/.env"

sed -i 's|ALB_DNS_NAME|${aws_lb.app.dns_name}|g' "$APP_DIR/.env"

SECRET_JSON=$(aws secretsmanager get-secret-value \
  --secret-id "${var.rds_secret_arn}" \
  --region "${var.aws_region}" \
  --query SecretString \
  --output text)

export SECRET_JSON
export DB_HOST="${var.rds_address}"

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