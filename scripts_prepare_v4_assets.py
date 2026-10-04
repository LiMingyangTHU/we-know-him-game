from pathlib import Path
from PIL import Image

root = Path(__file__).parent
source = Image.open(root / "assets/images/cast-reference.webp")
output = root / "assets/characters"
output.mkdir(parents=True, exist_ok=True)
names = ["01-lin", "02-shen", "03-zhou", "04-tang", "05-lu", "06-xu", "07-jiang", "08-song", "09-liang"]
w, h = source.size
xs = [round(i * w / 3) for i in range(4)]
ys = [round(i * h / 3) for i in range(4)]
for i, name in enumerate(names):
    row, col = divmod(i, 3)
    x0, x1 = xs[col], xs[col + 1]
    y0, y1 = ys[row], ys[row + 1]
    dx, dy = int((x1 - x0) * .055), int((y1 - y0) * .035)
    crop = source.crop((x0 + dx, y0 + dy, x1 - dx, y1 - dy))
    crop.save(output / f"{name}.webp", "WEBP", quality=90, method=6)

generated = Path(r"C:\Users\35504\.codex\generated_images\01a0fd5e-02c0-7b73-9ba6-17e21df9b0c7\exec-66839092-13ee-468a-8e6c-d1407457b004.png")
image = Image.open(generated).convert("RGB")
image.save(root / "assets/images/lin-phone-natural-v4.webp", "WEBP", quality=90, method=6)
print(f"created {len(names)} portraits and lin-phone-natural-v4.webp")
