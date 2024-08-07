document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const cooperCalculateButton = document.getElementById('cooperCalculate');
    const rockportCalculateButton = document.getElementById('rockportCalculate');
    const cooperResult = document.getElementById('cooperResult');
    const rockportResult = document.getElementById('rockportResult');
    const toggleCooperTable = document.getElementById('toggleCooperTable');
    const cooperTableContainer = document.getElementById('cooperTableContainer');

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
        const weightInPounds = weight * 2.20462;
        const timeForMile = time / 1.61;

        const vo2max = 132.853 - (0.0769 * weightInPounds) - (0.3877 * age) + (6.315 * gender) - (3.2649 * timeForMile) - (0.1565 * heartRate);

        rockportResult.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
    });

    // Cooper Test 評分標準表展開/縮合
    toggleCooperTable.addEventListener('click', function() {
        cooperTableContainer.classList.toggle('hidden');
        const svg = this.querySelector('svg');
        svg.classList.toggle('rotate-180');
    });
});

// 生成 Cooper Test 評分標準表格
function generateCooperTable() {
    const cooperTable = document.getElementById('cooperTable');
    let tableHTML = `
        <thead>
            <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齡</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性別</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">優秀</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">良好</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">一般</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">不佳</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">很差</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
    `;

    for (const [ageGroup, genderData] of Object.entries(interpretationTable)) {
        for (const [gender, data] of Object.entries(genderData)) {
            const rowClass = gender === 'male' ? 'bg-gray-50' : '';
            tableHTML += `
                <tr class="${rowClass}">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${ageGroup}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gender === 'male' ? '男' : '女'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${data[0]}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${data[1]}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${data[2]}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${data[3]}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${data[4]}</td>
                </tr>
            `;
        }
    }

    tableHTML += '</tbody>';
    cooperTable.innerHTML = tableHTML;
}

// 獲取年齡組別
function getAgeGroup(age) {
    if (age < 15) return '13-14';
    if (age < 17) return '15-16';
    if (age < 21) return '17-20';
    if (age < 30) return '20-29';
    if (age < 40) return '30-39';
    if (age < 50) return '40-49';
    return '50+';
}

// 解釋 Cooper Test 結果
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
