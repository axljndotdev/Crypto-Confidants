import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function createBrandKitPdf() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfDoc = await PDFDocument.create();
  
  // Embed Fonts
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const brassColor = rgb(196 / 255, 172 / 255, 118 / 255); // #C4AC76
  const headerBg = rgb(30 / 255, 30 / 255, 30 / 255);    // #1E1E1E
  const textWhite = rgb(230 / 255, 230 / 255, 230 / 255);
  const textMuted = rgb(160 / 255, 160 / 255, 160 / 255);

  // --- Page 1 ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const { width, height } = page1.getSize();
  const margin = 45;
  let y = height - 50;

  // Title
  page1.drawText('CryptoConfidant.com', {
    x: margin,
    y: y,
    size: 24,
    font: fontHelveticaBold,
    color: brassColor,
  });

  y -= 22;
  page1.drawText('Developer Handoff — Website Source & Brand Reference Sheet', {
    x: margin,
    y: y,
    size: 11,
    font: fontHelvetica,
    color: textMuted,
  });

  y -= 15;
  page1.drawLine({
    start: { x: margin, y: y },
    end: { x: width - margin, y: y },
    thickness: 1,
    color: brassColor,
  });

  // Project Overview
  y -= 35;
  page1.drawText('1. Project Overview', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 20;
  const overviewLines = [
    'CryptoConfidant.com is a single-page sovereign marketing & educational platform offering global',
    'education on crypto self-custody, air-gapped cold storage, and financial portability, plus confidential',
    'consultation referral paths to independent licensed legal and fiduciary advisors.'
  ];
  for (const line of overviewLines) {
    page1.drawText(line, {
      x: margin,
      y: y,
      size: 10,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 15;
  }

  // Source Package Composition
  y -= 20;
  page1.drawText('2. Source Package Composition', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 20;
  const sourceFiles = [
    '• index.html — Primary document markup, meta tags, and CDN font links (Google Fonts & Fontshare)',
    '• src/index.css — CSS custom properties, theme tokens (data-theme="dark"/"light"), & brass gradients',
    '• src/App.tsx — Core application container layout and reactive section state handlers',
    '• src/components/ — Modular sub-components for Hero, Pillars, Security Audit, & Hardware Matrix',
    '• src/data.ts — Educational blueprints, cold storage hardware matrix, and security audit questions',
    '• public/Crypto-Confidants-Brand-Kit.pdf — Official offline brand specification reference (this document)'
  ];
  for (const fileLine of sourceFiles) {
    page1.drawText(fileLine, {
      x: margin,
      y: y,
      size: 9.5,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 16;
  }

  // Typography System
  y -= 20;
  page1.drawText('3. Typography System', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 20;
  page1.drawRectangle({
    x: margin,
    y: y - 5,
    width: width - margin * 2,
    height: 20,
    color: headerBg,
  });

  page1.drawText('FONT FAMILY', { x: margin + 10, y: y, size: 9, font: fontHelveticaBold, color: brassColor });
  page1.drawText('ROLE', { x: margin + 170, y: y, size: 9, font: fontHelveticaBold, color: brassColor });
  page1.drawText('SOURCE & WEIGHTS', { x: margin + 310, y: y, size: 9, font: fontHelveticaBold, color: brassColor });

  y -= 22;
  page1.drawText('Instrument Serif', { x: margin + 10, y: y, size: 9.5, font: fontHelvetica, color: textWhite });
  page1.drawText('Display / Headings', { x: margin + 170, y: y, size: 9.5, font: fontHelvetica, color: textWhite });
  page1.drawText('Google Fonts (Regular, Italic)', { x: margin + 310, y: y, size: 9.5, font: fontHelvetica, color: textWhite });

  y -= 18;
  page1.drawText('Switzer', { x: margin + 10, y: y, size: 9.5, font: fontHelvetica, color: textWhite });
  page1.drawText('Body / UI Text', { x: margin + 170, y: y, size: 9.5, font: fontHelvetica, color: textWhite });
  page1.drawText('Fontshare CDN (400, 500, 600, 700)', { x: margin + 310, y: y, size: 9.5, font: fontHelvetica, color: textWhite });

  // Color System
  y -= 35;
  page1.drawText('4. Color System & Theme Tokens', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 20;
  page1.drawRectangle({
    x: margin,
    y: y - 5,
    width: width - margin * 2,
    height: 20,
    color: headerBg,
  });

  page1.drawText('ROLE', { x: margin + 10, y: y, size: 9, font: fontHelveticaBold, color: brassColor });
  page1.drawText('LIGHT HEX', { x: margin + 130, y: y, size: 9, font: fontHelveticaBold, color: brassColor });
  page1.drawText('DARK HEX', { x: margin + 230, y: y, size: 9, font: fontHelveticaBold, color: brassColor });
  page1.drawText('USAGE', { x: margin + 330, y: y, size: 9, font: fontHelveticaBold, color: brassColor });

  const colors = [
    { role: 'Background', light: '#F5F2EA', dark: '#0D0D0D', usage: 'Page background canvas' },
    { role: 'Surface', light: '#FAF8F2', dark: '#121212', usage: 'Cards & container panels' },
    { role: 'Primary Text', light: '#1C1912', dark: '#E5E5E5', usage: 'Primary headlines & body' },
    { role: 'Muted Text', light: '#6B6252', dark: '#8E8E8E', usage: 'Subtitles & labels' },
    { role: 'Primary Brass', light: '#8A5A1E', dark: '#C4AC76', usage: 'CTAs, accents, and links' },
    { role: 'Border', light: '#CFC4A7', dark: 'rgba(255,255,255,0.1)', usage: 'Borders & dividers' }
  ];

  for (const c of colors) {
    y -= 18;
    page1.drawText(c.role, { x: margin + 10, y: y, size: 9, font: fontHelvetica, color: textMuted });
    page1.drawText(c.light, { x: margin + 130, y: y, size: 9, font: fontHelvetica, color: textMuted });
    page1.drawText(c.dark, { x: margin + 230, y: y, size: 9, font: fontHelvetica, color: textMuted });
    page1.drawText(c.usage, { x: margin + 330, y: y, size: 9, font: fontHelvetica, color: textMuted });
  }

  // --- Page 2 ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  y = height - 50;

  page2.drawText('5. Brand Logo Mark & Vector Geometry', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 20;
  const markDesc = [
    '• Shield + Keyhole Mark: Inline SVG displaying an outer security shield and central keyhole.',
    '• Brass Accent Gradient: linear-gradient(135deg, #E5D3A5 0%, #C4AC76 50%, #9E8550 100%).',
    '• Scalability: Vector-based inline SVG scales crisp across high-DPI and mobile displays.'
  ];
  for (const line of markDesc) {
    page2.drawText(line, {
      x: margin,
      y: y,
      size: 10,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 16;
  }

  y -= 25;
  page2.drawText('6. Developer Handoff Checklist', {
    x: margin,
    y: y,
    size: 14,
    font: fontHelveticaBold,
    color: textWhite,
  });

  y -= 20;
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
      size: 9.5,
      font: fontHelvetica,
      color: textMuted,
    });
    y -= 18;
  }

  // Footer on Page 2
  page2.drawText('CryptoConfidant.com — Confidential Brand Reference Document', {
    x: margin,
    y: 40,
    size: 8,
    font: fontHelvetica,
    color: textMuted,
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(publicDir, 'Crypto-Confidants-Brand-Kit.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log('PDF generated successfully with pdf-lib at:', outputPath);
}

createBrandKitPdf().catch(console.error);
