#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_info "Starting setup process..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Backend setup
print_info "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_info "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
print_info "Running database migrations..."
python manage.py migrate

# Load data from CSV files
print_info "Loading data from CSV files..."
python manage.py load_csv_data --purge

# Deactivate virtual environment
deactivate

cd ..

# Frontend setup
print_info "Setting up frontend..."
cd frontend

# Install Node.js dependencies
print_info "Installing Node.js dependencies..."
npm install

cd ..

# Generate test credentials file
print_info "Generating test credentials file..."
python3 << 'EOF'
import csv
import sys
from pathlib import Path

data_dir = Path("data")
users_file = data_dir / "users.csv"
output_file = Path("TEST_CREDENTIALS.md")

if not users_file.exists():
    print("Users CSV file not found!")
    sys.exit(1)

credentials = []
with open(users_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        role = row['role']
        email = row['email']
        password = row['password']
        full_name = row['full_name']
        
        credentials.append({
            'role': role,
            'email': email,
            'password': password,
            'full_name': full_name
        })

# Group by role
by_role = {}
for cred in credentials:
    role = cred['role']
    if role not in by_role:
        by_role[role] = []
    by_role[role].append(cred)

# Write markdown file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# Test Credentials\n\n")
    f.write("Use these credentials to test the application:\n\n")
    
    for role in ['parent', 'teacher', 'counselor', 'child']:
        if role in by_role:
            f.write(f"## {role.capitalize()} Accounts\n\n")
            f.write("| Full Name | Email | Password |\n")
            f.write("|-----------|-------|----------|\n")
            for cred in by_role[role]:
                f.write(f"| {cred['full_name']} | {cred['email']} | `{cred['password']}` |\n")
            f.write("\n")

print(f"✅ Test credentials file created: {output_file}")
EOF

print_success "Setup completed successfully!"
print_info ""
print_info "Next steps:"
print_info "1. Backend: cd backend && source venv/bin/activate && python manage.py runserver"
print_info "2. Frontend: cd frontend && npm run dev"
print_info "3. Check TEST_CREDENTIALS.md for login credentials"
print_info ""

