
export function checkCompatibility(selected) {
    const errors = [];

    const cpu = selected.cpu;
    const motherboard = selected.motherboard;

    // Перевірка сокета
    if (cpu && motherboard) {
        if (cpu.socket && motherboard.socket &&
            cpu.socket !== motherboard.socket) {
            errors.push(
                "Процесор несумісний із материнською платою: різні сокети."
            );
        }
    }

    return errors;
}
