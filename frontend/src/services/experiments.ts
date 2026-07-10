const STORAGE_KEY = 'Tranzor:ab-variants';

const experimentOptions: Record<string, string[]> = {
  cart_upsell: ['control', 'variant'],
  pdp_compare_cta: ['control', 'variant'],
};

function readVariants() {
  if (typeof window === 'undefined') {
    return {} as Record<string, string>;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {} as Record<string, string>;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {} as Record<string, string>;
  }
}

function persistVariants(variants: Record<string, string>) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(variants));
  } catch {
    // noop
  }
}

export function getVariant(experiment: keyof typeof experimentOptions) {
  const options = experimentOptions[experiment] ?? ['control'];

  if (typeof window === 'undefined') {
    return options[0];
  }

  const variants = readVariants();
  if (variants[experiment]) {
    return variants[experiment];
  }

  const nextVariant = options[Math.floor(Math.random() * options.length)];
  variants[experiment] = nextVariant;
  persistVariants(variants);

  return nextVariant;
}

export function isVariant(experiment: keyof typeof experimentOptions, variant: string) {
  return getVariant(experiment) === variant;
}
