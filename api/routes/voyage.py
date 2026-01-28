from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from ..services.calculator_service import calculator_service


router = APIRouter(prefix="/api/voyage", tags=["voyage"])


class VoyageCalcRequest(BaseModel):
    vessel_name: str
    cargo_name: str
    use_eco_speed: bool = True
    extra_port_delay: float = 0
    bunker_adjustment: float = 1.0


class CompareRequest(BaseModel):
    pairs: List[VoyageCalcRequest]


@router.post("/calculate")
def calculate_voyage(req: VoyageCalcRequest):
    """Calculate voyage economics for a single vessel-cargo pair."""
    return calculator_service.calculate_voyage(
        req.vessel_name,
        req.cargo_name,
        req.use_eco_speed,
        req.extra_port_delay,
        req.bunker_adjustment,
    )


@router.post("/compare")
def compare_voyages(req: CompareRequest):
    """Compare multiple voyages side by side."""
    results = []
    for pair in req.pairs:
        results.append(calculator_service.calculate_voyage(
            pair.vessel_name,
            pair.cargo_name,
            pair.use_eco_speed,
            pair.extra_port_delay,
            pair.bunker_adjustment,
        ))
    return {"voyages": results}
