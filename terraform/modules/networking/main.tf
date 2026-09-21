resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_prefix}-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_prefix}-igw"
  }
}

resource "aws_subnet" "public_app_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidrs.public_app_a
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_prefix}-public-app-subnet-a"
  }
}

resource "aws_subnet" "public_app_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidrs.public_app_b
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_prefix}-public-app-subnet-b"
  }
}

resource "aws_subnet" "private_db_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.subnet_cidrs.private_db_a
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "${var.project_prefix}-private-db-subnet-a"
  }
}

resource "aws_subnet" "private_db_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.subnet_cidrs.private_db_b
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "${var.project_prefix}-private-db-subnet-b"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.project_prefix}-public-rt"
  }
}

resource "aws_route_table_association" "public_app_a" {
  subnet_id      = aws_subnet.public_app_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_app_b" {
  subnet_id      = aws_subnet.public_app_b.id
  route_table_id = aws_route_table.public.id
}