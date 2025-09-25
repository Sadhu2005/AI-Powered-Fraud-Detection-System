# SafeGuard AI - Fraud Detection System

> **India's First 360° AI-Powered Fraud Detection System**  
> Combatting ₹1000+ crores annual digital fraud losses with cutting-edge AI and blockchain technology.

[![Build Status](https://github.com/your-username/AI-Powered-Fraud-Detection-System/workflows/Build%20and%20Test/badge.svg)](https://github.com/your-username/AI-Powered-Fraud-Detection-System/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

## 🎯 The Problem We Solve

India loses **₹1000+ crores annually** to digital fraud through:
- UPI scams and fake QR codes
- Phishing SMS and emails
- Fake e-commerce websites
- Transaction anomalies
- Multi-channel scam operations

Current solutions work in silos - SafeGuard AI provides **unified 360° protection**.

## ✨ Key Features

### 🛡️ Multi-Channel Detection
- **SMS/Email Spam**: Real-time NLP analysis
- **Phishing URLs**: Domain reputation and content analysis
- **Transaction Anomalies**: Behavioral pattern detection
- **Fake Websites**: Content and metadata analysis

### 🔗 Blockchain Registry
- **Tamper-proof logging** of all fraud predictions
- **Community intelligence** through crowdsourced reporting
- **Cross-institution data sharing**
- **Digital evidence** for law enforcement

### 🚀 Advanced Technology
- **AI/ML Engine**: NLP + Computer Vision + Anomaly Detection
- **Real-time Processing**: Sub-second fraud detection
- **Scalable Architecture**: Handles millions of requests
- **Cross-Platform**: Works across banks, telcos, wallets

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (Ganache/     │
│                 │    │                 │    │    Hash Chain)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Database      │    │   Monitoring    │
│   (React Native)│    │   (SQLite/RDS)  │    │   (CloudWatch)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/AI-Powered-Fraud-Detection-System.git
cd AI-Powered-Fraud-Detection-System

# Setup environment
cp env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Option 3: AWS Deployment

```bash
# Setup AWS infrastructure
./scripts/setup-aws.sh

# Deploy with GitHub Actions
git push origin main
```

## 📁 Project Structure

```
AI-Powered-Fraud-Detection-System/
├── 📱 frontend/                 # React web application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API integration
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
├── 🔧 backend/                # FastAPI backend
│   ├── app/
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── database/         # Database models
│   │   └── utils/            # Utilities
│   ├── tests/                # Unit tests
│   └── requirements.txt      # Python dependencies
├── ⛓️ blockchain/             # Blockchain utilities
│   ├── blockchain_utils.py   # Core blockchain logic
│   ├── ganache_setup.py      # Ganache configuration
│   └── ledger.json           # Local blockchain data
├── 🐳 docker-compose.yml      # Local development
├── ☁️ docker-compose.prod.yml # Production deployment
├── 📜 scripts/               # Deployment scripts
│   ├── setup-local.sh        # Local setup
│   └── setup-aws.sh          # AWS deployment
└── 🔄 .github/workflows/     # CI/CD pipelines
    ├── build.yml             # Build and test
    └── deploy.yml            # Deployment
```

## 🛠️ Technology Stack

### Backend Technologies
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Database ORM
- **scikit-learn** - Machine learning models
- **pandas/numpy** - Data processing
- **web3.py** - Blockchain integration
- **uvicorn** - ASGI server

### Frontend Technologies
- **React 18** - Modern UI framework
- **Material-UI** - Component library
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Router** - Navigation

### Blockchain & Infrastructure
- **Ganache** - Local Ethereum blockchain
- **Docker** - Containerization
- **AWS EC2/RDS** - Cloud hosting
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy

## 📊 API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/predict/sms` | POST | SMS fraud detection |
| `/predict/url` | POST | URL phishing detection |
| `/predict/transaction` | POST | Transaction anomaly detection |
| `/predict/website` | POST | Website fraud detection |
| `/blockchain/verify` | POST | Verify blockchain integrity |
| `/blockchain/report` | POST | Report fraud case |

### Example API Usage

```bash
# SMS Fraud Detection
curl -X POST "http://localhost:8000/predict/sms" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "URGENT! Click here to verify your account!",
    "sender": "BANK-ALERT"
  }'

# URL Phishing Detection
curl -X POST "http://localhost:8000/predict/url" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://bank-security-verification.tk/verify",
    "context": "Received in SMS"
  }'
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Test complete system
docker-compose -f docker-compose.test.yml up --build
```

## 🚀 Deployment Options

### 1. Local Development
```bash
# Quick start with Docker
docker-compose up --build

# Access points:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
# - Blockchain: http://localhost:8545
```

### 2. AWS Free Tier
```bash
# Setup AWS infrastructure
./scripts/setup-aws.sh

# Deploy application
git push origin main  # Triggers GitHub Actions
```

### 3. Production Deployment
```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# Setup SSL certificates
certbot --nginx -d your-domain.com
```

## 🔒 Security Features

- **JWT Authentication** - Secure API access
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Sanitize all inputs
- **HTTPS Encryption** - Secure data transmission
- **Blockchain Integrity** - Tamper-proof logging
- **Firewall Protection** - Network security

## 📈 Monitoring & Analytics

### Local Monitoring
- **Netdata** - System metrics
- **Docker Stats** - Container monitoring
- **Log Analysis** - Application logs

### Cloud Monitoring
- **AWS CloudWatch** - Metrics and logs
- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint configuration
- **Tests**: Maintain >80% coverage
- **Documentation**: Update README for new features

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) - Interactive API docs
- [Deployment Guide](docs/deployment.md) - Detailed deployment instructions
- [Development Guide](docs/development.md) - Local development setup
- [Architecture Guide](docs/architecture.md) - System design details

## 🆘 Support & Help

### Getting Help
- 📖 **Documentation**: Check the docs folder
- 🐛 **Issues**: Create a GitHub issue
- 💬 **Discussions**: Use GitHub Discussions
- 📧 **Email**: Contact the development team

### Common Issues
- **Port conflicts**: Check if ports 3000, 8000, 8545 are available
- **Docker issues**: Ensure Docker is running
- **Database errors**: Check database connection
- **Blockchain errors**: Verify Ganache is running

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Government** - Digital India initiative
- **Open Source Community** - Amazing tools and libraries
- **Fraud Victims** - Inspiration to build better protection
- **Contributors** - Everyone who helps improve this system

---

<div align="center">

**Built with ❤️ for India's Digital Security**

[🌐 Website](https://your-domain.com) • [📱 Demo](http://localhost:3000) • [📖 Docs](http://localhost:8000/docs) • [🐛 Issues](https://github.com/your-username/AI-Powered-Fraud-Detection-System/issues)

</div>
