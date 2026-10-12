#!/usr/bin/env python3
"""
Gera favicons e ícones oficiais de alta precisão para a BRS Reparações Automotivas.
"""

import os
from PIL import Image, ImageDraw, ImageFont

PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

def create_brand_icon_pillow(size=512):
    # Supersampling 2x para antialiasing perfeito
    scale = 2
    actual_size = size * scale
    
    # Imagem RGBA transparente
    img = Image.new("RGBA", (actual_size, actual_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Cantos arredondados
    corner_radius = int(actual_size * 0.22)
    border_width = int(actual_size * 0.028)
    
    # Desenha o fundo escuro grafite automotivo
    # Retângulo de base com cantos arredondados
    draw.rounded_rectangle(
        [(border_width, border_width), (actual_size - border_width, actual_size - border_width)],
        radius=corner_radius,
        fill=(15, 18, 24, 255),          # Grafite automotivo profundo #0f1218
        outline=(245, 158, 11, 255),      # Ouro âmbar #f59e0b
        width=border_width
    )

    # Friso superior sutil em dourado metálico
    friso_y = int(actual_size * 0.20)
    friso_margin = int(actual_size * 0.25)
    draw.line(
        [(friso_margin, friso_y), (actual_size - friso_margin, friso_y)],
        fill=(217, 119, 6, 160),
        width=int(actual_size * 0.008)
    )

    # Tipografia das letras BRS
    font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
    if not os.path.exists(font_path):
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

    font_main = ImageFont.truetype(font_path, int(actual_size * 0.36))
    font_sub  = ImageFont.truetype(font_path, int(actual_size * 0.065))

    # Coordenadas do texto "BR" e "S"
    # "BR" em branco puro #ffffff, "S" em âmbar dourado #f59e0b
    text_br = "BR"
    text_s  = "S"

    bbox_br = draw.textbbox((0, 0), text_br, font=font_main)
    w_br = bbox_br[2] - bbox_br[0]
    h_br = bbox_br[3] - bbox_br[1]

    bbox_s = draw.textbbox((0, 0), text_s, font=font_main)
    w_s = bbox_s[2] - bbox_s[0]

    spacing = int(actual_size * 0.01)
    total_w = w_br + spacing + w_s

    start_x = (actual_size - total_w) // 2
    # Alinhamento vertical ligeiramente acima do centro para dar espaço ao subtítulo
    y_pos = int(actual_size * 0.25)

    # Desenha "BR"
    draw.text((start_x, y_pos), text_br, font=font_main, fill=(255, 255, 255, 255))
    # Desenha "S"
    draw.text((start_x + w_br + spacing, y_pos), text_s, font=font_main, fill=(245, 158, 11, 255))

    # Friso metálico divisor abaixo do monograma
    divider_y = int(actual_size * 0.70)
    divider_w = int(actual_size * 0.54)
    div_start_x = (actual_size - divider_w) // 2
    draw.line(
        [(div_start_x, divider_y), (div_start_x + divider_w, divider_y)],
        fill=(245, 158, 11, 255),
        width=int(actual_size * 0.015)
    )

    # Subtítulo "REPARAÇÕES"
    sub_text = "REPARAÇÕES"
    bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
    w_sub = bbox_sub[2] - bbox_sub[0]
    sub_x = (actual_size - w_sub) // 2
    sub_y = int(actual_size * 0.76)
    draw.text((sub_x, sub_y), sub_text, font=font_sub, fill=(156, 163, 175, 255))

    # Reduz de volta para o tamanho alvo com LANCZOS de alta qualidade
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img


def create_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#181c24"/>
      <stop offset="50%" stop-color="#0f1218"/>
      <stop offset="100%" stop-color="#090a0d"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>

  <!-- Fundo Grafite Automotivo com cantos arredondados -->
  <rect x="14" y="14" width="484" height="484" rx="112" fill="url(#bg)" stroke="url(#gold)" stroke-width="14"/>

  <!-- Friso superior automotivo discreto -->
  <line x1="128" y1="102" x2="384" y2="102" stroke="url(#gold)" stroke-width="4" stroke-opacity="0.4" stroke-linecap="round"/>

  <!-- Monograma BRS -->
  <g font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="184" letter-spacing="-3">
    <text x="256" y="320" text-anchor="middle">
      <tspan fill="#FFFFFF">BR</tspan><tspan fill="url(#gold)">S</tspan>
    </text>
  </g>

  <!-- Friso divisor âmbar dourado -->
  <line x1="118" y1="360" x2="394" y2="360" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>

  <!-- Subtítulo técnico REPARAÇÕES -->
  <text x="256" y="414" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="33" letter-spacing="10" fill="#9CA3AF">REPARAÇÕES</text>
</svg>'''


def main():
    # 1. Salvar SVG
    svg_path = os.path.join(PUBLIC_DIR, "favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(create_svg())
    print(f"Salvo: {svg_path}")

    # 2. Gerar PNG 512
    img_512 = create_brand_icon_pillow(512)
    png_512 = os.path.join(PUBLIC_DIR, "web-app-manifest-512x512.png")
    img_512.save(png_512, "PNG", optimize=True)
    print(f"Salvo: {png_512}")

    # 3. Gerar PNG 192
    img_192 = img_512.resize((192, 192), Image.Resampling.LANCZOS)
    png_192 = os.path.join(PUBLIC_DIR, "web-app-manifest-192x192.png")
    img_192.save(png_192, "PNG", optimize=True)
    print(f"Salvo: {png_192}")

    # 4. Gerar Apple Touch Icon (180x180)
    img_180 = img_512.resize((180, 180), Image.Resampling.LANCZOS)
    png_180 = os.path.join(PUBLIC_DIR, "apple-touch-icon.png")
    img_180.save(png_180, "PNG", optimize=True)
    print(f"Salvo: {png_180}")

    # 5. Gerar Favicon 96x96
    img_96 = img_512.resize((96, 96), Image.Resampling.LANCZOS)
    png_96 = os.path.join(PUBLIC_DIR, "favicon-96x96.png")
    img_96.save(png_96, "PNG", optimize=True)
    print(f"Salvo: {png_96}")

    # 6. Gerar favicon.ico com camadas (16x16, 32x32, 48x48)
    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    img_512.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Salvo: {ico_path} (tamanhos 16x16, 32x32, 48x48)")

if __name__ == "__main__":
    main()
