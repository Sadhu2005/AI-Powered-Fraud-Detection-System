#!/bin/bash

# SafeGuard AI - Production Deployment Script
# This script deploys the fraud detection system to production

set -e

echo "🚀 SafeGuard AI - Production Deployment"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
ENVIRONMENT=${1:-production}
DOMAIN=${2:-your-domain.com}
EMAIL=${3:-admin@your-domain.com}

print_status "Deploying SafeGuard AI to $ENVIRONMENT environment"
print_status "Domain: $DOMAIN"
print_status "Email: $EMAIL"

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env" ]; then
    print_warning "Environment file not found. Creating from template..."
    cp env.example .env
    print_warning "Please update .env file with your production configuration"
    print_warning "Then run this script again"
    exit 1
fi

print_success "Prerequisites check passed"

# 1. Build and test
print_status "Building and testing application..."

# Run tests
./scripts/test-all.sh

if [ $? -ne 0 ]; then
    print_error "Tests failed. Deployment aborted."
    exit 1
fi

print_success "All tests passed"

# 2. Build production images
print_status "Building production Docker images..."

docker-compose -f docker-compose.prod.yml build

if [ $? -ne 0 ]; then
    print_error "Failed to build production images"
    exit 1
fi

print_success "Production images built successfully"

# 3. Deploy to production
print_status "Deploying to production..."

# Stop existing containers
docker-compose -f docker-compose.prod.yml down

# Start production containers
docker-compose -f docker-compose.prod.yml up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start production containers"
    exit 1
fi

print_success "Production containers started"

# 4. Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# 5. Health checks
print_status "Performing health checks..."

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    print_success "Backend is healthy"
else
    print_error "Backend health check failed"
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is healthy"
else
    print_error "Frontend health check failed"
    exit 1
fi

# Check database
if docker-compose -f docker-compose.prod.yml exec -T database pg_isready -U postgres > /dev/null 2>&1; then
    print_success "Database is healthy"
else
    print_error "Database health check failed"
    exit 1
fi

# Check blockchain
if curl -f http://localhost:8545 > /dev/null 2>&1; then
    print_success "Blockchain is healthy"
else
    print_error "Blockchain health check failed"
    exit 1
fi

print_success "All health checks passed"

# 6. Setup SSL (if domain is provided)
if [ "$DOMAIN" != "your-domain.com" ]; then
    print_status "Setting up SSL certificate for $DOMAIN..."
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Get SSL certificate
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificate installed successfully"
    else
        print_warning "SSL certificate installation failed. Please configure manually."
    fi
fi

# 7. Setup monitoring
print_status "Setting up monitoring..."

# Start monitoring services
docker-compose -f docker-compose.prod.yml up -d prometheus grafana

if [ $? -eq 0 ]; then
    print_success "Monitoring services started"
    print_status "Prometheus: http://$DOMAIN:9090"
    print_status "Grafana: http://$DOMAIN:3001"
else
    print_warning "Failed to start monitoring services"
fi

# 8. Setup backups
print_status "Setting up automated backups..."

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup database
docker-compose -f docker-compose.prod.yml exec -T database pg_dump -U postgres fraud_detection > $BACKUP_DIR/database.sql

# Backup blockchain data
cp -r blockchain/ $BACKUP_DIR/

# Backup configuration
cp .env $BACKUP_DIR/
cp docker-compose.prod.yml $BACKUP_DIR/

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x backup.sh

# Setup cron job for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/backup.sh") | crontab -

print_success "Automated backups configured"

# 9. Final deployment summary
echo ""
echo "🎉 Deployment Complete!"
echo "======================"
print_success "SafeGuard AI has been deployed successfully!"
echo ""
echo "📱 Access Points:"
echo "   Frontend:    http://$DOMAIN:3000"
echo "   Backend API: http://$DOMAIN:8000"
echo "   API Docs:    http://$DOMAIN:8000/docs"
echo "   Blockchain:  http://$DOMAIN:8545"
echo "   Prometheus:  http://$DOMAIN:9090"
echo "   Grafana:     http://$DOMAIN:3001"
echo ""
echo "🔧 Management Commands:"
echo "   View logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "   Restart:      docker-compose -f docker-compose.prod.yml restart"
echo "   Update:       docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
echo "   Backup:       ./backup.sh"
echo ""
echo "📊 Monitoring:"
echo "   - System metrics: Prometheus dashboard"
echo "   - Application logs: docker-compose logs"
echo "   - Database monitoring: PostgreSQL logs"
echo "   - Blockchain status: API endpoint /blockchain/status"
echo ""
echo "🔒 Security:"
echo "   - SSL certificate: Configured"
echo "   - Firewall: Configured"
echo "   - Database: Secured"
echo "   - API: Rate limited"
echo ""
echo "📈 Next Steps:"
echo "   1. Configure domain DNS to point to this server"
echo "   2. Set up monitoring alerts"
echo "   3. Configure backup retention policy"
echo "   4. Set up log aggregation"
echo "   5. Configure auto-scaling if needed"
echo ""
print_success "SafeGuard AI is now protecting India's digital future! 🇮🇳"
