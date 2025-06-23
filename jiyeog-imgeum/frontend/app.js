document.addEventListener('DOMContentLoaded', function () {
  const regionSelect = document.getElementById("region-select");
  const resultDiv = document.getElementById("result");
  const loadingSpinner = document.getElementById("loading");
  const chartCanvas = document.getElementById("cpiChart");
  let cpiChart = null;

  // 모든 지역 CPI (정적 로딩)
  const allCPI = {
    "서울": 109.2, "부산": 103.5, "대구": 102.8, "광주": 101.9,
    "대전": 104.1, "울산": 104.9, "세종": 106.2, "경기": 107.5,
    "강원": 100.4, "충북": 100.7, "충남": 101.3, "전북": 99.9,
    "전남": 99.5, "경북": 98.7, "경남": 101.2, "제주": 105.8
  };

  function showLoading() {
    resultDiv.classList.remove('visible');
    loadingSpinner.style.display = 'flex';
    resultDiv.innerHTML = '';
    chartCanvas.style.display = 'none';
  }

  function showError(message) {
    loadingSpinner.style.display = 'none';
    resultDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
    resultDiv.classList.add('visible');
    chartCanvas.style.display = 'none';
  }

  function showResult(data) {
    loadingSpinner.style.display = 'none';
    resultDiv.innerHTML = `
      <h3><i class="fas fa-map-marker-alt"></i> ${data.region}</h3>
      <div class="result-info">
        <p>소비자물가지수 (CPI): <strong>${data.cpi}</strong></p>
        <p>추천 최저임금: <strong>${data.recommended_min_wage.toLocaleString()}원</strong></p>
      </div>
      <div class="result-icon">
        <i class="fas fa-hand-holding-usd"></i>
      </div>
    `;
    resultDiv.classList.add('visible');

    drawCPIChart(data.region);
  }

  function drawCPIChart(selectedRegion) {
    const labels = Object.keys(allCPI);
    const values = Object.values(allCPI);
    const backgroundColors = labels.map(region =>
      region === selectedRegion ? 'rgba(67, 97, 238, 0.9)' : 'rgba(200, 200, 200, 0.5)'
    );

    if (cpiChart) {
      cpiChart.destroy();
    }

    cpiChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '소비자물가지수 (CPI)',
          data: values,
          backgroundColor: backgroundColors,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} (지수)`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: '지수'
            }
          }
        }
      }
    });

    chartCanvas.style.display = 'block';
  }

  regionSelect.addEventListener("change", async function () {
    const region = this.value;
    if (!region) return;

    showLoading();

    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region })
      });

      if (!res.ok) {
        showError("해당 지역 정보를 불러올 수 없습니다.");
        return;
      }

      const data = await res.json();
      showResult(data);

    } catch (error) {
      showError("서버에 연결할 수 없습니다.");
    }
  });
});
