# Project Documentation
## Cargill Ocean Transportation Datathon 2026

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [How to Reproduce Results](#how-to-reproduce-results)
4. [Team Members & Responsibilities](#team-members--responsibilities)

---

## Project Overview

This project delivers a comprehensive maritime freight optimization solution for Cargill's Capesize fleet. It combines:

- **Voyage Economics Calculator:** Calculates freight, bunker costs, port costs, and TCE for any vessel-cargo combination
- **Portfolio Optimizer:** Finds optimal vessel-cargo assignments using joint optimization with market vessels
- **Scenario Analyzer:** Analyzes sensitivity to bunker prices and port delays, identifies tipping points
- **ML Port Congestion Model:** Predicts port delays using historical data and machine learning
- **Interactive Dashboard:** React-based web application for visualization and analysis

---

## File Structure

```
cargillDatathon/
├── api/                          # FastAPI Backend
│   ├── main.py                   # API entry point, CORS, lifespan
│   ├── routes/
│   │   ├── portfolio.py          # Portfolio optimization endpoints
│   │   ├── voyage.py             # Individual voyage calculation
│   │   ├── scenario.py           # Scenario analysis endpoints
│   │   ├── ml_routes.py          # ML prediction endpoints
│   │   └── chat.py               # AI chat assistant endpoint
│   └── services/
│       └── calculator_service.py # Pre-computes results on startup
│
├── src/                          # Core Python Logic
│   ├── freight_calculator.py     # Voyage economics engine
│   │   ├── FreightCalculator     # Main calculator class
│   │   ├── PortDistanceManager   # Port distance lookups
│   │   ├── BunkerPrices          # Regional bunker pricing
│   │   ├── Vessel, Cargo         # Data classes
│   │   └── create_*() functions  # Data factory functions
│   │
│   ├── portfolio_optimizer.py    # Optimization algorithms
│   │   ├── PortfolioOptimizer    # Basic optimization (Hungarian algorithm)
│   │   ├── FullPortfolioOptimizer# Joint optimization with market vessels
│   │   ├── ScenarioAnalyzer      # Sensitivity & tipping point analysis
│   │   └── CHINA_DISCHARGE_PORTS # China ports for delay filtering
│   │
│   └── ml/                       # Machine Learning
│       ├── __init__.py
│       └── port_congestion.py    # PortCongestionPredictor class
│
├── frontend/                     # React Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/        # Dashboard tab components
│   │   │   ├── voyages/          # Voyage matrix & details
│   │   │   ├── scenarios/        # Scenario analysis page
│   │   │   │   └── ScenariosPage.tsx  # Bunker/delay sensitivity
│   │   │   ├── ml/               # ML predictions display
│   │   │   └── chat/             # AI assistant chat
│   │   ├── api/
│   │   │   ├── client.ts         # API client
│   │   │   └── hooks.ts          # React Query hooks
│   │   ├── data/
│   │   │   └── mockData.ts       # Fallback mock data
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   └── utils/
│   │       └── formatters.ts     # Currency/number formatters
│   ├── package.json
│   └── vite.config.ts
│
├── notebooks/                    # Jupyter Notebooks
│   ├── analysis.ipynb            # Main analysis & visualization
│   └── ml_training.ipynb         # ML model training notebook
│
├── models/                       # Trained ML Models
│   ├── port_delay_v1.joblib      # Trained LightGBM model
│   └── model_info.json           # Model metadata & metrics
│
├── data/                         # Data Files
│   ├── Port_Distances.csv        # Port-to-port distances
│   └── raw/
│       └── Daily_Port_Activity_Data_and_Trade_Estimates.csv
│
├── scripts/                      # Utility Scripts
│   └── train_model.py            # ML model training script
│
├── .env                          # Environment variables (API keys)
├── requirements.txt              # Python dependencies
├── VOYAGE_RECOMMENDATION_REPORT.md  # Final recommendation report
└── DOCUMENTATION.md              # This file
```

---

## How to Reproduce Results

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Step 1: Install Python Dependencies

```bash
cd cargillDatathon
pip install -r requirements.txt
```

**Key dependencies:**
- pandas, numpy - Data manipulation
- scipy - Hungarian algorithm for optimization
- lightgbm, scikit-learn - ML model
- fastapi, uvicorn - Backend API
- python-dotenv - Environment variables

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Run the Backend API

```bash
cd cargillDatathon
python -m uvicorn api.main:app --reload --port 8000
```

The API will:
1. Load vessel/cargo data
2. Pre-compute optimal portfolio (top 3 solutions)
3. Pre-compute all voyage combinations
4. Pre-compute scenario analyses
5. Load ML model for port delay predictions

**API Endpoints:**
- `http://localhost:8000/docs` - Swagger documentation
- `http://localhost:8000/api/portfolio/optimize` - Optimal assignments
- `http://localhost:8000/api/scenario/tipping-points` - Tipping points
- `http://localhost:8000/api/ml/port-delays` - ML predictions

### Step 4: Run the Frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

### Step 5: Run the Analysis Notebook

```bash
cd notebooks
jupyter notebook analysis.ipynb
```

Run all cells to reproduce:
- Fleet feasibility analysis
- TCE heatmaps
- Portfolio optimization
- Scenario sensitivity charts
- Tipping point analysis

### Step 6: Train ML Model (Optional)

```bash
cd cargillDatathon
python scripts/train_model.py
```

This trains a LightGBM model on port activity data and saves it to `models/port_delay_v1.joblib`.

---

## Team Members & Responsibilities

### Sidarth Rajesh
**Role:** Lead Developer & Systems Architect (60% contribution)

Sidarth served as the technical lead for this project, architecting and implementing the core systems that power the optimization engine and web application.

**Key Contributions:**

1. **Data Analysis & Calculation Architecture**
   - Meticulously analyzed the provided Excel datasets to extract vessel specifications, cargo requirements, port distances, and freight terms
   - Translated complex shipping industry formulas into precise computational models
   - Designed the end-to-end calculation pipeline ensuring accuracy across all voyage economics
   - Validated results against manual calculations to ensure correctness of freight, bunker, and TCE computations
   - Structured the data flow from raw Excel inputs through optimization to final recommendations

2. **Voyage Economics Engine (`freight_calculator.py`)**
   - Designed and implemented the complete voyage calculation system
   - Built the `FreightCalculator` class handling ballast/laden legs, bunker consumption, port costs, and TCE calculations
   - Implemented bunker port optimization with regional pricing (Singapore, Fujairah, Rotterdam, Gibraltar)
   - Created the dual-speed mode supporting both eco and warranted speed calculations
   - Ensured compliance with Cargill FAQ (MGO for port operations, commission handling)

3. **Portfolio Optimization (`portfolio_optimizer.py`)**
   - Developed the `PortfolioOptimizer` using the Hungarian algorithm for optimal assignments
   - Built the `FullPortfolioOptimizer` for joint optimization across Cargill and market vessels
   - Implemented exhaustive search for market cargo assignments
   - Created the `ScenarioAnalyzer` for bunker and port delay sensitivity analysis
   - Designed the tipping point detection algorithm with assignment change tracking

4. **Backend API (`api/`)**
   - Architected the FastAPI backend with pre-computation on startup
   - Implemented caching strategy for sub-50ms API responses
   - Built all REST endpoints for portfolio, voyages, scenarios, and ML predictions
   - Designed the data normalization layer between Python classes and JSON responses

5. **Frontend Development (`frontend/`)**
   - Set up the React + TypeScript + Vite project structure
   - Implemented the Dashboard, Voyages, and Scenarios pages
   - Built interactive charts using Recharts and Plotly
   - Created the vessel-cargo heatmap visualizations
   - Designed the responsive layout with Tailwind CSS
   - Integrated React Query for API state management

### Makendra Prasad
**Role:** ML Engineer & Frontend Specialist (40% contribution)

Makendra brought critical expertise in machine learning and user interface design, significantly enhancing the project's predictive capabilities and user experience.

**Key Contributions:**

1. **Port Congestion ML Model (`src/ml/`)**
   - Designed and implemented the `PortCongestionPredictor` class
   - Engineered features from daily port activity data:
     - Rolling statistics (7/14/30-day means and sums)
     - Port capacity ratios
     - Seasonal indicators (CNY proximity, monsoon periods)
     - Trade momentum features
   - Trained and optimized the LightGBM regression model
   - Achieved high accuracy: MAE of 0.064 days, 99.7% predictions within 1 day
   - Implemented confidence intervals for predictions
   - Created the model training pipeline (`scripts/train_model.py`)

2. **ML Integration**
   - Built the ML routes in the API (`api/routes/ml_routes.py`)
   - Integrated predictions with the portfolio optimizer
   - Created the `get_ml_port_delays()` utility function
   - Implemented fallback mechanisms when ML model is unavailable

3. **Scenario Analysis Enhancements**
   - Implemented China-specific port delay filtering
   - Added `CHINA_DISCHARGE_PORTS` constant for regional analysis
   - Enhanced tipping points to include assignment change details
   - Created `current_best_assignments` and `next_best_assignments` tracking

4. **Frontend UI/UX Improvements**
   - Redesigned the Scenarios page layout for visual balance
   - Implemented the side-by-side tipping point cards
   - Created the vertical stacked layout for assignment changes
   - Updated labels to reflect China-specific port delay analysis
   - Enhanced typography and spacing for dashboard aesthetics
   - Built the ML Predictions visualization page

5. **Data Analysis & Validation**
   - Analyzed port activity patterns for feature engineering
   - Validated model predictions against historical data
   - Conducted sensitivity analysis on ML model inputs
   - Documented model performance metrics and limitations

---

## Technical Highlights

### Optimization Algorithm
- **Hungarian Algorithm** (O(n³)) for large problems via scipy
- **Brute-force enumeration** for small problems (exact solution)
- **Dual-speed mode** explores both eco and warranted speeds per voyage

### ML Model Performance
| Metric | Value |
|--------|-------|
| Mean Absolute Error | 0.064 days |
| RMSE | 0.124 days |
| Within 1 day accuracy | 99.7% |
| Within 2 days accuracy | 100% |

### API Performance
- Pre-computation on startup: ~1.3 seconds
- API response time: <50ms (cached results)
- Supports 144+ voyage combinations

---

## Contact

For questions or issues, please contact the team members through the Cargill Datathon 2026 communication channels.

---

*Last updated: January 2026*
