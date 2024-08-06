export const interpretationTable = {
    '13-14': {
        male: ['>2700', '2400-2700', '2200-2399', '2100-2199', '<2100'],
        female: ['>2000', '1900-2000', '1600-1899', '1500-1599', '<1500']
    },
    '15-16': {
        male: ['>2800', '2500-2800', '2300-2499', '2200-2299', '<2200'],
        female: ['>2100', '2000-2100', '1700-1999', '1600-1699', '<1600']
    },
    '17-20': {
        male: ['>3000', '2700-3000', '2500-2699', '2300-2499', '<2300'],
        female: ['>2300', '2100-2300', '1800-2099', '1700-1799', '<1700']
    },
    '20-29': {
        male: ['>2800', '2400-2800', '2200-2399', '1600-2199', '<1600'],
        female: ['>2700', '2200-2700', '1800-2199', '1500-1799', '<1500']
    },
    '30-39': {
        male: ['>2700', '2300-2700', '1900-2299', '1500-1899', '<1500'],
        female: ['>2500', '2000-2500', '1700-1999', '1400-1699', '<1400']
    },
    '40-49': {
        male: ['>2500', '2100-2500', '1700-2099', '1400-1699', '<1400'],
        female: ['>2300', '1900-2300', '1500-1899', '1200-1499', '<1200']
    },
    '50+': {
        male: ['>2400', '2000-2400', '1600-1999', '1300-1599', '<1300'],
        female: ['>2200', '1700-2200', '1400-1699', '1100-1399', '<1100']
    }
};

export function getAgeGroup(age) {
    if (age < 15) return '13-14';
    if (age < 17) return '15-16';
    if (age < 21) return '17-20';
    if (age < 30) return '20-29';
    if (age < 40) return '30-39';
    if (age < 50) return '40-49';
    return '50+';
}

export function interpretResult(distance, age, gender) {
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
