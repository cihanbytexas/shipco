import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { avatar1, avatar2, level, background } = req.body;

  if (!avatar1 || !avatar2) {
    return res.status(400).json({ error: 'avatar1 and avatar2 are required' });
  }

  try {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Arka plan
    if (background) {
      const bg = await loadImage(background);
      ctx.drawImage(bg, 0, 0, 800, 400);
    } else {
      ctx.fillStyle = '#2c2f33';
      ctx.fillRect(0, 0, 800, 400);
    }

    // Avatar 1
    const img1 = await loadImage(avatar1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(250, 200, 100, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img1, 150, 100, 200, 200);
    ctx.restore();

    // Avatar 2
    const img2 = await loadImage(avatar2);
    ctx.save();
    ctx.beginPath();
    ctx.arc(550, 200, 100, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img2, 450, 100, 200, 200);
    ctx.restore();

    // Level
    if (level) {
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText(`Level: ${level}`, 325, 350);
    }

    // PNG → Base64 JSON
    const buffer = canvas.toBuffer('image/png');
    const base64Image = buffer.toString('base64');

    res.status(200).json({
      success: true,
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
