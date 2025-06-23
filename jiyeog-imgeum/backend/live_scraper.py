import requests
from bs4 import BeautifulSoup
import json

def fetch_latest_cpi() -> dict:
    try:
        url = "https://kostat.go.kr/cpidtvalregion.es?mid=b70201040000"
        response = requests.get(url)
        response.encoding = "utf-8"
        soup = BeautifulSoup(response.text, "html.parser")

        table = soup.select_one("table.tbl_line")
        if not table:
            raise ValueError("소비자물가지수 테이블을 찾을 수 없습니다.")

        cpi_data = {}
        rows = table.select("tbody tr")
        for row in rows:
            cols = row.select("td")
            if len(cols) >= 2:
                region = cols[0].get_text(strip=True)
                try:
                    cpi = float(cols[1].get_text(strip=True))
                    cpi_data[region] = cpi
                except ValueError:
                    continue

        return cpi_data
    except Exception as e:
        print(f"[크롤링 실패: {e}] → 로컬 JSON으로 대체 ㅎㅎ")
        with open("./data/cpi.json", encoding="utf-8") as f:
            return json.load(f)
