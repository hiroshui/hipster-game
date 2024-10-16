from PIL import Image

# Pfad zur WebP-Datei
webp_image_path = 'nn.webp'

# WebP-Datei laden
img = Image.open(webp_image_path)

# Ausgabegrößen definieren
sizes = [(192, 192), (512, 512)]

# Konvertieren und speichern
for size in sizes:
    output_path = f"icon_{size[0]}x{size[1]}.png"
    img_resized = img.resize(size, Image.Resampling.LANCZOS)  # Bild skalieren
    img_resized.save(output_path, 'PNG')  # Als PNG speichern
