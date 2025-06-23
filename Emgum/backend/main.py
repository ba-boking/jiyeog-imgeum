from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schema import RegionRequest, WageResponse
from calculator import calculate_min_wage
from live_scraper import fetch_latest_cpi

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend", response_model=WageResponse)
def recommend_wage(request: RegionRequest):
    try:
        cpi_dict = fetch_latest_cpi()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터 수집 실패: {str(e)}")

    cpi = cpi_dict.get(request.region)
    if cpi is None:
        raise HTTPException(status_code=404, detail="해당 지역 CPI를 찾을 수 없습니다.")

    wage = calculate_min_wage(cpi)
    return WageResponse(region=request.region, cpi=cpi, recommended_min_wage=wage)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
