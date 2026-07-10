const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function addLocalDevOrigins(values: Set<string>) {
  const hosts = ['http://localhost:', 'http://127.0.0.1:', 'https://localhost:', 'https://127.0.0.1:'];

  hosts.forEach((prefix) => {
    for (let port = 5173; port <= 5190; port += 1) {
      values.add(`${prefix}${port}`);
    }
  });
}

export function parseAllowedOrigins(frontendUrl?: string, corsOrigin?: string): string[] {
  const values = new Set<string>();

  [frontendUrl, corsOrigin]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(',').map((entry) => entry.trim()).filter(Boolean))
    .forEach((value) => values.add(value));

  DEFAULT_ALLOWED_ORIGINS.forEach((value) => values.add(value));
  addLocalDevOrigins(values);

  return Array.from(values);
}

export function isOriginAllowed(origin: string | undefined, frontendUrl?: string, corsOrigin?: string): boolean {
  if (!origin) {
    return true;
  }

  return parseAllowedOrigins(frontendUrl, corsOrigin).includes(origin);
}

export function getAllowedOrigins(frontendUrl?: string, corsOrigin?: string): string[] {
  return parseAllowedOrigins(frontendUrl, corsOrigin);
}
