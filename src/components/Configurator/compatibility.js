export function checkCompatibility(selected) {
  const errors = [];
  const {
    cpu,
    motherboard,
    ram,
    case: pcCase,
    gpu,
    psu,
    cooler,
    ssd,
    fans,
  } = selected;

  if (
    cpu &&
    motherboard &&
    cpu.socket &&
    motherboard.socket &&
    cpu.socket !== motherboard.socket
  ) {
    errors.push("Процесор несумісний із материнською платою: різні сокети.");
  }

  if (
    ram &&
    motherboard &&
    ram.memoryType &&
    motherboard.memoryType &&
    ram.memoryType !== motherboard.memoryType
  ) {
    errors.push(
      `Оперативна пам'ять ${ram.memoryType} несумісна з материнською платою ${motherboard.memoryType}.`,
    );
  }

  if (
    motherboard &&
    pcCase &&
    motherboard.formFactor &&
    Array.isArray(pcCase.supportedFormFactors) &&
    !pcCase.supportedFormFactors.includes(motherboard.formFactor)
  ) {
    errors.push(
      `Материнська плата ${motherboard.formFactor} не підтримується корпусом ${pcCase.name}.`,
    );
  }

  if (
    gpu &&
    pcCase &&
    typeof gpu.lengthMm === "number" &&
    typeof pcCase.maxGpuLengthMm === "number" &&
    gpu.lengthMm > pcCase.maxGpuLengthMm
  ) {
    errors.push(
      `Відеокарта ${gpu.name} має довжину ${gpu.lengthMm} мм, але корпус ${pcCase.name} підтримує максимум ${pcCase.maxGpuLengthMm} мм.`,
    );
  }

  if (
    cpu &&
    gpu &&
    psu &&
    typeof cpu.powerW === "number" &&
    typeof gpu.powerW === "number" &&
    typeof psu.wattage === "number"
  ) {
    const recommendedPower = Math.ceil((cpu.powerW + gpu.powerW + 100) * 1.25);
    if (psu.wattage < recommendedPower) {
      errors.push(
        `Недостатня потужність блока живлення! Потрібно ${recommendedPower} Вт, але обраний блок має ${psu.wattage} Вт.`,
      );
    }
  }

  if (
    cpu &&
    cooler &&
    cpu.socket &&
    Array.isArray(cooler.supportedSockets) &&
    !cooler.supportedSockets.includes(cpu.socket)
  ) {
    errors.push(
      `Охолодження ${cooler.name} не підтримує сокет ${cpu.socket} процесора ${cpu.name}.`,
    );
  }

  if (cooler && pcCase) {
    if (
      cooler.type === "air" &&
      typeof cooler.heightMm === "number" &&
      typeof pcCase.maxCoolerHeightMm === "number" &&
      cooler.heightMm > pcCase.maxCoolerHeightMm
    ) {
      errors.push(
        `Охолодження ${cooler.name} має висоту ${cooler.heightMm} мм, але корпус підтримує максимум ${pcCase.maxCoolerHeightMm} мм.`,
      );
    }
    if (
      cooler.type === "liquid" &&
      typeof cooler.radiatorMm === "number" &&
      Array.isArray(pcCase.supportedRadiatorsMm) &&
      !pcCase.supportedRadiatorsMm.includes(cooler.radiatorMm)
    ) {
      errors.push(
        `Радіатор охолодження ${cooler.radiatorMm} мм не підтримується корпусом ${pcCase.name}.`,
      );
    }
  }

  if (
    ssd &&
    motherboard &&
    ssd.connector &&
    ssd.interface &&
    Array.isArray(motherboard.supportedStorage)
  ) {
    const isSupported = motherboard.supportedStorage.some(
      (s) => s.connector === ssd.connector && s.interface === ssd.interface,
    );
    if (!isSupported) {
      errors.push(
        `SSD ${ssd.name} (${ssd.connector} ${ssd.interface}) несумісний із материнською платою ${motherboard.name}.`,
      );
    }
  }

  if (
    fans &&
    pcCase &&
    typeof fans.sizeMm === "number" &&
    typeof fans.count === "number" &&
    pcCase.fanMounts
  ) {
    const availableMounts = pcCase.fanMounts[fans.sizeMm] ?? 0;
    if (availableMounts < fans.count) {
      errors.push(
        `Корпус ${pcCase.name} підтримує лише ${availableMounts} вентилятор(и) ${fans.sizeMm} мм, але комплект містить ${fans.count} шт.`,
      );
    }
  }

  return errors;
}
