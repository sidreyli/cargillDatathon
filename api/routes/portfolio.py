from fastapi import APIRouter
from ..services.calculator_service import calculator_service

router = APIRouter(prefix="/api", tags=["portfolio"])


@router.get("/vessels")
def get_vessels():
    """Get all Cargill vessels."""
    return calculator_service.get_vessels()


@router.get("/cargoes")
def get_cargoes():
    """Get all Cargill cargoes."""
    return calculator_service.get_cargoes()


@router.get("/portfolio/optimize")
def optimize_portfolio():
    """Get cached optimal vessel-cargo assignments."""
    return calculator_service.get_portfolio()


@router.get("/portfolio/all-voyages")
def get_all_voyages():
    """Get all voyage combinations with economics."""
    return calculator_service.get_all_voyages()
