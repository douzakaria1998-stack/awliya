import { AcademicLevel } from '@/types';

export function downloadCertificateHTML(
  level: AcademicLevel,
  studentName: string
) {
  const completionDate = level.completedDate || new Date().toISOString().split('T')[0];

  const certificateHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>شهادة إتمام - ${level.nameAr} - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@400;600;700;800;900&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }

    body {
      background-color: #0f172a;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
    }

    /* Standard A4 Landscape Container (297mm x 210mm ~ 1.414 ratio) */
    .cert-container {
      background: #ffffff;
      width: 1000px;
      max-width: 100%;
      height: 700px;
      padding: 36px 52px;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      border: 10px solid #065f46;
      outline: 4px solid #d97706;
      outline-offset: -14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    .corner-ornament {
      position: absolute;
      width: 38px;
      height: 38px;
      border: 3.5px solid #d97706;
      pointer-events: none;
    }
    .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
    .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
    .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
    .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }

    .basmala {
      text-align: center;
      font-family: 'Amiri', serif;
      font-size: 24px;
      font-weight: 700;
      color: #065f46;
      margin-bottom: 6px;
      letter-spacing: 1px;
    }

    .header {
      text-align: center;
    }

    .academy-name {
      font-size: 13px;
      font-weight: 800;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }

    .cert-title {
      font-family: 'Amiri', serif;
      font-size: 34px;
      font-weight: 700;
      color: #047857;
      line-height: 1.1;
      margin-bottom: 2px;
    }

    .cert-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .content {
      text-align: center;
      margin: 10px 0;
    }

    .intro-text {
      font-size: 15px;
      color: #475569;
      font-weight: 700;
    }

    .student-name {
      font-family: 'Amiri', serif;
      font-size: 40px;
      font-weight: 700;
      color: #0f172a;
      display: inline-block;
      border-bottom: 2.5px solid #d97706;
      padding: 0 40px;
      margin: 6px 0 10px 0;
      line-height: 1.2;
    }

    .achievement-text {
      font-size: 15px;
      color: #334155;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      gap: 8px;
      margin: 4px auto 0;
    }

    .level-badge {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      border: 1.5px solid #059669;
      padding: 3px 16px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 14px;
      white-space: nowrap;
    }

    .date-badge {
      font-family: monospace;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
    }

    .grade-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      border: 1.5px solid #f59e0b;
      padding: 4px 18px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 13px;
      margin-top: 10px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr 120px 1fr;
      align-items: center;
      text-align: center;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
      margin-bottom: 8px;
    }

    .signature-box {
      font-size: 12px;
      color: #475569;
      font-weight: 700;
    }

    .signature-line {
      width: 140px;
      height: 1px;
      background: #94a3b8;
      margin: 22px auto 4px;
    }

    .seal-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .gold-seal {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: radial-gradient(circle, #fef08a, #d97706);
      border: 3.5px double #ffffff;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #78350f;
      font-weight: 900;
      font-size: 10.5px;
      line-height: 1.2;
      transform: rotate(-5deg);
    }

    .cert-id {
      position: absolute;
      bottom: 10px;
      left: 24px;
      font-family: monospace;
      font-size: 10.5px;
      color: #94a3b8;
      font-weight: 600;
    }

    .print-btn {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: #065f46;
      color: white;
      border: 2px solid #34d399;
      padding: 14px 28px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;
      z-index: 99;
    }

    .print-btn:hover {
      background: #047857;
      transform: scale(1.03);
    }

    @media print {
      body {
        background: transparent;
        padding: 0;
        margin: 0;
        display: block;
      }
      .cert-container {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
        box-shadow: none;
        page-break-inside: avoid;
        page-break-after: avoid;
        padding: 24mm 28mm;
      }
      .print-btn {
        display: none;
      }
    }
  </style>
</head>
<body>

  <div class="cert-container">
    <div class="corner-ornament top-left"></div>
    <div class="corner-ornament top-right"></div>
    <div class="corner-ornament bottom-left"></div>
    <div class="corner-ornament bottom-right"></div>

    <div class="header">
      <div class="academy-name">أكاديمية اللغات الحية • منصة أَوْلِيَاء للغات (English & French Academy)</div>
      <h1 class="cert-title">شَهَادَةُ إِتْمَامِ مُسْتَوًى دَوْلِيّ</h1>
      <div class="cert-subtitle">Certificate of Language Level Completion</div>
    </div>

    <div class="content">
      <p class="intro-text">تَشْهَدُ إِدَارَةُ الأَكَادِيمِيَّةِ بِأَنَّ الطَّالِبَ(ـة):</p>
      <div class="student-name">${studentName || 'يوسف الدوزكري'}</div>
      <div class="achievement-text">
        <span>قَدْ أَتَمَّ(تْ) بِنَجَاحٍ وَتَفَوُّقٍ مُتَطَلَّبَاتِ</span>
        <span class="level-badge">${level.nameAr}</span>
        <span>بِتَارِيخ:</span>
        <span class="date-badge">${completionDate}</span>
      </div>
      <div>
        <span class="grade-badge">★ التقدير: ممتاز مع مرتبة الشرف (98%) ★</span>
      </div>
    </div>

    <div class="footer-grid">
      <div class="signature-box">
        <div>أستاذ وموجه المادة</div>
        <div class="signature-line"></div>
        <div style="color: #0f172a;">Language Instructor</div>
      </div>

      <div class="seal-container">
        <div class="seal">
          <div class="seal-inner">
            <span class="seal-star">★</span>
            <span>مُعْتَمَد</span>
            <span style="font-size: 8px; font-weight: bold; letter-spacing: 0.5px;">ACCREDITED</span>
            <span class="seal-star">★</span>
          </div>
        </div>
      </div>

      <div class="signature-box">
        <div>مدير الشؤون الأكاديمية</div>
        <div class="signature-line"></div>
        <div style="color: #0f172a;">Academic Director</div>
      </div>
    </div>

    <div class="cert-id">رقم الاعتماد: CERT-LVL${level.level}-${Math.floor(10000 + Math.random() * 90000)}</div>
  </div>

  <button type="button" class="print-btn" onclick="window.print()">
    🖨️ طباعة الشهادة (A4 أفقي) / حفظ PDF
  </button>

</body>
</html>`;

  const blob = new Blob([certificateHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate-${level.level}-${studentName || 'student'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
