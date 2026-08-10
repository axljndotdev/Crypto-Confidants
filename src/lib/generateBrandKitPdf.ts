import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function svgToPngBytes(svgString: string, size = 300): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
          if (blob) {
            blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
          } else {
            reject(new Error('Canvas blob failed'));
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

// SVG Logo Strings
const logoSvgDark = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#131210"/>
  <defs>
    <linearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2B876" />
      <stop offset="50%" stop-color="#C99A52" />
      <stop offset="100%" stop-color="#A97C3C" />
    </linearGradient>
  </defs>
  <path d="M50 8L88 22V48C88 71.5 71.8 90.8 50 96C28.2 90.8 12 71.5 12 48V22L50 8Z" fill="rgba(201, 154, 82, 0.15)" stroke="url(#b1)" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M50 16L80 27.5V48C80 66.8 67 82.5 50 87.2C33 82.5 20 66.8 20 48V27.5L50 16Z" fill="none" stroke="url(#b1)" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8"/>
  <circle cx="50" cy="42" r="9" fill="url(#b1)"/>
  <path d="M44 48L42 66C42 67.1 42.9 68 44 68H56C57.1 68 58 67.1 58 66L56 48H44Z" fill="url(#b1)"/>
  <circle cx="50" cy="42" r="2.5" fill="#131210"/>
</svg>`;

const logoSvgLight = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#FAF8F2"/>
  <defs>
    <linearGradient id="b2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8A5A1E" />
      <stop offset="50%" stop-color="#A97C3C" />
      <stop offset="100%" stop-color="#C99A52" />
    </linearGradient>
  </defs>
  <path d="M50 8L88 22V48C88 71.5 71.8 90.8 50 96C28.2 90.8 12 71.5 12 48V22L50 8Z" fill="rgba(138, 90, 30, 0.08)" stroke="url(#b2)" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M50 16L80 27.5V48C80 66.8 67 82.5 50 87.2C33 82.5 20 66.8 20 48V27.5L50 16Z" fill="none" stroke="url(#b2)" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8"/>
  <circle cx="50" cy="42" r="9" fill="url(#b2)"/>
  <path d="M44 48L42 66C42 67.1 42.9 68 44 68H56C57.1 68 58 67.1 58 66L56 48H44Z" fill="url(#b2)"/>
  <circle cx="50" cy="42" r="2.5" fill="#FAF8F2"/>
</svg>`;

const logoSvgSolid = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#131210"/>
  <defs>
    <linearGradient id="b3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2B876" />
      <stop offset="50%" stop-color="#C99A52" />
      <stop offset="100%" stop-color="#A97C3C" />
    </linearGradient>
  </defs>
  <path d="M50 8L88 22V48C88 71.5 71.8 90.8 50 96C28.2 90.8 12 71.5 12 48V22L50 8Z" fill="url(#b3)"/>
  <path d="M50 16L80 27.5V48C80 66.8 67 82.5 50 87.2C33 82.5 20 66.8 20 48V27.5L50 16Z" fill="none" stroke="#131210" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8"/>
  <circle cx="50" cy="42" r="9" fill="#131210"/>
  <path d="M44 48L42 66C42 67.1 42.9 68 44 68H56C57.1 68 58 67.1 58 66L56 48H44Z" fill="#131210"/>
  <circle cx="50" cy="42" r="2.5" fill="url(#b3)"/>
</svg>`;

export async function downloadBrandKitPdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Embed Standard Fonts
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Render SVG Logos to PNG bytes
  const pngBytesDark = await svgToPngBytes(logoSvgDark, 300);
  const pngBytesLight = await svgToPngBytes(logoSvgLight, 300);
  const pngBytesSolid = await svgToPngBytes(logoSvgSolid, 300);

  const imgDark = await pdfDoc.embedPng(pngBytesDark);
  const imgLight = await pdfDoc.embedPng(pngBytesLight);
  const imgSolid = await pdfDoc.embedPng(pngBytesSolid);

  // Define Color Palette
  const brassColor = rgb(196 / 255, 172 / 255, 118 / 255); // #C4AC76
  const headerBg = rgb(30 / 255, 30 / 255, 30 / 255);    // #1E1E1E
  const textWhite = rgb(230 / 255, 230 / 255, 230 / 255);
  const textMuted = rgb(160 / 255, 160 / 255, 160 / 255);

  // --- Page 1 ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
  const { width, height } = page1.getSize();
  const margin = 45;
  let y = height - 50;

  // Header Logo Image + Title
  page1.drawImage(imgDark, {
    x: margin,
    y: y - 10,
    width: 44,
    height: 44,
  });

  page1.drawText('CryptoConfidant.com', {
    x: margin + 54,
    y: y + 10,
    size: 22,
    font: fontHelveticaBold,
    color: brassColor,
  });

  page1.drawText('Developer Handoff — Website Source & Brand Reference Sheet', {
    x: margin + 54,
    y: y - 6,
    size: 10,
    font: fontHelvetica,
    color: textMuted,
  });

  y -= 25;
  page1.drawLine({
    start: { x: margin, y: y },
    end: { x: width - margin, y: y },
    thickness: 1,
    color: brassColor,
  });

  // Section 1: Overview
  y -= 30;
  page1.drawText('1. Project Overview', {
    x: margin,
    y: y,
    size: 13,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 18;
  const overviewLines = [
    'CryptoConfidant.com is a single-page sovereign marketing & educational platform offering global',
    'education on crypto self-custody, air-gapped cold storage, and financial portability, plus confidential',
    'consultation referral paths to independent licensed legal and fiduciary advisors.'
  ];
  for (const line of overviewLines) {
    page1.drawText(line, {
      x: margin,
      y: y,
      size: 9.5,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 14;
  }

  // Section 2: Source Files
  y -= 18;
  page1.drawText('2. Source Package Composition', {
    x: margin,
    y: y,
    size: 13,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 18;
  const sourceFiles = [
    '• index.html — Primary document markup, meta tags, and CDN font links (Google Fonts & Fontshare)',
    '• src/index.css — CSS custom properties, theme tokens (data-theme="dark"/"light"), & brass gradients',
    '• src/App.tsx — Core application container layout and reactive section state handlers',
    '• src/components/ — Modular sub-components for Hero, Pillars, Security Audit, & Hardware Matrix',
    '• src/data.ts — Educational blueprints, cold storage hardware matrix, and security audit questions',
    '• Crypto-Confidants-Brand-Kit.pdf — Official offline brand specification reference (this document)'
  ];
  for (const fileLine of sourceFiles) {
    page1.drawText(fileLine, {
      x: margin,
      y: y,
      size: 9,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 15;
  }

  // Section 3: Typography System
  y -= 18;
  page1.drawText('3. Typography System', {
    x: margin,
    y: y,
    size: 13,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 18;
  page1.drawRectangle({
    x: margin,
    y: y - 5,
    width: width - margin * 2,
    height: 18,
    color: headerBg,
  });

  page1.drawText('FONT FAMILY', { x: margin + 10, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });
  page1.drawText('ROLE', { x: margin + 170, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });
  page1.drawText('SOURCE & WEIGHTS', { x: margin + 310, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });

  y -= 20;
  page1.drawText('Instrument Serif', { x: margin + 10, y: y, size: 9, font: fontHelvetica, color: textWhite });
  page1.drawText('Display / Headings', { x: margin + 170, y: y, size: 9, font: fontHelvetica, color: textWhite });
  page1.drawText('Google Fonts (Regular, Italic)', { x: margin + 310, y: y, size: 9, font: fontHelvetica, color: textWhite });

  y -= 16;
  page1.drawText('Switzer', { x: margin + 10, y: y, size: 9, font: fontHelvetica, color: textWhite });
  page1.drawText('Body / UI Text', { x: margin + 170, y: y, size: 9, font: fontHelvetica, color: textWhite });
  page1.drawText('Fontshare CDN (400, 500, 600, 700)', { x: margin + 310, y: y, size: 9, font: fontHelvetica, color: textWhite });

  // Section 4: Color Palette
  y -= 30;
  page1.drawText('4. Color System & Theme Tokens', {
    x: margin,
    y: y,
    size: 13,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 18;
  page1.drawRectangle({
    x: margin,
    y: y - 5,
    width: width - margin * 2,
    height: 18,
    color: headerBg,
  });

  page1.drawText('ROLE', { x: margin + 10, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });
  page1.drawText('LIGHT HEX', { x: margin + 130, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });
  page1.drawText('DARK HEX', { x: margin + 230, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });
  page1.drawText('USAGE', { x: margin + 330, y: y, size: 8.5, font: fontHelveticaBold, color: brassColor });

  const colors = [
    { role: 'Background', light: '#F5F2EA', dark: '#0D0D0D', usage: 'Page background canvas' },
    { role: 'Surface', light: '#FAF8F2', dark: '#121212', usage: 'Cards & container panels' },
    { role: 'Primary Text', light: '#1C1912', dark: '#E5E5E5', usage: 'Primary headlines & body' },
    { role: 'Muted Text', light: '#6B6252', dark: '#8E8E8E', usage: 'Subtitles & labels' },
    { role: 'Primary Brass', light: '#8A5A1E', dark: '#C4AC76', usage: 'CTAs, accents, and links' },
    { role: 'Border', light: '#CFC4A7', dark: 'rgba(255,255,255,0.1)', usage: 'Borders & dividers' }
  ];

  for (const c of colors) {
    y -= 16;
    page1.drawText(c.role, { x: margin + 10, y: y, size: 8.5, font: fontHelvetica, color: textMuted });
    page1.drawText(c.light, { x: margin + 130, y: y, size: 8.5, font: fontHelvetica, color: textMuted });
    page1.drawText(c.dark, { x: margin + 230, y: y, size: 8.5, font: fontHelvetica, color: textMuted });
    page1.drawText(c.usage, { x: margin + 330, y: y, size: 8.5, font: fontHelvetica, color: textMuted });
  }

  // --- Page 2 ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  y = height - 50;

  page2.drawText('5. Brand Logo Marks & Visual Identity Geometry', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 18;
  page2.drawText('The sovereign shield and keyhole symbol represents non-custodial protection & air-gapped security.', {
    x: margin,
    y: y,
    size: 9.5,
    font: fontHelvetica,
    color: textMuted,
  });

  // Render Visual Logo Cards Grid
  y -= 120;
  const cardWidth = 150;
  const cardHeight = 110;

  // Card 1: Dark Brass
  page2.drawRectangle({
    x: margin,
    y: y,
    width: cardWidth,
    height: cardHeight,
    color: rgb(19 / 255, 18 / 255, 16 / 255),
    borderColor: brassColor,
    borderWidth: 1,
  });
  page2.drawImage(imgDark, {
    x: margin + 45,
    y: y + 35,
    width: 60,
    height: 60,
  });
  page2.drawText('Obsidian Brass Shield', {
    x: margin + 22,
    y: y + 15,
    size: 8.5,
    font: fontHelveticaBold,
    color: brassColor,
  });

  // Card 2: Light Parchment Brass
  const card2X = margin + cardWidth + 25;
  page2.drawRectangle({
    x: card2X,
    y: y,
    width: cardWidth,
    height: cardHeight,
    color: rgb(250 / 255, 248 / 255, 242 / 255),
    borderColor: rgb(207 / 255, 196 / 255, 167 / 255),
    borderWidth: 1,
  });
  page2.drawImage(imgLight, {
    x: card2X + 45,
    y: y + 35,
    width: 60,
    height: 60,
  });
  page2.drawText('Parchment Light Shield', {
    x: card2X + 22,
    y: y + 15,
    size: 8.5,
    font: fontHelveticaBold,
    color: rgb(138 / 255, 90 / 255, 30 / 255),
  });

  // Card 3: Solid Accent Shield
  const card3X = margin + (cardWidth + 25) * 2;
  page2.drawRectangle({
    x: card3X,
    y: y,
    width: cardWidth,
    height: cardHeight,
    color: rgb(19 / 255, 18 / 255, 16 / 255),
    borderColor: brassColor,
    borderWidth: 1,
  });
  page2.drawImage(imgSolid, {
    x: card3X + 45,
    y: y + 35,
    width: 60,
    height: 60,
  });
  page2.drawText('Solid Brass Emblem', {
    x: card3X + 28,
    y: y + 15,
    size: 8.5,
    font: fontHelveticaBold,
    color: brassColor,
  });

  // Logo Vector Specifications
  y -= 35;
  page2.drawText('Logo Mark Vector Specifications', {
    x: margin,
    y: y,
    size: 11,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 16;
  const markSpecs = [
    '• Outer Shield Vector: M50 8L88 22V48C88 71.5 71.8 90.8 50 96C28.2 90.8 12 71.5 12 48V22L50 8Z',
    '• Inner Inset Guideline: M50 16L80 27.5V48C80 66.8 67 82.5 50 87.2C33 82.5 20 66.8 20 48V27.5L50 16Z',
    '• Central Keyhole Core: Circle cx="50" cy="42" r="9" + Trapezoid Body M44 48L42 66H56L58 66L56 48Z',
    '• Primary Metallic Gradient: linear-gradient(135deg, #E2B876 0%, #C99A52 50%, #A97C3C 100%)'
  ];
  for (const spec of markSpecs) {
    page2.drawText(spec, {
      x: margin,
      y: y,
      size: 9,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 15;
  }

  // Section 6: Developer Handoff Checklist
  y -= 25;
  page2.drawText('6. Developer Handoff Checklist', {
    x: margin,
    y: y,
    size: 13,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 18;
  const checklist = [
    '[x] Confirm web fonts (Instrument Serif & Switzer) load cleanly without CORS blockage.',
    '[x] Test both Light theme and Sophisticated Dark theme states via data-theme attribute.',
    '[x] Ensure zero-dependency client-side execution with responsive Tailwind CSS styling.',
    '[x] Validate encrypted consultation referral form dispatches without storing private key inputs.'
  ];
  for (const item of checklist) {
    page2.drawText(item, {
      x: margin,
      y: y,
      size: 9,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 16;
  }

  page2.drawText('CryptoConfidant.com — Confidential Brand Reference Document', {
    x: margin,
    y: 40,
    size: 8,
    font: fontHelvetica,
    color: textMuted,
  });

  // Generate binary ArrayBuffer and trigger immediate download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Crypto-Confidants-Brand-Kit.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
