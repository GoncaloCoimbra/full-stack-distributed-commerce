export function calculatePercentiles(values: number[]) {
  const sorted = [...values].filter((value) => Number.isFinite(value)).sort((a, b) => a - b);

  if (sorted.length === 0) {
    return { p95: 0, p99: 0 };
  }

  const percentile = (rank: number) => {
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((rank / 100) * sorted.length) - 1));
    return sorted[index];
  };

  return {
    p95: percentile(95),
    p99: percentile(99),
  };
}

export function maskSensitiveValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.length === 0 ? '[MASKED]' : '[MASKED]';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return '[MASKED]';
  }

  return '[MASKED]';
}

export function parseSeedFile(content: string, filePath: string) {
  const extension = filePath.toLowerCase().split('.').pop();

  if (extension === 'json') {
    return JSON.parse(content);
  }

  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] ?? '';
      return acc;
    }, {} as Record<string, string>);
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}
