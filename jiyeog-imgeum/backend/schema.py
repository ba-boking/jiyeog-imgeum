from pydantic import BaseModel

class RegionRequest(BaseModel):
    region: str

class WageResponse(BaseModel):
    region: str
    cpi: float
    recommended_min_wage: float
