import { interpretationTable, getAgeGroup, interpretResult } from './cooperTestData.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cooperForm');
    const resultDiv = document.getElementById('result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const distance = parseFloat(document.getElementById('distance').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const interpretation = interpretResult(distance, age, gender);
        const vo2max = (distance - 504.9) / 44.73;
        
        resultDiv.innerHTML = `
            <div class="space-y-2">
                <p class="font-semibold">您的12分鐘跑步距離：<span class="result-highlight">${distance} 米</span></p>
                <p class="font-semibold">體能水平：<span class="result-highlight">${interpretation}</span></p>
                <p class="font-semibold">估算的 VO2 Max：<span class="result-highlight">${vo2max.toFixed(2)} ml/kg/min</span></p>
            </div>
        `;
        resultDiv.classList.add('bg-green-100', 'border', 'border-green-400', 'rounded', 'p-4');
    });

    // 生成Cooper測試評分標準表格
    generateCooperTable();
});

function generateCooperTable() {
    const table = document.getElementById('cooperTable');
    let tableHTML = `
        <thead class="bg-gray-800 text-white">
            <tr>
                <th class="py-2 px-4 text-left">年齡</th>
                <th class="py-2 px-4 text-left">性別</th>
                <th class="py-2 px-4 text-left">優秀</th>
                <th class="py-2 px-4 text-left">良好</th>
                <th class="py-2 px-4 text-left">一般</th>
                <th class="py-2 px-4 text-left">不佳</th>
                <th class="py-2 px-4 text-left">很差</th>
            </tr>
        </thead>
        <tbody class="text-gray-700">
    `;

    for (const [ageGroup, genderData] of Object.entries(interpretationTable)) {
        for (const [gender, data] of Object.entries(genderData)) {
            const rowClass = gender === 'male' ? 'bg-gray-100' : '';
            tableHTML += `
                <tr class="${rowClass}">
                    <td class="py-2 px-4">${ageGroup}</td>
                    <td class="py-2 px-4">${gender === 'male' ? '男' : '女'}</td>
                    <td class="py-2 px-4">${data[0]}</td>
                    <td class="py-2 px-4">${data[1]}</td>
                    <td class="py-2 px-4">${data[2]}</td>
                    <td class="py-2 px-4">${data[3]}</td>
                    <td class="py-2 px-4">${data[4]}</td>
                </tr>
            `;
        }
    }

    tableHTML += '</tbody>';
    table.innerHTML = tableHTML;
}
