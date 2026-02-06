# ContractGuard - Complete Setup & Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### 1. Clone Repository
```bash
git clone https://github.com/contractguard/platform.git
cd contractguard
```

### 2. Environment Setup
```bash
# Copy example environment
cp .env.example .env
cp backend/.env.example backend/.env

# Edit .env with your API keys
nano .env
# Required:
# - OPENAI_API_KEY
# - PINECONE_API_KEY
# - PINECONE_ENVIRONMENT
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - SENDGRID_API_KEY
# - JWT_SECRET_KEY (generate: openssl rand -hex 32)
```

### 3. Frontend Setup (React)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Opens: http://localhost:5173
```

### 4. Backend Setup (FastAPI)
```bash
# Option A: With Docker (Recommended)
docker-compose up -d

# Option B: Manual setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../backend_requirements.txt

# Initialize database
alembic upgrade head

# Start server
uvicorn app.main:app --reload

# API: http://localhost:8000
# Docs: http://localhost:8000/api/docs
```

### 5. Verify Setup
```bash
# Check all services
docker-compose ps

# Test API
curl http://localhost:8000/health

# Should return:
# {"status": "healthy", "version": "1.0.0", "service": "ContractGuard"}
```

---

## Production Deployment (AWS)

### Architecture Overview
```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
ALB (Load Balancer)
    ↓
ECS Fargate (App)
    ↓
RDS (Database) + S3 (Storage) + Pinecone (Vectors)
```

### Step-by-Step Deployment

#### Phase 1: AWS Infrastructure Setup

**1. Create VPC & Networking**
```bash
# VPC for ContractGuard
- CIDR: 10.0.0.0/16
- Public subnets: 10.0.1.0/24, 10.0.2.0/24 (Multi-AZ)
- Private subnets: 10.0.11.0/24, 10.0.12.0/24
- NAT Gateway for private subnet egress
- Internet Gateway for public subnet
```

**2. RDS PostgreSQL Setup**
```bash
aws rds create-db-instance \
  --db-instance-identifier contractguard-prod \
  --db-instance-class db.t3.small \
  --engine postgres \
  --engine-version 15.3 \
  --master-username contractguard \
  --master-user-password ${DB_PASSWORD} \
  --allocated-storage 100 \
  --backup-retention-period 30 \
  --multi-az \
  --storage-encrypted \
  --deletion-protection

# Create read replica for scaling
aws rds create-db-instance-read-replica \
  --db-instance-identifier contractguard-prod-replica \
  --source-db-instance-identifier contractguard-prod
```

**3. S3 Bucket for Contracts**
```bash
aws s3api create-bucket \
  --bucket contractguard-contracts \
  --region us-east-1 \
  --create-bucket-configuration LocationConstraint=us-east-1

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket contractguard-contracts \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket contractguard-contracts \
  --versioning-configuration Status=Enabled

# Lifecycle policy (archive old contracts)
aws s3api put-bucket-lifecycle-configuration \
  --bucket contractguard-contracts \
  --lifecycle-configuration file://lifecycle.json
```

**4. Secrets Manager**
```bash
# Store sensitive data
aws secretsmanager create-secret \
  --name contractguard/api-keys \
  --secret-string '{
    "openai_api_key": "sk-...",
    "pinecone_api_key": "...",
    "sendgrid_api_key": "...",
    "jwt_secret": "..."
  }'

# RDS credentials
aws secretsmanager create-secret \
  --name rds!db-contractguard-prod \
  --secret-string '{
    "username": "contractguard",
    "password": "...",
    "engine": "postgres",
    "host": "contractguard-prod.xxx.rds.amazonaws.com",
    "port": 5432,
    "dbname": "contractguard_db"
  }'
```

**5. IAM Roles & Policies**
```bash
# Create ECS task execution role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Create ECS task role
aws iam create-role \
  --role-name contractguardTaskRole \
  --assume-role-policy-document file://trust-policy.json

# Attach S3, RDS, Secrets policies
aws iam put-role-policy \
  --role-name contractguardTaskRole \
  --policy-name inline-policy \
  --policy-document file://task-policy.json
```

#### Phase 2: Containerization & ECR

**1. Build & Push Docker Image**
```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name contractguard-api \
  --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t contractguard:1.0.0 -f Dockerfile .

# Tag for ECR
docker tag contractguard:1.0.0 \
  ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/contractguard-api:1.0.0

# Push to ECR
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/contractguard-api:1.0.0
```

**2. Create ECS Cluster**
```bash
# Create cluster
aws ecs create-cluster --cluster-name contractguard-prod

# Create task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json
```

**3. ECS Task Definition (ecs-task-definition.json)**
```json
{
  "family": "contractguard-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/contractguardTaskRole",
  "containerDefinitions": [
    {
      "name": "contractguard-api",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/contractguard-api:1.0.0",
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        },
        {
          "name": "LOG_LEVEL",
          "value": "info"
        }
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:contractguard/api-keys:openai_api_key::"
        },
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:rds!db-contractguard-prod::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/contractguard",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**4. Create ECS Service**
```bash
aws ecs create-service \
  --cluster contractguard-prod \
  --service-name contractguard-api \
  --task-definition contractguard-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxx,subnet-yyy],
    securityGroups=[sg-xxx],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=contractguard-api,containerPort=8000" \
  --auto-scaling-target-group-arn arn:aws:elasticloadbalancing:...
```

#### Phase 3: Load Balancing & DNS

**1. Application Load Balancer**
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name contractguard-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx \
  --scheme internet-facing

# Create target group
aws elbv2 create-target-group \
  --name contractguard-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxx \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

**2. HTTPS/SSL**
```bash
# Request ACM certificate
aws acm request-certificate \
  --domain-name api.contractguard.app \
  --domain-name "*.contractguard.app" \
  --validation-method DNS

# Add HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn arn:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:...
```

**3. Route 53 DNS**
```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name contractguard.app \
  --caller-reference $(date +%s)

# Create DNS records
aws route53 change-resource-record-sets \
  --hosted-zone-id Z... \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.contractguard.app",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z...",
          "DNSName": "contractguard-alb-...elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }'
```

#### Phase 4: Monitoring & Auto-Scaling

**1. CloudWatch Logs**
```bash
aws logs create-log-group --log-group-name /ecs/contractguard

aws logs create-log-stream \
  --log-group-name /ecs/contractguard \
  --log-stream-name api
```

**2. CloudWatch Alarms**
```bash
# High error rate
aws cloudwatch put-metric-alarm \
  --alarm-name contractguard-api-errors \
  --alarm-description "Alert on API errors" \
  --metric-name HTTPRequestCount \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:alerts

# High latency
aws cloudwatch put-metric-alarm \
  --alarm-name contractguard-api-latency \
  --metric-name TargetResponseTime \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 300 \
  --threshold 1.0 \
  --comparison-operator GreaterThanThreshold
```

**3. Auto-Scaling**
```bash
# Create scaling policy
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/contractguard-prod/contractguard-api \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# CPU-based scaling
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/contractguard-prod/contractguard-api \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }'
```

#### Phase 5: Database Migrations

```bash
# Connect to RDS
psql -h contractguard-prod.xxx.rds.amazonaws.com \
     -U contractguard \
     -d contractguard_db

# Run migrations
cd backend
alembic upgrade head

# Verify schema
\dt  # list tables
```

---

## Monitoring & Observability

### Application Metrics (CloudWatch)
- API latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- LLM API cost tracking
- Contract processing time
- Vector DB performance

### Logs
- API request/response logs
- Error stack traces
- LLM API interactions
- Database query performance

### Alerts
- Error rate > 1%
- Processing time > 2 standard deviations
- Service unavailable
- Cost spikes (LLM API)

---

## Scaling Checklist

### 100-1K Users
- [x] Single ECS task (2 instances, load balanced)
- [x] RDS single-AZ → Multi-AZ
- [x] S3 versioning enabled
- [x] Basic monitoring

### 1K-10K Users
- [x] Auto-scaling policy (CPU-based)
- [x] RDS read replicas
- [x] Pinecone index scaling
- [x] CloudFront CDN for static assets
- [x] Redis cluster for caching

### 10K+ Users
- [x] Multi-region deployment (us-east-1, eu-west-1)
- [x] Global load balancer
- [x] Global Accelerator
- [x] SQS/SNS for async tasks
- [x] DynamoDB for session management

---

## Backup & Disaster Recovery

### Database Backups
```bash
# Daily snapshots (30-day retention)
aws rds describe-db-instances --query 'DBInstances[0].BackupRetentionPeriod'

# Cross-region backup
aws rds create-db-instance-read-replica \
  --db-instance-identifier contractguard-replica \
  --source-db-instance-identifier contractguard-prod \
  --source-region us-east-1 \
  --destination-region eu-west-1
```

### S3 Disaster Recovery
- Cross-region replication enabled
- MFA Delete protection
- Lifecycle policies for compliance

---

## Cost Optimization

| Service | Estimate | Optimization |
|---------|----------|--------------|
| ECS Fargate | $100-150/mo | Reserved instances, spot pricing |
| RDS | $80-120/mo | Reserved instances, read replicas |
| S3 | $20-50/mo | Lifecycle policies, compression |
| OpenAI API | Metered | Model caching, batch processing |
| Total | ~$250-400/mo | Can scale to $1-2k/mo at 10k users |

---

## Troubleshooting

```bash
# Check ECS service logs
aws logs tail /ecs/contractguard --follow

# Check ECS task status
aws ecs describe-tasks --cluster contractguard-prod --tasks <task-arn>

# Check database connection
psql -h contractguard-prod.xxx.rds.amazonaws.com -U contractguard -d contractguard_db -c "SELECT 1"

# Check API health
curl https://api.contractguard.app/health

# Monitor LLM costs
aws cloudwatch get-metric-statistics \
  --namespace ContractGuard \
  --metric-name LLMApiCost \
  --start-time 2024-02-01T00:00:00Z \
  --end-time 2024-02-06T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## Support & Documentation

- **API Docs**: https://api.contractguard.app/api/docs
- **Architecture Guide**: See BACKEND_ARCHITECTURE.md
- **Project Lifecycle**: See PROJECT_LIFECYCLE.md
- **AI Prompts**: See AI_PROMPTS_LIBRARY.md
