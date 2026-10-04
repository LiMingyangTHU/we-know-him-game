from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
OUT = ROOT / "icons"
OUT.mkdir(exist_ok=True)

for size in (192, 512):
    image = Image.new("RGB", (size, size), "#091522")
    draw = ImageDraw.Draw(image)
    margin = int(size * .12)
    draw.rounded_rectangle((margin, margin, size-margin, size-margin), radius=int(size*.11), fill="#102c43", outline="#78b7a2", width=max(3, size//80))
    draw.ellipse((int(size*.29), int(size*.29), int(size*.71), int(size*.71)), outline="#e5ad78", width=max(5, size//42))
    draw.line((int(size*.63), int(size*.63), int(size*.80), int(size*.80)), fill="#e5ad78", width=max(8, size//28))
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", int(size*.22))
    except OSError:
        font = ImageFont.load_default()
    text = "证"
    box = draw.textbbox((0, 0), text, font=font)
    x = (size - (box[2]-box[0])) / 2
    y = (size - (box[3]-box[1])) / 2 - size*.035
    draw.text((x, y), text, font=font, fill="#edf3f8")
    image.save(OUT / f"icon-{size}.png", optimize=True)
