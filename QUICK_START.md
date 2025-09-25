# 🚀 SafeGuard AI - Quick Start Guide

## ⚡ 5-Minute Setup for All Team Members

### **Step 1: Clone and Setup (2 minutes)**
```bash
# Clone the repository
git clone <your-repo-url>
cd AI-Powered-Fraud-Detection-System

# Copy environment file
cp env.example .env
```

### **Step 2: Start Development Environment (2 minutes)**
```bash
# Start all services
docker-compose up --build

# Wait for services to start (30 seconds)
# You'll see logs from all services
```

### **Step 3: Test Your Setup (1 minute)**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Blockchain**: http://localhost:8545

## 👥 Team Member Quick Start

### **🔧 Backend Developer**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
**Test**: http://localhost:8000/docs

### **🎨 Frontend Developer**
```bash
cd frontend
npm install
npm start
```
**Test**: http://localhost:3000

### **📱 Mobile Developer**
```bash
cd mobile
npm install
npx expo start
```
**Test**: Scan QR code with Expo Go app

### **⛓️ Blockchain Developer**
```bash
cd blockchain
npm install -g truffle ganache-cli
ganache-cli --port 8545
```
**Test**: http://localhost:8545

### **☁️ DevOps Engineer**
```bash
# Test Docker
docker --version
docker-compose --version

# Test AWS (if configured)
aws --version
```
**Test**: All services running in Docker

## 📋 Daily Workflow

### **Morning Setup (5 minutes)**
1. Pull latest changes: `git pull origin main`
2. Start services: `docker-compose up --build`
3. Check all services are running
4. Review your role guide for today's tasks

### **Development Workflow**
1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make changes** following your role guide
3. **Test your changes** using provided test commands
4. **Commit changes**: `git commit -m "Add your feature"`
5. **Push to GitHub**: `git push origin feature/your-feature`
6. **Create Pull Request** for code review

### **End of Day**
1. **Commit all changes**: `git add . && git commit -m "Daily progress"`
2. **Push to GitHub**: `git push origin main`
3. **Update team** on progress in Slack/Discord
4. **Stop services**: `docker-compose down`

## 🧪 Testing Your Work

### **Backend Testing**
```bash
cd backend
pytest tests/ -v --cov=app
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

### **Mobile Testing**
```bash
cd mobile
npm test
```

### **Blockchain Testing**
```bash
cd blockchain
truffle test
```

### **Full System Testing**
```bash
./scripts/test-all.sh
```

## 🚀 Deployment Options

### **Local Development**
```bash
docker-compose up --build
```

### **AWS Deployment**
```bash
./scripts/setup-aws.sh
```

### **Production Deployment**
```bash
./scripts/deploy-production.sh
```

## 📞 Team Communication

### **Slack/Discord Channels**
- **#general**: General project discussion
- **#backend**: Backend development
- **#frontend**: Frontend development
- **#blockchain**: Blockchain development
- **#devops**: Infrastructure and deployment
- **#help**: Technical help and questions

### **Daily Standups**
- **Time**: 9:00 AM daily
- **Duration**: 15 minutes
- **Format**: What you did yesterday, what you're doing today, any blockers

### **Code Reviews**
- All code must be reviewed before merging
- Request reviews from team members
- Use GitHub pull requests
- Comment on code quality and suggestions

## 🆘 Common Issues & Solutions

### **Docker Issues**
```bash
# If containers won't start
docker-compose down
docker-compose up --build --force-recreate
```

### **Port Conflicts**
```bash
# If ports are in use
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
lsof -ti:8000 | xargs kill -9  # Kill process on port 8000
```

### **Database Issues**
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### **Node.js Issues**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Python Issues**
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📚 Quick Reference

### **Key Commands**
```bash
# Start development
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Run tests
./scripts/test-all.sh

# Deploy to production
./scripts/deploy-production.sh
```

### **Important URLs**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Blockchain**: http://localhost:8545
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

### **Key Files**
- **Environment**: `.env`
- **Docker**: `docker-compose.yml`
- **Backend**: `backend/app/main.py`
- **Frontend**: `frontend/src/App.js`
- **Mobile**: `mobile/App.js`
- **Blockchain**: `blockchain/blockchain_utils.py`

## 🎯 Success Checklist

### **Daily Goals**
- [ ] All services running
- [ ] No errors in logs
- [ ] Tests passing
- [ ] Code committed and pushed
- [ ] Progress shared with team

### **Weekly Goals**
- [ ] Feature completed
- [ ] Tests written
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Integration tested

### **Project Goals**
- [ ] All features working
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Production deployed
- [ ] Demo ready

## 🆘 Emergency Contacts

### **Technical Issues**
- **Backend**: Check `backend/ROLE_GUIDE.md`
- **Frontend**: Check `frontend/ROLE_GUIDE.md`
- **Blockchain**: Check `blockchain/ROLE_GUIDE.md`
- **DevOps**: Check `scripts/ROLE_GUIDE.md`

### **Project Issues**
- **General**: Check `PROJECT_OVERVIEW.md`
- **Team**: Check `TEAM_GUIDE.md`
- **Architecture**: Check `PROJECT_STRUCTURE.md`

### **Getting Help**
1. **Check documentation** in your role guide
2. **Ask in Slack/Discord** #help channel
3. **Create GitHub issue** for bugs
4. **Ask team members** for assistance

---

**Remember**: We're building something amazing that can protect millions of people from fraud. Every contribution matters! 🛡️🇮🇳

**Let's make India's digital future safer!** 🚀✨
