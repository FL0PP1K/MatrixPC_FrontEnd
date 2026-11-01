export function checkCompatibility(selected) {
    const errors = [];

    const cpu = selected.cpu;
    const motherboard = selected.motherboard;
    const ram = selected.ram;
    const pcCase = selected.case;
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
    return errors;
}
