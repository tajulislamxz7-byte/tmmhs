// Enhanced ID Card Generator with professional design
export async function generateStudentIDCard(student) {
  const canvas = document.createElement('canvas');
  canvas.width = 1050;  // Optimized dimensions for better proportions
  canvas.height = 650;
  const ctx = canvas.getContext('2d');

  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Background with professional gradient
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#2563eb');
  bgGradient.addColorStop(0.7, '#3b82f6');
  bgGradient.addColorStop(1, '#1d4ed8');

  // Main card background with shadow effect
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, 15, 15, canvas.width - 30, canvas.height - 30, 24);
  ctx.fill();
  ctx.shadowBlur = 0; // Reset shadow

  // Header section with school branding
  const headerGradient = ctx.createLinearGradient(0, 15, 0, 120);
  headerGradient.addColorStop(0, '#2563eb');
  headerGradient.addColorStop(1, '#1e40af');
  ctx.fillStyle = headerGradient;
  roundRect(ctx, 15, 15, canvas.width - 30, 105, 24);
  ctx.fill();

  // Reset corner radius for bottom of header
  ctx.fillStyle = headerGradient;
  ctx.fillRect(15, 96, canvas.width - 30, 24);

  // School name with better typography
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';
  ctx.fillText('TIARKHALI M.M HIGH SCHOOL', canvas.width / 2, 50);

  // Subtitle
  ctx.font = '16px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('STUDENT IDENTITY CARD', canvas.width / 2, 75);

  // Academic year
  ctx.font = '14px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Academic Year 2024-25', canvas.width / 2, 95);

  // Student photo section
  const photoSection = {
    x: 60,
    y: 150,
    width: 400,
    height: 320
  };

  // Photo background
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, photoSection.x, photoSection.y, photoSection.width, photoSection.height, 16);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Load and draw avatar with better positioning
  try {
    const avatar = await loadImage(student.avatar);
    const avatarSize = 140;
    const avatarX = photoSection.x + (photoSection.width / 2) - (avatarSize / 2);
    const avatarY = photoSection.y + 25;

    // Avatar background circle
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw avatar in perfect circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
  } catch (err) {
    // Professional placeholder
    const avatarSize = 140;
    const avatarX = photoSection.x + (photoSection.width / 2) - (avatarSize / 2);
    const avatarY = photoSection.y + 25;

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // User icon placeholder
    ctx.fillStyle = '#94a3b8';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 16);
  }

  // Student name with proper spacing
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(student.name, photoSection.x + photoSection.width / 2, photoSection.y + 210);

  // Student ID with styling
  ctx.fillStyle = '#64748b';
  ctx.font = '18px "Segoe UI", Arial, sans-serif';
  ctx.fillText(student.id, photoSection.x + photoSection.width / 2, photoSection.y + 240);

  // Class and section badges
  const badgeY = photoSection.y + 270;
  const badgeSpacing = 85;
  const startX = photoSection.x + (photoSection.width / 2) - badgeSpacing;

  // Class badge
  ctx.fillStyle = '#dbeafe';
  roundRect(ctx, startX - 35, badgeY, 70, 28, 14);
  ctx.fill();
  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(student.class || 'N/A', startX, badgeY + 18);

  // Section badge  
  ctx.fillStyle = '#dcfce7';
  roundRect(ctx, startX + 55, badgeY, 70, 28, 14);
  ctx.fill();
  ctx.fillStyle = '#16a34a';
  ctx.fillText(`Sec ${student.section || 'N/A'}`, startX + 90, badgeY + 18);

  // Information section
  const infoSection = {
    x: 500,
    y: 150,
    width: 380,
    height: 320
  };

  // Info background
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 12;
  roundRect(ctx, infoSection.x, infoSection.y, infoSection.width, infoSection.height, 16);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Information header
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, infoSection.x, infoSection.y, infoSection.width, 45, 16);
  ctx.fill();
  ctx.fillRect(infoSection.x, infoSection.y + 29, infoSection.width, 16);

  ctx.fillStyle = '#374151';
  ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STUDENT INFORMATION', infoSection.x + infoSection.width / 2, infoSection.y + 28);

  // Student details with better layout
  const details = [
    ['Roll Number', student.roll || '—'],
    ['Class & Section', `${student.class || 'N/A'} - ${student.section || 'N/A'}`],
    ['Batch Year', student.batch || '—'],
    ['Blood Group', student.bloodGroup || '—'],
    ['Guardian', student.guardian || '—']
  ];

  let yPos = infoSection.y + 70;
  const lineHeight = 42;

  details.forEach(([label, value]) => {
    // Label
    ctx.fillStyle = '#6b7280';
    ctx.font = '13px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, infoSection.x + 25, yPos);

    // Value
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
    ctx.fillText(value, infoSection.x + 25, yPos + 18);

    // No divider lines - keep it clean!
    yPos += lineHeight;
  });

  // QR Code section
  try {
    const qrCode = await loadImage(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=1&data=TMMHS%7C${student.id}%7C${encodeURIComponent(student.name)}%7C${student.class}%7C${student.section}`);
    const qrSize = 120;
    const qrX = infoSection.x + infoSection.width - qrSize - 25;
    const qrY = infoSection.y + 180;

    // QR background with border
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12);
    ctx.fill();
    ctx.stroke();

    // Draw QR code
    ctx.drawImage(qrCode, qrX, qrY, qrSize, qrSize);

    // QR label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scan for Details', qrX + qrSize / 2, qrY + qrSize + 18);

  } catch (err) {
    // QR placeholder
    const qrSize = 120;
    const qrX = infoSection.x + infoSection.width - qrSize - 25;
    const qrY = infoSection.y + 180;

    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⬜', qrX + qrSize / 2, qrY + qrSize / 2 + 16);
  }

  // Footer with validation
  const footerGradient = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height - 15);
  footerGradient.addColorStop(0, '#f8fafc');
  footerGradient.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = footerGradient;
  roundRect(ctx, 15, canvas.height - 60, canvas.width - 30, 45, 16);
  ctx.fill();
  // Removed the ugly horizontal line: ctx.fillRect(15, canvas.height - 60, canvas.width - 30, 16);

  // Footer text
  ctx.fillStyle = '#64748b';
  ctx.font = '12px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('This card is valid for the current academic year and must be carried at all times on school premises.', canvas.width / 2, canvas.height - 35);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Issued by Tiarkhali M.M High School & College | Tiarkhali, Bangladesh', canvas.width / 2, canvas.height - 20);

  return canvas;
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper function to load images
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
