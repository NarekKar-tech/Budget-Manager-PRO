# HW19 Compute and Storage Decision

## Phase 1 - Existing HW18 Infrastructure

Provider: AWS

Existing resources reused from HW18:

- VPC: `aws_vpc.main`
- Public application subnet: `aws_subnet.public_app`
- Private database subnets:
  - `aws_subnet.private_db_a`
  - `aws_subnet.private_db_b`
- Application host: `aws_instance.app`
- Managed PostgreSQL: `aws_db_instance.postgres`
- RDS subnet group: `aws_db_subnet_group.rds_subnets`
- Application security group: `aws_security_group.app_sg`
- Database security group: `aws_security_group.db_sg`

Terraform verification:

```text
terraform validate
Success! The configuration is valid.

terraform plan
No changes. Your infrastructure matches the configuration.

## Phase 2 - Protected Object Storage

A private Amazon S3 bucket was added to the existing HW18 Terraform stack for a small, non-sensitive project storage check.

Bucket configuration:

- Bucket: `budget-manager-pro-hw19-narekkar-tech`
- Public access block: enabled
- Object versioning: enabled
- Server-side encryption: AES256
- Lifecycle rule: noncurrent versions expire after 7 days
- Test object: `storage-check.txt`
- No public bucket policy was added
- No credentials, database dumps, or personal data were uploaded

Terraform planned six new S3-related resources:

```text
Plan: 6 to add, 0 to change, 0 to destroy.


### Phase 3

```markdown
## Phase 3 - Safe Bootstrap Improvement

A safe bootstrap candidate was created:

`terraform/scripts/init.sh`

The script performs harmless and repeatable checks for:

- current timestamp
- hostname
- Docker availability
- Docker Compose availability

It may write its results to:

`/var/log/project-bootstrap.log`

The script contains no passwords, tokens, private keys, or application secrets.

The script was temporarily referenced from the existing EC2 resource using:

```hcl
user_data = file("${path.module}/scripts/init.sh")

## Phase 4 - Storage Verification

The HW19 S3 bucket was successfully created without modifying the existing HW18 infrastructure.

Verified properties:

- Public access is blocked:
  - BlockPublicAcls: true
  - IgnorePublicAcls: true
  - BlockPublicPolicy: true
  - RestrictPublicBuckets: true
- Versioning: Enabled
- Server-side encryption: AES256
- Lifecycle rule:
  - noncurrent object versions expire after 7 days
- Test object:
  - `storage-check.txt`
  - readable only through authenticated AWS access

Verification result:

```text
Budget Manager Pro HW19 private storage verification.

## Phase 5 - Compute and Storage Decision

### Why RDS Instead of Self-Managed PostgreSQL

| Area | PostgreSQL on EC2 | AWS RDS PostgreSQL |
|---|---|---|
| Patching | Manual OS and PostgreSQL maintenance | AWS manages much of the database maintenance |
| Backups | Must be configured and maintained manually | Managed backups and snapshots |
| Scaling | Manual VM and storage management | Managed scaling options |
| Private networking | Must be configured and maintained manually | Integrated with VPC and private DB subnets |
| Operations | OS, PostgreSQL, recovery and maintenance are our responsibility | Lower operational overhead |
| Cost | May be cheaper for simple workloads but requires more administration | Managed service cost with reduced operational work |

For Budget Manager Pro, the existing private RDS PostgreSQL database is preferable because it reduces database administration while providing managed backup capabilities and clean integration with the application's private AWS network.

### Storage Decision

The S3 bucket is used only for a small, non-sensitive project storage verification object.

Access boundary:

- Public access is blocked.
- Access requires an authenticated AWS identity.
- Versioning is enabled.
- Server-side encryption uses AES256.
- Noncurrent versions expire after 7 days.

### Cleanup Plan

After verification, only the HW19 S3 object and bucket resources will be removed.

The existing HW18 infrastructure will remain unchanged:

- VPC
- public application subnet
- private database subnets
- EC2 application host
- private RDS PostgreSQL database
- route table
- security groups

The entire HW18 Terraform stack will NOT be destroyed during HW19.
