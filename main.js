document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cooperForm');
    const resultDiv = document.getElementById('result');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 標籤切換邏輯
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            button.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.remove('hidden');
        });
    });

    // 設置預設激活的標籤
    document.querySelector('[data-tab="calculator"]').click();
    
    // 表單提交處理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const distance = parseFloat(document.getElementById('distance').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const interpretation = interpretResult(distance, age, gender);
        const vo2max = (distance - 504.9) / 44.73;
        
        resultDiv.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">您的 12 分鐘跑步距離：<span class="result-highlight">${distance} 公尺</span></p>
                <p class="font-semibold">體能水平：<span class="result-highlight">${interpretation}</span></p>
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
        resultDiv.classList.add('bg-gray-100', 'border', 'border-gray-300', 'rounded', 'p-4');
    });

    // 生成 Cooper Test 評分標準表格
    generateCooperTable();
});

// 生成 Cooper Test 評分標準表格的函數
function generateCooperTable() {
    const table = document.getElementById('cooperTable');
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
    table.innerHTML = tableHTML;
}
