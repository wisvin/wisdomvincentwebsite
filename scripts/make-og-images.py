"""make-og-images.py — builds a 1200x630 share image (og:image) for every
case study that has a video poster or screenshot. Run after adding a
project:  python scripts/make-og-images.py
Workflow-diagram projects fall back to assets/images/og-card.jpg."""
import json, os, re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = open(os.path.join(ROOT, 'js', 'projects-data.js'), encoding='utf-8').read()
start = data.index('window.PROJECTS = ') + len('window.PROJECTS = ')
projects = json.loads(data[start:data.rindex(']') + 1])

css = open(os.path.join(ROOT, 'css', 'style.css'), encoding='utf-8').read()
shots = dict(re.findall(r"\.(tp-\d+) \{ background-image: url\('\.\./([^']+)'\); \}", css))

out_dir = os.path.join(ROOT, 'assets', 'images', 'og')
os.makedirs(out_dir, exist_ok=True)
W, H = 1200, 630
for p in projects:
    src = p.get('poster') or shots.get(p.get('previewClass', ''))
    if not src:
        continue
    im = Image.open(os.path.join(ROOT, src)).convert('RGB')
    scale = W / im.width
    im = im.resize((W, max(H, round(im.height * scale))), Image.LANCZOS)
    im = im.crop((0, 0, W, H))          # top of the page / frame
    im.save(os.path.join(out_dir, p['slug'] + '.jpg'), quality=82, optimize=True)
    print('og:', p['slug'])
