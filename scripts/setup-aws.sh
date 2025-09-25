#!/bin/bash

# SafeGuard AI - AWS Deployment Setup Script
# This script sets up the complete AWS infrastructure

set -e

echo "☁️ Setting up SafeGuard AI on AWS..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install AWS CLI first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install Terraform first."
    echo "Visit: https://www.terraform.io/downloads.html"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"

# Create infrastructure with Terraform
echo "🏗️ Creating AWS infrastructure..."
cd terraform
terraform init
terraform plan
terraform apply -auto-approve

# Get outputs
EC2_IP=$(terraform output -raw ec2_public_ip)
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
S3_BUCKET=$(terraform output -raw s3_bucket)

echo "📋 Infrastructure created:"
echo "   EC2 IP: $EC2_IP"
echo "   RDS Endpoint: $RDS_ENDPOINT"
echo "   S3 Bucket: $S3_BUCKET"

# Deploy application
echo "🚀 Deploying application to EC2..."

# Create deployment script
cat > deploy-ec2.sh << 'EOF'
#!/bin/bash
set -e

# Update system
sudo apt-get update
sudo apt-get install -y curl git

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/your-username/AI-Powered-Fraud-Detection-System.git
cd AI-Powered-Fraud-Detection-System

# Set environment variables
export DATABASE_URL="postgresql://username:password@$RDS_ENDPOINT:5432/fraud_detection"
export SECRET_KEY="your-production-secret-key"
export API_URL="http://$EC2_IP:8000"

# Start services
docker-compose -f docker-compose.prod.yml up -d --build

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com --non-interactive --agree-tos --email your-email@example.com

echo "✅ Deployment completed!"
EOF

# Copy deployment script to EC2
scp -i ~/.ssh/your-key.pem deploy-ec2.sh ubuntu@$EC2_IP:/tmp/
ssh -i ~/.ssh/your-key.pem ubuntu@$EC2_IP "chmod +x /tmp/deploy-ec2.sh && /tmp/deploy-ec2.sh"

echo ""
echo "🎉 SafeGuard AI deployed to AWS!"
echo ""
echo "📱 Access Points:"
echo "   Application: http://$EC2_IP"
echo "   API:         http://$EC2_IP:8000"
echo "   API Docs:    http://$EC2_IP:8000/docs"
echo ""
echo "🔧 Management Commands:"
echo "   SSH to EC2:  ssh -i ~/.ssh/your-key.pem ubuntu@$EC2_IP"
echo "   View logs:   docker-compose -f docker-compose.prod.yml logs -f"
echo "   Restart:     docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "📚 Next Steps:"
echo "   1. Update DNS records to point to $EC2_IP"
echo "   2. Configure SSL certificates"
echo "   3. Set up monitoring and alerts"
echo "   4. Configure backup strategies"
