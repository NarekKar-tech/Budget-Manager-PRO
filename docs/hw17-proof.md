# HW17 Proof — Manual VPC Build: The Private Memory

## 1. Network

AWS Region: us-east-1

VPC:
- Name: narek-hw17-vpc
- CIDR: 10.17.0.0/16

Public subnet:
- Name: narek-hw17-public
- CIDR: 10.17.1.0/24

Private subnet:
- Name: narek-hw17-private
- CIDR: 10.17.2.0/24

The application host is located in the public subnet.
The PostgreSQL database host is located in the private subnet.

---

## 2. Routing

### Public subnet

Public route table:

```text
10.17.0.0/16 -> local
0.0.0.0/0    -> Internet Gateway
```

The public subnet has Internet access through the Internet Gateway.

### Private subnet

Private route table:

```text
10.17.0.0/16 -> local
```

There is no default Internet route for the private subnet.

---

## 3. NAT Gateway

No NAT Gateway was created.

```text
NAT Gateway: None
```

The private DB host does not have direct Internet access.

Required PostgreSQL packages were downloaded on the public App host and transferred to the DB host over the private network.

---

## 4. EC2 Hosts

### App Host

```text
Private IPv4: 10.17.1.32
Public IPv4: 44.193.10.196
Subnet: narek-hw17-public
Security Group: hw17-app-sg
```

The App EC2 instance has a public IPv4 address.

### Database Host

```text
Private IPv4: 10.17.2.76
Public IPv4: None
Subnet: narek-hw17-private
Security Group: hw17-db-sg
```

The database EC2 instance has no public IPv4 address.

---

## 5. Security Groups

### App Security Group — hw17-app-sg

Inbound access:

```text
TCP 22    -> My IP only
TCP 3000  -> 0.0.0.0/0
TCP 8000  -> 0.0.0.0/0
```

### Database Security Group — hw17-db-sg

PostgreSQL access:

```text
TCP 5432 -> Source: hw17-app-sg
```

Port 5432 is NOT exposed to:

```text
0.0.0.0/0
```

Therefore, PostgreSQL can be reached from the App host but is not directly exposed to the public Internet.

---

## 6. PostgreSQL Private Binding

PostgreSQL is configured to listen on the DB host private interface:

```text
10.17.2.76:5432
```

Verification command on the DB host:

```bash
sudo ss -lntp | grep 5432
```

Verified listener:

```text
LISTEN ... 10.17.2.76:5432 ...
```

Database configuration:

```text
Database: budget_manager_pro
User: budget_user
```

No database password is included in this proof.

---

## 7. Application Containers

The frontend and backend run as Docker containers on the public App EC2 host.

Verification command:

```bash
sudo docker ps
```

Expected services:

```text
budget-frontend    Up    0.0.0.0:3000->3000/tcp
budget-backend     Up    0.0.0.0:8000->8000/tcp
```

PostgreSQL does NOT run as a Docker container on the App host.

PostgreSQL runs separately on the private DB EC2 instance.

---

## 8. Backend Health Check

Health check from the App host:

```bash
curl http://127.0.0.1:8000/health
```

Successful response:

```json
{"status":"ok"}
```

This confirms that the backend container is running successfully.

---

## 9. App-to-DB Private Connectivity

The App host can reach PostgreSQL using the DB host's private IPv4 address.

Test from App EC2:

```bash
nc -vz 10.17.2.76 5432
```

Successful result:

```text
Connection to 10.17.2.76 5432 port [tcp/postgresql] succeeded!
```

The application database connection uses:

```text
DB host: 10.17.2.76
DB port: 5432
```

The database password is stored outside Git and is not included in this document.

---

## 10. Failed Public PostgreSQL Access

PostgreSQL is not publicly accessible.

The DB EC2 instance has no public IPv4 address.

The DB Security Group allows TCP/5432 only from:

```text
hw17-app-sg
```

It does NOT allow:

```text
TCP 5432 -> 0.0.0.0/0
```

### Public access test

From a local computer outside the VPC:nc: connect to 44.193.10.196 port 5432 (tcp) timed out: Operation now in progress

```bash
nc -vz -w 5 44.193.10.196 5432
```

Expected failed result:

```text
Connection timed out / connection failed
```

The App EC2 public address does not expose PostgreSQL port 5432.

### Private access test

From the App EC2 host:

```bash
nc -vz 10.17.2.76 5432
```

Successful result:Connection to 10.17.2.76 5432 port [tcp/postgresql] succeeded!

```text
Connection to 10.17.2.76 5432 port [tcp/postgresql] succeeded!
```

Therefore:

```text
Internet -> PostgreSQL: BLOCKED
App EC2  -> PostgreSQL: ALLOWED
```

PostgreSQL communication occurs over the VPC private network.

---

## 11. Cost / Managed Service Check

No paid managed networking or database service was added for this homework.

```text
NAT Gateway:       None
Load Balancer:     None
Managed Database:  None
Reserved IP:       None
```

The private DB host does not require a NAT Gateway.

PostgreSQL installation packages were transferred through the App host over the private network.

---

## 12. Architecture

```text
                    Internet
                       |
                       |
                Internet Gateway
                       |
                       |
           Public Subnet 10.17.1.0/24
                       |
                 App EC2
                 10.17.1.32
                       |
              +--------+--------+
              |                 |
          Frontend           Backend
          Docker             Docker
          :3000              :8000
                                |
                                |
                         Private VPC
                         TCP / 5432
                                |
                                |
          Private Subnet 10.17.2.0/24
                                |
                            DB EC2
                          10.17.2.76
                                |
                           PostgreSQL
                              :5432
```

---

## 13. Security Boundary Summary

The final architecture demonstrates the required public/private boundary:

- VPC CIDR is `10.17.0.0/16`.
- App EC2 is located in public subnet `10.17.1.0/24`.
- DB EC2 is located in private subnet `10.17.2.0/24`.
- App EC2 has a public IPv4 address.
- DB EC2 has no public IPv4 address.
- Public subnet has a default route through the Internet Gateway.
- Private subnet has no Internet default route.
- No NAT Gateway is used.
- Frontend and backend run as Docker containers on App EC2.
- PostgreSQL runs on the separate private DB EC2.
- PostgreSQL listens on the DB private interface.
- TCP/5432 is allowed from `hw17-app-sg` only.
- TCP/5432 is not exposed to `0.0.0.0/0`.
- App EC2 can reach PostgreSQL through `10.17.2.76:5432`.
- A public Internet client cannot reach PostgreSQL.
- Database passwords, `.env` files and SSH private keys are not committed to Git.

---

## 14. Final Result

```text
Public App EC2  -> reachable from Internet
Frontend        -> running
Backend         -> running
Health endpoint -> OK

Private DB EC2  -> no public IPv4
PostgreSQL      -> running on private IP
App -> DB       -> ALLOWED on TCP/5432
Internet -> DB  -> BLOCKED

NAT Gateway     -> NONE
```

HW17 public/private network boundary successfully implemented.
