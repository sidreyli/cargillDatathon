#!/bin/bash
echo "============================================================"
echo "Cargill Ocean Transportation - Development Server"
echo "============================================================"
echo ""
echo "Starting FastAPI backend on port 8000..."
echo "Starting Vite frontend on port 5173..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."
echo "============================================================"

# Start backend
cd "$(dirname "$0")"
python -m uvicorn api.main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start frontend
cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
