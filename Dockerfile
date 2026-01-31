# Railway Dockerfile for Cargill Ocean Transportation API
FROM python:3.11-slim

# Install system dependencies required by LightGBM and scipy
RUN apt-get update && apt-get install -y \
    libgomp1 \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Railway sets PORT env var)
EXPOSE 8000

# Run the application
CMD uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}
