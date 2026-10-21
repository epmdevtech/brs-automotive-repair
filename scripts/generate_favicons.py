#!/usr/bin/env python3
"""
Gera favicons e ícones oficiais a partir do ícone canônico da Master.

Fonte única de verdade: public/master/icon-512.png (recorte oficial da logo).
As cores vêm da identidade preto, vermelho e branco — sem dourado.
"""

import base64
import os

from PIL import Image

PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
SOURCE = os.path.join(PUBLIC_DIR, "master", "icon-512.png")


def load_source() -> Image.Image:
    if not os.path.exists(SOURCE):
        raise FileNotFoundError(f"Ícone canônico não encontrado: {SOURCE}")
    return Image.open(SOURCE).convert("RGBA")


def save_png(img: Image.Image, size: int, filename: str) -> None:
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    path = os.path.join(PUBLIC_DIR, filename)
    resized.save(path, "PNG", optimize=True)
    print(f"Salvo: {path}")


def create_svg(img: Image.Image) -> str:
    icon = img.resize((512, 512), Image.Resampling.LANCZOS)
    buffer = os.path.join(PUBLIC_DIR, ".favicon-tmp.png")
    icon.save(buffer, "PNG", optimize=True)
    with open(buffer, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("ascii")
    os.remove(buffer)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" '
        'width="100%" height="100%">'
        f'<image href="data:image/png;base64,{encoded}" width="512" height="512"/>'
        "</svg>"
    )


def main() -> None:
    img = load_source()

    svg_path = os.path.join(PUBLIC_DIR, "favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(create_svg(img))
    print(f"Salvo: {svg_path}")

    save_png(img, 512, "web-app-manifest-512x512.png")
    save_png(img, 192, "web-app-manifest-192x192.png")
    save_png(img, 180, "apple-touch-icon.png")
    save_png(img, 96, "favicon-96x96.png")

    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    img.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"Salvo: {ico_path} (16, 32, 48 e 64 px)")


if __name__ == "__main__":
    main()
