document.addEventListener('DOMContentLoaded', function() {
    const testTypeSelect = document.getElementById('testType');
    const cooperForm = document.getElementById('cooperForm');
    const mileForm = document.getElementById('1mileForm');
    const cooperCalculateButton = document.getElementById('cooperCalculate');
    const mileCalculateButton = document.getElementById('mileCalculate');
    const cooperResultContent = document.getElementById('cooperResultContent');
    const mileResultContent = document.getElementById('mileResultContent');
    const cooperTable = document.getElementById('cooperTable');

    // 初始化頁面
    generateCooperTable();

    // 切換測試類型
    testTypeSelect.addEventListener('change', function() {
        if (this.value === 'cooper') {
            cooperForm.classList.remove('hidden');
            mileForm.classList.add('hidden');
        } else {
            cooperForm.classList.add('hidden');
            mileForm.classList.remove('hidden');
        }
    });

    // Cooper Test 計算
    cooperCalculateButton.addEventListener('click', function() {
        const distance = parseFloat(document.getElementById('cooperDistance').value);
        const age = parseInt(document.getElementById('cooperAge').value);
        const gender = document.getElementById('cooperGender').value;
        const interpretation = interpretResult(distance, age, gender);
        const vo2max = (distance - 504.9) / 44.73;
        
        cooperResultContent.innerHTML = `
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

        mileResultContent.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
    });
});

// Cooper Test 相關函數
function getAgeGroup(age) {
    if (age < 15) return '13-14';
    if (age < 17) return '15-16';
    if (age < 21) return '17-20';
    if (age < 30) return '20-29';
    if (age < 40) return '30-39';
    if (age < 50) return '40-49';
    return '50+';
}

function interpretResult(distance, age, gender) {
    const ageGroup = getAgeGroup(age);
    const ranges = interpretationTable[ageGroup][gender];
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i].replace('>', '').replace('<', '').split('-');
        if (range.length === 1) {
            if ((i === 0 && distance >= parseFloat(range[0])) || 
                (i === ranges.length - 1 && distance <= parseFloat(range[0]))) {
                return ['優秀', '良好', '一般', '不佳', '很差'][i];
            }
        } else if (distance >= parseFloat(range[0]) && distance <= parseFloat(range[1])) {
            return ['優秀', '良好', '一般', '不佳', '很差'][i];
        }
    }
    return '無法判斷';
}

// 生成 Cooper Test 評分標準表格
function generateCooperTable() {
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
