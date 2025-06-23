document.addEventListener('DOMContentLoaded', function() {
  const regionSelect = document.getElementById("region-select");
  const resultDiv = document.getElementById("result");
  const loadingSpinner = document.getElementById("loading");

  // Function to show loading state
  function showLoading() {
    resultDiv.classList.remove('visible');
    loadingSpinner.style.display = 'flex';
    resultDiv.innerHTML = '';
  }

  // Function to show error message
  function showError(message) {
    loadingSpinner.style.display = 'none';
    resultDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
    resultDiv.classList.add('visible');
  }

  // Function to show result
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
  }

  // Event listener for region selection
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
