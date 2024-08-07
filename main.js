document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const cooperCalculateButton = document.getElementById('cooperCalculate');
    const rockportCalculateButton = document.getElementById('rockportCalculate');
    const cooperResult = document.getElementById('cooperResult');
    const rockportResult = document.getElementById('rockportResult');

    // 初始化頁面
    generateCooperTable();

    // 標籤切換邏輯
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => {
                btn.classList.remove('text-blue-600', 'border-blue-600', 'active');
                btn.classList.add('text-gray-500', 'border-transparent');
            });
            
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            button.classList.remove('text-gray-500', 'border-transparent');
            button.classList.add('text-blue-600', 'border-blue-600', 'active');
            document.getElementById(`${tabName}Tab`).classList.remove('hidden');
        });
    });

    // Cooper Test 計算
    cooperCalculateButton.addEventListener('click', function() {
        const distance = parseFloat(document.getElementById('cooperDistance').value);
        const age = parseInt(document.getElementById('cooperAge').value);
        const gender = document.getElementById('cooperGender').value;
        const interpretation = interpretResult(distance, age, gender);
        const vo2max = (distance - 504.9) / 44.73;
        
        cooperResult.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">您的 12 分鐘跑步距離：<span class="result-highlight">${distance} 公尺</span></p>
                <p class="font-semibold">體能水平：<span class="result-highlight">${interpretation}</span></p>
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
    });

    // Rockport Walk Test 計算
    rockportCalculateButton.addEventListener('click', function() {
        const time = parseFloat(document.getElementById('rockportTime').value);
        const heartRate = parseInt(document.getElementById('rockportHeartRate').value);
        const age = parseInt(document.getElementById('rockportAge').value);
        const weight = parseFloat(document.getElementById('rockportWeight').value);
        const gender = parseInt(document.getElementById('rockportGender').value);

        // 調整後的 Rockport Walk Test VO2 Max 計算公式
        // 原公式：VO2 max = 132.853 - (0.0769 * Weight) - (0.3877 * Age) + (6.315 * Gender) - (3.2649 * Time) - (0.1565 * HeartRate)
        // 我們需要將體重從公斤轉換為磅，將距離從 1.61 公里調整為 1 英里
        const weightInPounds = weight * 2.20462;
        const timeForMile = time / 1.61;

        const vo2max = 132.853 - (0.0769 * weightInPounds) - (0.3877 * age) + (6.315 * gender) - (3.2649 * timeForMile) - (0.1565 * heartRate);

        rockportResult.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
    });
});

    // Cooper Test 計算
    cooperCalculateButton.addEventListener('click', function() {
        const distance = parseFloat(document.getElementById('cooperDistance').value);
        const age = parseInt(document.getElementById('cooperAge').value);
        const gender = document.getElementById('cooperGender').value;
        const interpretation = interpretResult(distance, age, gender);
        const vo2max = (distance - 504.9) / 44.73;
        
        cooperResult.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">您的 12 分鐘跑步距離：<span class="result-highlight">${distance} 公尺</span></p>
                <p class="font-semibold">體能水平：<span class="result-highlight">${interpretation}</span></p>
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
    });

    // 1-Mile Track Walk Test 計算
    mileCalculateButton.addEventListener('click', function() {
        const time = parseFloat(document.getElementById('mileTime').value);
        const heartRate = parseInt(document.getElementById('mileHeartRate').value);
        const age = parseInt(document.getElementById('mileAge').value);
        const weight = parseFloat(document.getElementById('mileWeight').value);
        const gender = parseInt(document.getElementById('mileGender').value);

        const vo2max = 132.853 - (0.0769 * weight) - (0.3877 * age) + (6.315 * gender) - (3.2649 * time) - (0.1565 * heartRate);

        mileResult.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
    });
});

// 生成 Cooper Test 評分標準表格
function generateCooperTable() {
    const cooperTable = document.getElementById('cooperTable');
    let tableHTML = `
        <thead>
            <tr>
                <th>年齡</th>
                <th>性別</th>
                <th>優秀</th>
                <th>良好</th>
                <th>一般</th>
                <th>不佳</th>
                <th>很差</th>
            </tr>
        </thead>
        <tbody>
    `;

    for (const [ageGroup, genderData] of Object.entries(interpretationTable)) {
        for (const [gender, data] of Object.entries(genderData)) {
            const rowClass = gender === 'male' ? 'bg-gray-50' : '';
            tableHTML += `
                <tr class="${rowClass}">
                    <td>${ageGroup}</td>
                    <td>${gender === 'male' ? '男' : '女'}</td>
                    <td>${data[0]}</td>
                    <td>${data[1]}</td>
                    <td>${data[2]}</td>
                    <td>${data[3]}</td>
                    <td>${data[4]}</td>
                </tr>
            `;
        }
    }

    tableHTML += '</tbody>';
    cooperTable.innerHTML = tableHTML;
}
