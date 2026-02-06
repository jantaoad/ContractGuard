# ContractGuard - Backend Infrastructure

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration management
│   ├── dependencies.py         # Dependency injection
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── contracts.py    # Contract upload/analysis
│   │   │   ├── analysis.py     # Analysis & RAG endpoints
│   │   │   ├── alerts.py       # Alert management
│   │   │   └── dashboard.py    # Dashboard metrics
│   │   └── middleware.py       # Custom middleware
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py            # User model
│   │   ├── contract.py        # Contract model
│   │   ├── clause.py          # Clause model
│   │   └── alert.py           # Alert model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py            # Pydantic schemas
│   │   ├── contract.py
│   │   ├── analysis.py
│   │   └── alert.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py    # Authentication logic
│   │   ├── contract_service.py # Contract management
│   │   ├── rag_service.py     # RAG orchestration
│   │   ├── llm_service.py     # LLM interactions
│   │   ├── vector_service.py  # Vector DB operations
│   │   ├── alert_service.py   # Alert logic
│   │   └── ocr_service.py     # Document extraction
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py         # Database session
│   │   └── base.py            # SQLAlchemy base
│   └── utils/
│       ├── __init__.py
│       ├── logger.py          # Logging utilities
│       ├── exceptions.py      # Custom exceptions
│       └── validators.py      # Input validation
├── tests/
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_contracts.py
│   └── test_rag.py
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Backend container
└── README.md
```

## Tech Stack

### Core
- **FastAPI**: Async web framework
- **Uvicorn**: ASGI server
- **SQLAlchemy**: ORM

### Database & Vector Search
- **PostgreSQL**: Relational database
- **Pinecone**: Vector database for RAG
- **LangChain**: RAG orchestration

### AI/ML
- **OpenAI API**: GPT-4o for analysis
- **spaCy**: Named Entity Recognition
- **pytesseract/textract**: OCR

### Content Processing
- **PyPDF2**: PDF handling
- **python-docx**: DOCX handling
- **Celery**: Async task queue
- **Redis**: Task broker

### Security
- **Passlib**: Password hashing
- **python-jose**: JWT tokens
- **python-multipart**: File uploads

### Utilities
- **Pydantic**: Data validation
- **Alembic**: Database migrations
- **Pytest**: Testing
- **boto3**: AWS S3 integration
- **sendgrid**: Email notifications

## Key Services

### 1. RAG Service (rag_service.py)
```
Input: Contract text
├─ Chunk documents
├─ Create embeddings
├─ Store in Pinecone
└─ Return vector IDs

Retrieval flow:
├─ User query
├─ Embed query
├─ Search Pinecone
├─ Retrieve top-k similar chunks
└─ Pass to LLM with context
```

### 2. LLM Service (llm_service.py)
```
Responsibilities:
├─ Contract summarization
├─ Risk classification
├─ Clause extraction
├─ Obligation identification
└─ Explanation generation
```

### 3. Vector Service (vector_service.py)
```
Pinecone operations:
├─ Create index
├─ Upsert embeddings
├─ Search by similarity
├─ Delete on contract removal
└─ Maintain metadata
```

### 4. OCR Service (ocr_service.py)
```
Document extraction:
├─ AWS Textract (PDF/Images)
├─ spaCy NER (PII detection)
├─ Text cleaning
└─ Page mapping
```

## API Endpoints (High-Level)

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT
- `POST /api/v1/auth/logout` - Logout

### Contracts
- `POST /api/v1/contracts/upload` - Upload & analyze
- `GET /api/v1/contracts` - List user contracts
- `GET /api/v1/contracts/{id}` - Get contract details
- `DELETE /api/v1/contracts/{id}` - Delete contract
- `PUT /api/v1/contracts/{id}/tags` - Update tags

### Analysis
- `GET /api/v1/analysis/{contract_id}` - Get stored analysis
- `POST /api/v1/analysis/{contract_id}/clarify` - RAG-based question
- `GET /api/v1/analysis/{contract_id}/clauses` - Extracted clauses
- `GET /api/v1/analysis/{contract_id}/risks` - Risk analysis

### Alerts
- `GET /api/v1/alerts` - List alerts
- `POST /api/v1/alerts/{id}/send` - Send alert email
- `PUT /api/v1/alerts/{id}/dismiss` - Dismiss alert

### Dashboard
- `GET /api/v1/dashboard/metrics` - Dashboard data
- `GET /api/v1/dashboard/compliance` - Compliance summary
- `GET /api/v1/dashboard/timeline` - Key dates timeline

## Database Schema

### users
```sql
id, email, name, password_hash, role, organization_id, 
subscription_tier, created_at, updated_at
```

### contracts
```sql
id, organization_id, file_name, s3_key, status, uploaded_at,
uploaded_by, last_modified, summary, risk_level, risk_score,
compliance_score, renewal_date, vendor, counterparty
```

### clauses
```sql
id, contract_id, category, text, page_number, risk_level,
explanation, vector_ids (Pinecone)
```

### vector_embeddings (Pinecone)
```
id, contract_id, text, metadata{
  page_number, clause_category, risk_level, clause_id
}
```

### alerts
```sql
id, contract_id, type, severity, title, message, sent, 
sent_at, created_at, dismissed_at
```

## Deployment

### AWS Infrastructure
- **ECS Fargate**: Container orchestration
- **RDS PostgreSQL**: Managed database
- **S3**: Contract file storage
- **CloudWatch**: Logs & monitoring
- **Secrets Manager**: API keys
- **ALB**: Load balancing

### Scaling Strategy
| Users | Approach |
|-------|----------|
| 100 | Single ECS service |
| 1k | Auto-scaling + CloudFront caching |
| 10k+ | Multi-AZ, read replicas, Pinecone scaling |

## Security

- SOC 2 Type I compliance
- AES-256 encryption at rest
- TLS 1.3 in transit
- Role-based access control (RBAC)
- JWT token authentication
- Rate limiting
- Input validation & sanitization
- CORS configuration
- Audit logging
