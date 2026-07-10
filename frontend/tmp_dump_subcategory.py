from pathlib import Path
path = Path('src/pages/shop/SubcategoryPage.tsx')
text = path.read_text(encoding='utf-8')
lines = text.splitlines()
for i in range(30, 42):
    print(repr(lines[i]))
