#!/bin/bash

# SafeGuard AI - Local Development Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up SafeGuard AI Development Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data
mkdir -p logs
mkdir -p ssl
mkdir -p blockchain/data

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created. Please update .env with your configuration."
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🏥 Performing health checks..."

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
fi

# Check blockchain
if curl -f http://localhost:8545 > /dev/null 2>&1; then
    echo "✅ Blockchain is healthy"
else
    echo "❌ Blockchain health check failed"
fi

echo ""
echo "🎉 SafeGuard AI is now running!"
echo ""
echo "📱 Access Points:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs:    http://localhost:8000/docs"
echo "   Blockchain:  http://localhost:8545"
echo ""
echo "🔧 Development Commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop:        docker-compose down"
echo "   Restart:     docker-compose restart"
echo "   Update:      docker-compose pull && docker-compose up -d"
echo ""
echo "📚 Next Steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Test the fraud detection features"
echo "   3. Check the API documentation at http://localhost:8000/docs"
echo "   4. View blockchain data in the dashboard"
echo ""
echo "🆘 Need Help?"
echo "   - Check logs: docker-compose logs"
echo "   - Restart services: docker-compose restart"
echo "   - Full reset: docker-compose down -v && docker-compose up --build"
