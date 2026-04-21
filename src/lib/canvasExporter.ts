import type { BSTIResult } from '../data/bsti';

const theme = {
  N: { bg1: '#e6fffa', bg2: '#ccfbf1', text: '#0f766e', badge: '#14b8a6' }, // Bright Mint
  R: { bg1: '#e0f2fe', bg2: '#bae6fd', text: '#0369a1', badge: '#38bdf8' }, // Vivid Sky Blue
  SR: { bg1: '#fae8ff', bg2: '#fbcfe8', text: '#9d174d', badge: '#f472b6' }, // Bright Pink/Rose
  UR: { bg1: '#fffbeb', bg2: '#fef08a', text: '#a16207', badge: '#f59e0b' }  // Sunny Yellow/Gold
};

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = '';
  for (const ch of chars) {
    const test = line + ch;
    const w = ctx.measureText(test).width;
    if (w > maxW && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateCardImage(result: BSTIResult, imageUrl: string): Promise<string> {
  const W = 800;
  const H = 1400;
  
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Background
  const rarityTheme = theme[result.rarity];
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, rarityTheme.bg1);
  bgGrad.addColorStop(1, rarityTheme.bg2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#FFFFFF88';
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Title
  ctx.fillStyle = rarityTheme.text;
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('博士人格', W / 2, 120);

  // Load Image
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important for external images
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      // using nanobanana placeholder or other seed
      img.src = imageUrl; 
    });

    const imgW = 600;
    const imgH = 600;
    const imgX = (W - imgW) / 2;
    const imgY = 220;

    ctx.save();
    drawRoundRect(ctx, imgX, imgY, imgW, imgH, 30);
    ctx.clip();
    const sW = img.width;
    const sH = img.height;
    const scale = Math.max(imgW / sW, imgH / sH);
    const dW = sW * scale;
    const dH = sH * scale;
    const dX = imgX + (imgW - dW) / 2;
    const dY = imgY + (imgH - dH) / 2;
    ctx.drawImage(img, dX, dY, dW, dH);
    ctx.restore();
    
    // image frame
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fff';
    drawRoundRect(ctx, imgX, imgY, imgW, imgH, 30);
    ctx.stroke();

  } catch (e) {
    console.error('Failed to load image', e);
  }

  // MBTI Badge
  const badgeY = 880;
  const badgeHeight = 80;
  const badgePaddingX = 36;
  const badgeMinWidth = 320;
  const badgeMaxWidth = 520;
  let badgeFontSize = 36;

  // Fit longer BSTI labels like HAIRLINE-WATCHER inside the pill instead of clipping.
  while (badgeFontSize > 24) {
    ctx.font = `bold ${badgeFontSize}px "Noto Serif SC", serif`;
    if (ctx.measureText(result.bsti).width <= badgeMaxWidth - badgePaddingX * 2) break;
    badgeFontSize -= 2;
  }

  const badgeTextWidth = ctx.measureText(result.bsti).width;
  const badgeWidth = Math.min(
    badgeMaxWidth,
    Math.max(badgeMinWidth, Math.ceil(badgeTextWidth + badgePaddingX * 2))
  );

  ctx.fillStyle = rarityTheme.badge;
  drawRoundRect(ctx, W / 2 - badgeWidth / 2, badgeY - badgeHeight / 2, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(result.bsti, W / 2, badgeY);

  // Title
  ctx.fillStyle = rarityTheme.text;
  ctx.font = 'bold 56px "Noto Serif SC", serif';
  ctx.fillText(result.title, W / 2, 1000);

  // Quote
  ctx.font = 'italic 36px "Noto Serif SC", serif';
  ctx.fillStyle = rarityTheme.text + 'CC'; // slight transparency
  const quoteLines = wrapLines(ctx, result.quote, W - 140);
  let qY = 1100;
  for (const line of quoteLines) {
    ctx.fillText(line, W / 2, qY);
    qY += 50;
  }

  // Desc
  ctx.font = '30px "Noto Serif SC", serif';
  ctx.fillStyle = rarityTheme.text;
  const descLines = wrapLines(ctx, result.desc, W - 140);
  let dY = 1220;
  for (const line of descLines) {
    ctx.fillText(line, W / 2, dY);
    dY += 45;
  }

  // Watermark
  ctx.font = '24px "Noto Serif SC", serif';
  ctx.fillStyle = rarityTheme.text + '66';
  ctx.fillText('—— 中关村学院博士人格测试 ——', W / 2, H - 50);

  return canvas.toDataURL('image/jpeg', 0.9);
}
