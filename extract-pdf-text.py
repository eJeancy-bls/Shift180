# extract-pdf-text.py -> extrait le texte des PDF de resource/ vers .impeccable/pdf-txt/
import sys, pathlib
from pypdf import PdfReader

src_dir = pathlib.Path('resource')
out_dir = pathlib.Path('.impeccable/pdf-txt')
out_dir.mkdir(parents=True, exist_ok=True)

name = sys.argv[1] if len(sys.argv) > 1 else None
for pdf in sorted(src_dir.glob('*.pdf')):
    if name and name.lower() not in pdf.name.lower():
        continue
    r = PdfReader(str(pdf))
    parts = []
    for i, page in enumerate(r.pages):
        parts.append(f'\n--- PAGE {i+1} ---\n' + (page.extract_text() or ''))
    txt = '\n'.join(parts)
    out = out_dir / (pdf.stem + '.txt')
    out.write_text(txt, encoding='utf-8')
    print(f'{pdf.name}: {len(r.pages)} pages -> {out} ({len(txt)} car.)')
