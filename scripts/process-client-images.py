#!/usr/bin/env python3
"""Publica as imagens oficiais da oficina e deriva hero, Open Graph e relatório.

Uso:
    python3 scripts/process-client-images.py
    python3 scripts/process-client-images.py --originals assets-originais/divulgacao

As imagens oficiais fornecidas pelo cliente já trazem as placas substituídas pela
marca **MASTER**. Elas são a base dos registros da oficina no site, dos recortes do
hero e do Open Graph. A única arte com placas reais remanescentes (céu nublado)
recebe pixelização, desfoque e véu escuro localizados.

Os originais ficam fora de `src/` e de `public/` (diretório ignorado pelo Git),
portanto nunca são copiados para o bundle de produção. Nenhum número de placa é
registrado em nomes de arquivo, metadados, relatório ou texto alternativo.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_ORIGINALS = REPO_ROOT / "assets-originais" / "divulgacao"
CLIENT_OUTPUT = REPO_ROOT / "src" / "assets" / "cliente"
PUBLIC_HERO = REPO_ROOT / "public" / "hero"
PUBLIC_MASTER = REPO_ROOT / "public" / "master"
REPORT_PATH = REPO_ROOT / "docs" / "image-treatment-report.json"


@dataclass(frozen=True)
class OfficialImage:
    source: str
    output: str
    description: str
    max_width: int = 1600
    regions: tuple[tuple[int, int, int, int], ...] = ()


OFFICIAL_IMAGES: tuple[OfficialImage, ...] = (
    OfficialImage(
        source="original-oficial-fachada-branco.png",
        output="oficina-fachada-01.jpg",
        description="Fachada da oficina com caminhão-plataforma branco e placas com a marca.",
    ),
    OfficialImage(
        source="original-oficial-fachada-vw.png",
        output="oficina-fachada-02.jpg",
        description="Fachada da oficina com caminhão-plataforma Volkswagen e placas com a marca.",
    ),
    OfficialImage(
        source="original-oficial-fachada-ceu-nublado.png",
        output="oficina-fachada-03.jpg",
        description="Fachada da oficina sob céu nublado, com veículos ao fundo.",
        regions=(
            (1356, 762, 60, 24),
            (1582, 776, 62, 20),
        ),
    ),
    OfficialImage(
        source="original-oficial-fachada-02.jpg",
        output="oficina-fachada-04.jpg",
        description="Fachada da oficina em plano aberto, com veículo na recepção.",
        max_width=1280,
    ),
    OfficialImage(
        source="original-oficial-estufa-01.jpg",
        output="estufa-acabamento-01.jpg",
        description="Veículo branco na estufa de pintura, com placa da marca.",
        max_width=1280,
    ),
    OfficialImage(
        source="original-oficial-estufa-02.jpg",
        output="estufa-acabamento-02.jpg",
        description="Veículo branco finalizado na estufa de pintura, com placa da marca.",
        max_width=1280,
    ),
)

HERO_DESKTOP_CROP = (0, 122, 1280, 720)
HERO_MOBILE_CROP = (190, 0, 900, 964)


def redact_region(image: Image.Image, region: tuple[int, int, int, int]) -> None:
    """Aplica pixelização forte + desfoque + leve véu escuro somente à região da placa."""
    x, y, width, height = region
    pad = 5
    left = max(0, x - pad)
    top = max(0, y - pad)
    right = min(image.width, x + width + pad)
    bottom = min(image.height, y + height + pad)
    box = (left, top, right, bottom)
    if right <= left or bottom <= top:
        return

    patch = image.crop(box)
    tiny = patch.resize(
        (max(1, patch.width // 12), max(1, patch.height // 12)),
        Image.Resampling.BILINEAR,
    )
    pixelated = tiny.resize(patch.size, Image.Resampling.NEAREST)
    blurred = pixelated.filter(ImageFilter.GaussianBlur(radius=3.2))

    veil = Image.new("RGBA", blurred.size, (8, 10, 12, 38))
    base = blurred.convert("RGBA")
    base.alpha_composite(veil)
    image.paste(base.convert("RGB"), box)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def save_jpeg(image: Image.Image, path: Path, quality: int = 86) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(path, format="JPEG", quality=quality, optimize=True, progressive=True)


def save_webp(image: Image.Image, path: Path, quality: int = 82) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(path, format="WEBP", quality=quality, method=6)


def save_avif(image: Image.Image, path: Path, quality: int = 52) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(path, format="AVIF", quality=quality)


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def process_official_images(originals: Path) -> list[dict[str, object]]:
    report: list[dict[str, object]] = []
    processed: dict[str, Image.Image] = {}

    for asset in OFFICIAL_IMAGES:
        source = originals / asset.source
        if not source.exists():
            raise SystemExit(f"Imagem oficial ausente: {source}")

        image = Image.open(source).convert("RGB")
        for region in asset.regions:
            redact_region(image, region)
        if image.width > asset.max_width:
            image = resize_to_width(image, asset.max_width)

        destination = CLIENT_OUTPUT / asset.output
        save_jpeg(image, destination, quality=86)
        processed[asset.output] = image
        report.append(
            {
                "original": asset.source,
                "published": str(destination.relative_to(REPO_ROOT)),
                "dimensions": list(image.size),
                "description": asset.description,
                "redacted_regions": [list(region) for region in asset.regions],
                "sha256": sha256(destination),
            }
        )

    hero = processed["estufa-acabamento-01.jpg"]
    desktop = hero.crop(
        (
            HERO_DESKTOP_CROP[0],
            HERO_DESKTOP_CROP[1],
            HERO_DESKTOP_CROP[0] + HERO_DESKTOP_CROP[2],
            HERO_DESKTOP_CROP[1] + HERO_DESKTOP_CROP[3],
        )
    )
    mobile = hero.crop(
        (
            HERO_MOBILE_CROP[0],
            HERO_MOBILE_CROP[1],
            HERO_MOBILE_CROP[0] + HERO_MOBILE_CROP[2],
            HERO_MOBILE_CROP[1] + HERO_MOBILE_CROP[3],
        )
    )

    save_jpeg(desktop, CLIENT_OUTPUT / "estufa-acabamento-01-desktop.jpg")
    save_jpeg(mobile, CLIENT_OUTPUT / "estufa-acabamento-01-mobile.jpg")

    for width in (1280, 960, 640):
        variant = resize_to_width(desktop, width)
        save_avif(variant, PUBLIC_HERO / f"master-hero-{width}.avif")
        save_webp(variant, PUBLIC_HERO / f"master-hero-{width}.webp")

    for width in (900, 600):
        variant = resize_to_width(mobile, width)
        save_avif(variant, PUBLIC_HERO / f"master-hero-mobile-{width}.avif")
        save_webp(variant, PUBLIC_HERO / f"master-hero-mobile-{width}.webp")

    fachada = processed["oficina-fachada-01.jpg"]
    og_base = fachada.resize(
        (1200, round(fachada.height * 1200 / fachada.width)), Image.Resampling.LANCZOS
    )
    og = og_base.crop((0, 36, 1200, 36 + 630))
    save_jpeg(og, PUBLIC_MASTER / "og-master.jpg", quality=88)

    report.append(
        {
            "published": "src/assets/cliente/estufa-acabamento-01-desktop.jpg",
            "dimensions": [1280, 720],
            "description": "Recorte desktop do hero derivado da estufa oficial.",
            "redacted_regions": "derivado de estufa-acabamento-01.jpg",
        }
    )
    report.append(
        {
            "published": "src/assets/cliente/estufa-acabamento-01-mobile.jpg",
            "dimensions": [900, 964],
            "description": "Recorte mobile do hero derivado da estufa oficial.",
            "redacted_regions": "derivado de estufa-acabamento-01.jpg",
        }
    )
    report.append(
        {
            "published": "public/hero/master-hero-*.avif|webp",
            "dimensions": [[640, 360], [960, 540], [1280, 720], [600, 643], [900, 964]],
            "description": "Variantes responsivas do hero derivadas da estufa oficial.",
            "redacted_regions": "derivado de estufa-acabamento-01.jpg",
        }
    )
    report.append(
        {
            "published": "public/master/og-master.jpg",
            "dimensions": [1200, 630],
            "description": "Cartão social derivado da fachada oficial com guincho branco.",
            "redacted_regions": "derivado de oficina-fachada-01.jpg",
        }
    )
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--originals",
        type=Path,
        default=DEFAULT_ORIGINALS,
        help="Diretório com as imagens oficiais renomeadas de forma neutra (fora do bundle).",
    )
    args = parser.parse_args()

    report = process_official_images(args.originals)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(
        json.dumps(
            {
                "generated_by": "scripts/process-client-images.py",
                "policy": "Imagens oficiais com placas substituídas pela marca; originais fora de src/ e public/.",
                "assets": report,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"{len(report)} entradas processadas. Relatório: {REPORT_PATH.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
