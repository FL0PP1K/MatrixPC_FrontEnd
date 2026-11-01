export function checkCompatibility(selected) {
    const errors = [];

    const cpu = selected.cpu;
    const motherboard = selected.motherboard;
    const ram = selected.ram;
    const pcCase = selected.case;
    const gpu = selected.gpu;
    const psu = selected.psu;
    const cooler = selected.cooler;
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

    return errors;
}
