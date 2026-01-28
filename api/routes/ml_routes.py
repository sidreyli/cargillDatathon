from fastapi import APIRouter
from ..services.calculator_service import calculator_service

router = APIRouter(prefix="/api/ml", tags=["ml"])


@router.get("/port-delays")
def get_port_delays():
    """Get ML-predicted port delays."""
    return calculator_service.get_ml_delays()


@router.get("/model-info")
def get_model_info():
    """Get ML model info including SHAP feature importance."""
    return calculator_service.get_model_info()
