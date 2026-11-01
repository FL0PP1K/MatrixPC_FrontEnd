export function checkCompatibility(selected) {
    const errors = [];

    const cpu = selected.cpu;
    const motherboard = selected.motherboard;
    const ram = selected.ram;
    const pcCase = selected.case;
    const gpu = selected.gpu;
    const psu = selected.psu;
    const cooler = selected.cooler;
    const ssd = selected.ssd;
    const fans = selected.fans;
    // 1. Перевірка сокета CPU і материнської плати
    if (cpu && motherboard) {
        if (
            cpu.socket &&
            motherboard.socket &&
            cpu.socket !== motherboard.socket
        ) {
            errors.push(
                "Процесор несумісний із материнською платою: різні сокети."
            );
        }
    }
    // 2. Перевірка типу RAM і материнської плати
    if (ram && motherboard) {
        if (
            ram.memoryType &&
            motherboard.memoryType &&
            ram.memoryType !== motherboard.memoryType
        ) {
            errors.push(
                `Оперативна пам'ять ${ram.memoryType} несумісна ` +
                `з материнською платою ${motherboard.memoryType}.`
            );
        }
    }
// 3. Перевірка материнської плати та корпусу
if (motherboard && pcCase) {
    if (
        motherboard.formFactor &&
        Array.isArray(pcCase.supportedFormFactors) &&
        !pcCase.supportedFormFactors.includes(motherboard.formFactor)
    ) {
        errors.push(
            `Материнська плата ${motherboard.formFactor} ` +
            `не підтримується корпусом ${pcCase.name}.`
        );
    }
}  
// 4. Перевірка довжини відеокарти та корпусу
if (gpu && pcCase) {
    if (
        typeof gpu.lengthMm === 'number' &&
        typeof pcCase.maxGpuLengthMm === 'number' &&
        gpu.lengthMm > pcCase.maxGpuLengthMm
    ) {
        errors.push(
            `Відеокарта ${gpu.name} має довжину ${gpu.lengthMm} мм, ` +
            `але корпус ${pcCase.name} підтримує максимум ` +
            `${pcCase.maxGpuLengthMm} мм.`
        );
    }
}

// 5. Перевірка потужності блока живлення
if (cpu && gpu && psu) {
    if (
        typeof cpu.powerW === 'number' &&
        typeof gpu.powerW === 'number' &&
        typeof psu.wattage === 'number'
    ) {
        // 100 Вт — приблизний резерв для інших комплектуючих
        const systemPower = cpu.powerW + gpu.powerW + 100;

        // Додаємо 25% запасу потужності
        const recommendedPower = Math.ceil(systemPower * 1.25);

        if (psu.wattage < recommendedPower) {
            errors.push(
                `Недостатня потужність блока живлення! ` +
                `Для цієї збірки орієнтовно потрібно ${recommendedPower} Вт, ` +
                `але обраний блок живлення має ${psu.wattage} Вт.`
            );
        }
    }
}
    
// 6. Перевірка сумісності охолодження із сокетом CPU
if (cpu && cooler) {
    if (
        cpu.socket &&
        Array.isArray(cooler.supportedSockets) &&
        !cooler.supportedSockets.includes(cpu.socket)
    ) {
        errors.push(
            `Охолодження ${cooler.name} не підтримує ` +
            `сокет ${cpu.socket} процесора ${cpu.name}.`
        );
    }
}

// 7. Перевірка охолодження та корпусу
if (cooler && pcCase) {
    // Повітряне охолодження: перевірка висоти
    if (
        cooler.type === 'air' &&
        typeof cooler.heightMm === 'number' &&
        typeof pcCase.maxCoolerHeightMm === 'number' &&
        cooler.heightMm > pcCase.maxCoolerHeightMm
    ) {
        errors.push(
            `Охолодження ${cooler.name} має висоту ${cooler.heightMm} мм, ` +
            `але корпус ${pcCase.name} підтримує максимум ` +
            `${pcCase.maxCoolerHeightMm} мм.`
        );
    }
    // Рідинне охолодження: перевірка радіатора
    if (
        cooler.type === 'liquid' &&
        typeof cooler.radiatorMm === 'number' &&
        Array.isArray(pcCase.supportedRadiatorsMm) &&
        !pcCase.supportedRadiatorsMm.includes(cooler.radiatorMm)
    ) {
        errors.push(
            `Радіатор охолодження ${cooler.radiatorMm} мм ` +
            `не підтримується корпусом ${pcCase.name}.`
        );
    }
}

// 8. Перевірка SSD і материнської плати
if (ssd && motherboard) {
    if (
        ssd.connector &&
        ssd.interface &&
        Array.isArray(motherboard.supportedStorage)
    ) {
        const isSupported = motherboard.supportedStorage.some(
            storage =>
                storage.connector === ssd.connector &&
                storage.interface === ssd.interface
        );

        if (!isSupported) {
            errors.push(
                `SSD ${ssd.name} (${ssd.connector} ${ssd.interface}) ` +
                `несумісний із материнською платою ${motherboard.name}.`
            );
        }
    }
}

// 9. Перевірка вентиляторів та корпусу
if (fans && pcCase) {
    if (
        typeof fans.sizeMm === 'number' &&
        typeof fans.count === 'number' &&
        pcCase.fanMounts
    ) {
        const availableMounts = pcCase.fanMounts[fans.sizeMm] ?? 0;

        if (availableMounts < fans.count) {
            errors.push(
                `Корпус ${pcCase.name} підтримує лише ` +
                `${availableMounts} вентилятор(и) розміром ${fans.sizeMm} мм, ` +
                `але обраний комплект містить ${fans.count} шт.`
            );
        }
    }
}

    return errors;
}
