from pathlib import Path

path = Path('src/pages/shop/SubcategoryPage.tsx')
text = path.read_text(encoding='utf-8')
lines = text.splitlines()
start_line = 31 - 1
end_line = 41
old_lines = lines[start_line:end_line]
new_lines = [
    'function normalizeFilterValue(value?: string): string {',
    '  return (value ?? \'\')',
    '    .toLowerCase()',
    '    .normalize(\'NFD\')',
    '    .replace(/[\\u0300-\\u036f]/g, \'\')',
    '    .replace(/[-–—]/g, \' \')',
    '    .replace(/\\s+/g, \' \')',
    '    .trim();',
    '}',
]
if lines[start_line:end_line] != old_lines:
    raise SystemExit('Line slice mismatch; aborted patch.')
lines[start_line:end_line] = new_lines
path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('patched')
