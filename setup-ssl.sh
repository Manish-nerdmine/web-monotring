#!/bin/bash

# SSL Setup Script for Dark Web Monitoring Frontend
# This script will help you set up Nginx with SSL using Let's Encrypt

echo "=== Dark Web Monitoring - SSL Setup ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Prompt for domain name
read -p "Enter your domain name (e.g., example.com): " DOMAIN
read -p "Enter your email for SSL certificate notifications: " EMAIL

echo ""
echo "Setting up SSL for domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt update
    apt install -y nginx
else
    echo "Nginx is already installed"
fi

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
else
    echo "Certbot is already installed"
fi

# Update nginx.conf with actual domain
echo "Creating Nginx configuration..."
cat > /etc/nginx/sites-available/dark-web-monitoring << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/dark-web-monitoring /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid"
    systemctl reload nginx
else
    echo "Nginx configuration has errors. Please fix them before continuing."
    exit 1
fi

# Obtain SSL certificate
echo ""
echo "Obtaining SSL certificate from Let's Encrypt..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "=== SSL Setup Complete! ==="
    echo "Your site is now available at:"
    echo "  https://$DOMAIN"
    echo "  https://www.$DOMAIN"
    echo ""
    echo "SSL certificate will auto-renew. Test renewal with:"
    echo "  sudo certbot renew --dry-run"
else
    echo "SSL certificate installation failed. Please check the errors above."
    exit 1
fi
