from pydantic import BaseModel
from typing import List, Optional, Dict, Tuple


class VesselSchema(BaseModel):
    name: str
    dwt: int
    hire_rate: float
    speed_laden: float
    speed_laden_eco: float
    speed_ballast: float
    speed_ballast_eco: float
    current_port: str
    etd: str
    bunker_rob_vlsfo: float
    bunker_rob_mgo: float
    is_cargill: bool


class CargoSchema(BaseModel):
    name: str
    customer: str
    commodity: str
    quantity: int
    quantity_tolerance: float
    laycan_start: str
    laycan_end: str
    freight_rate: float
    load_port: str
    discharge_port: str
    load_rate: int
    discharge_rate: int
    port_cost_load: float
    port_cost_discharge: float
    commission: float
    is_cargill: bool


class VoyageResultSchema(BaseModel):
    vessel: str
    cargo: str
    speed_type: str
    can_make_laycan: bool
    arrival_date: str
    laycan_end: str
    days_margin: float
    total_days: float
    ballast_days: float
    laden_days: float
    load_days: float
    discharge_days: float
    waiting_days: float
    cargo_qty: int
    gross_freight: float
    net_freight: float
    commission_cost: float
    total_bunker_cost: float
    bunker_cost_vlsfo: float
    bunker_cost_mgo: float
    hire_cost: float
    port_costs: float
    misc_costs: float
    net_profit: float
    tce: float
    vlsfo_consumed: float
    mgo_consumed: float
    bunker_port: Optional[str] = None
    bunker_savings: float = 0


class AssignmentSchema(BaseModel):
    vessel: str
    cargo: str
    voyage: VoyageResultSchema


class PortfolioResultSchema(BaseModel):
    assignments: List[AssignmentSchema]
    unassigned_vessels: List[str]
    unassigned_cargoes: List[str]
    total_profit: float
    total_tce: float
    avg_tce: float


class VoyageCalcRequest(BaseModel):
    vessel_name: str
    cargo_name: str
    use_eco_speed: bool = True
    extra_port_delay: float = 0
    bunker_adjustment: float = 1.0


class VoyageCompareRequest(BaseModel):
    pairs: List[VoyageCalcRequest]


class ScenarioRequest(BaseModel):
    parameter_min: float = 0.8
    parameter_max: float = 1.5
    steps: int = 15


class PortDelayScenarioRequest(BaseModel):
    max_delay_days: int = 15


class PortDelaySchema(BaseModel):
    port: str
    predicted_delay_days: float
    confidence_lower: float
    confidence_upper: float
    congestion_level: str
    model_used: str


class ModelInfoSchema(BaseModel):
    model_type: str
    training_date: str
    metrics: dict
    feature_importance: list


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
