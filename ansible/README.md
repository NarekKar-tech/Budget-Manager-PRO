# HW15 — AWS EC2 Deployment with Ansible

## AWS Setup

* S3 Bucket: `genesis-budget-hw15`
* AWS Region: `US-EAST-1`
* EC2 Instance Type: `t3.micro`
* Operating System: Ubuntu 24.04 LTS
* EC2 Instance Name: `my-project-HW15`

## Ansible Execution

Ansible was used to configure the EC2 instance, install Docker and Docker Compose, clone the project repository, copy the environment file, and start the Docker Compose stack.

Command used:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

## Application Verification

The backend was verified using:

```bash
curl http://YOUR_EC2_PUBLIC_IP:8000/health
```

Output:{"status":"ok"}


```text
PASTE_YOUR_CURL_OUTPUT_HERE
```

Docker containers were also verified with:

```bash
ansible app -i ansible/inventory.ini -b -a "docker ps"
```

## Ansible Idempotency Proof

The playbook was executed a second time to confirm idempotency.

```text
PLAY RECAP
ec2-server : ok=7 changed=0 unreachable=0 failed=0 skipped=0 rescued=0 ignored=0
```

This confirms that running the playbook again did not make unnecessary configuration changes.

## Teardown Confirmation

After completing and verifying the homework:

* EC2 instance was terminated.
* S3 bucket was emptied and deleted.
* SSH `.pem` key and AWS credentials were not committed to Git.

## Security

The following sensitive files are excluded from Git:

```text
.env
*.pem
```

