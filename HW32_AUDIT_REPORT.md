# HW32 — Helm Chart Audit Report

## Project
Budget Manager Pro

## Environment
- Kubernetes: Minikube
- Namespace: hw32
- Helm Release: budget
- Helm Chart: budget-manager-pro
- Chart Version: 0.1.0

## Helm Resources
- Frontend Deployment and Service
- Backend Deployment and Service
- PostgreSQL Deployment and Service
- PostgreSQL PersistentVolumeClaim
- Kubernetes Secret
- Kubernetes Ingress

## Validation
- helm lint: PASSED
- helm template: PASSED
- helm install --dry-run: PASSED
- helm install: PASSED
- PostgreSQL connection: PASSED
- Frontend to Backend API: HTTP 401 (expected)
- helm upgrade: PASSED
- helm rollback: PASSED

## Deployment
- Frontend image: budget-frontend:v1.6
- Backend image: budget-backend:v1.4
- PostgreSQL image: postgres:15-alpine

## Security
- Sensitive values stored in values-local.yaml
- values-local.yaml excluded from Git
- Kubernetes Secret used for application credentials

## Rollback
- Initial installation: Revision 1
- Upgrade: Revision 2
- Rollback: Revision 3
- Backend restored to 1 replica

## Result
Helm Chart successfully deployed and tested
in the hw32 Kubernetes namespace.
