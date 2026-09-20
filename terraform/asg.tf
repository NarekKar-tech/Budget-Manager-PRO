resource "aws_autoscaling_group" "app" {
  name = "${var.project_prefix}-asg"

  min_size         = 2
  desired_capacity = 2
  max_size         = 2

  vpc_zone_identifier = [
    aws_subnet.public_app_a.id,
    aws_subnet.public_app_b.id
  ]

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

  depends_on = [
    aws_db_instance.postgres,
    aws_iam_role_policy.rds_secret,
    aws_iam_role_policy.app_env_s3
  ]
}