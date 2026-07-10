from pathlib import Path
path = Path('src/pages/shop/SubcategoryPage.tsx')
text = path.read_text(encoding='utf-8')
lines = text.splitlines()
for i in range(24, 71):
    print(f'{i+1}: {lines[i]}')
