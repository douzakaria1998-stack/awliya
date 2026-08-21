import { AcademicLevel, Student } from '@/types';

const CEFR_LEVELS: Record<number, string> = {
  1: 'A1.1',
  2: 'A1.2',
  3: 'A2.1',
  4: 'A2.2',
  5: 'B1.1',
  6: 'B1.2',
  7: 'B2.1',
  8: 'B2.2',
  9: 'C1',
  10: 'C2',
};

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '25 May 2024';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function formatBirthDate(dateStr?: string): string {
  if (!dateStr) return '04-09-2014';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function getLatinName(student?: Student | null, fallback: string = 'Larbi Guemmoudi'): string {
  if (!student) return fallback;
  if (student.firstNameAr === 'يوسف' || student.fullNameAr?.includes('يوسف')) return 'Youssef Douzakaria';
  if (student.firstNameAr === 'مريم' || student.fullNameAr?.includes('مريم')) return 'Maryam Douzakaria';
  if (student.firstNameAr === 'عمر' || student.fullNameAr?.includes('عمر')) return 'Omar Douzakaria';
  return student.fullNameAr || fallback;
}

export function downloadCertificateHTML(
  level: AcademicLevel,
  studentName: string,
  student?: Student | null
) {
  const recipientName = student ? getLatinName(student, studentName) : (studentName || 'Larbi Guemmoudi');
  const birthDateFormatted = formatBirthDate(student?.birthday || '2014-05-12');
  const completionDateFormatted = formatDisplayDate(level.completedDate || '2024-05-25');
  
  const cefrCode = CEFR_LEVELS[level.level] || 'C1';
  const isFrench = student?.enrolledPathAr?.includes('فرنسية') || student?.enrolledPathAr?.includes('French');
  const subjectName = isFrench ? 'French' : 'English';

  const certificateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Achievement - ${recipientName} - ${subjectName} ${cefrCode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');

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
      background-color: #1e1b2e;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      font-family: 'Outfit', 'Montserrat', -apple-system, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Outer Container matching the exact colorful frame */
    .certificate-frame {
      width: 1060px;
      height: 750px;
      max-width: 100%;
      position: relative;
      background: #f8fafc;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 22px;
    }

    /* Background Geometric Corner Decorations */
    .frame-bg-tl {
      position: absolute;
      top: 0;
      left: 0;
      width: 530px;
      height: 180px;
      z-index: 1;
      overflow: hidden;
    }

    .frame-bg-tr {
      position: absolute;
      top: 0;
      right: 0;
      width: 320px;
      height: 220px;
      z-index: 1;
      overflow: hidden;
    }

    .frame-bg-bl {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 280px;
      height: 280px;
      z-index: 1;
      overflow: hidden;
    }

    .frame-bg-br {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 530px;
      height: 200px;
      z-index: 1;
      overflow: hidden;
    }

    .frame-bg-right-mosaic {
      position: absolute;
      right: 0;
      top: 220px;
      bottom: 200px;
      width: 70px;
      z-index: 1;
    }

    /* Main White Card */
    .cert-card {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 36px 54px 30px 54px;
      text-align: center;
    }

    /* Top Logo & Triangles */
    .logo-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 8px;
    }

    .accent-triangle-left {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 10px solid #ea580c;
    }

    .accent-triangle-right {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 10px solid #ea580c;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }

    .badge-my {
      background: #ea580c;
      color: #ffffff;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 20px;
      padding: 4px 14px;
      border-radius: 9999px;
      box-shadow: 0 3px 8px rgba(234, 88, 12, 0.35);
      letter-spacing: -0.5px;
    }

    .text-school {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 24px;
      color: #3b1442;
      letter-spacing: -0.5px;
      margin-left: 2px;
    }

    /* Titles */
    .title-block {
      margin-bottom: 12px;
    }

    .main-title {
      font-family: 'Montserrat', 'Outfit', sans-serif;
      font-size: 42px;
      font-weight: 900;
      color: #3b1442;
      letter-spacing: 2px;
      line-height: 1;
      margin-bottom: 6px;
    }

    .sub-title {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: 3.5px;
      text-transform: uppercase;
    }

    /* Preamble */
    .certifies-text {
      font-size: 15px;
      font-weight: 500;
      color: #475569;
      margin-top: 14px;
      margin-bottom: 4px;
    }

    /* Student Name */
    .student-name-container {
      margin: 4px 0 10px 0;
    }

    .student-name {
      font-family: 'Outfit', 'Montserrat', sans-serif;
      font-size: 46px;
      font-weight: 900;
      color: #ea580c;
      letter-spacing: -0.5px;
      line-height: 1.1;
      display: inline-block;
    }

    .teal-bar {
      width: 90px;
      height: 4px;
      background: #0d9488;
      border-radius: 2px;
      margin: 8px auto 0;
    }

    /* Metadata & Paragraphs */
    .born-text {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 6px;
      margin-bottom: 12px;
    }

    .body-paragraph-1 {
      font-size: 14.5px;
      line-height: 1.6;
      color: #334155;
      max-width: 780px;
      margin: 0 auto 10px;
      font-weight: 500;
    }

    .body-paragraph-1 strong {
      color: #0f172a;
      font-weight: 700;
    }

    .body-paragraph-2 {
      font-size: 14px;
      line-height: 1.5;
      color: #334155;
      max-width: 680px;
      margin: 0 auto;
      font-weight: 500;
    }

    /* Footer Section */
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
      padding-top: 12px;
    }

    .footer-left {
      text-align: left;
      font-size: 12px;
      color: #334155;
      line-height: 1.6;
    }

    .footer-left-school {
      font-weight: 800;
      font-size: 13.5px;
      color: #0f172a;
      margin-bottom: 1px;
    }

    .footer-left-address {
      color: #475569;
      font-weight: 500;
    }

    .footer-left-tel {
      color: #334155;
      font-weight: 600;
      font-size: 12px;
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 170px;
    }

    .signature-svg {
      width: 96px;
      height: 52px;
      margin-bottom: -4px;
    }

    .signature-divider {
      width: 140px;
      height: 1px;
      background: #cbd5e1;
      margin-bottom: 6px;
    }

    .signature-label {
      font-size: 11px;
      font-weight: 800;
      color: #475569;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* Print Floating Button */
    .print-btn {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: #ea580c;
      color: white;
      border: 2px solid #fdba74;
      padding: 14px 28px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(234, 88, 12, 0.4);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;
      z-index: 999;
      font-family: inherit;
    }

    .print-btn:hover {
      background: #c2410c;
      transform: scale(1.03);
    }

    @media print {
      body {
        background: transparent;
        padding: 0;
        margin: 0;
        display: block;
      }
      .certificate-frame {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        box-shadow: none;
        padding: 12mm;
        page-break-inside: avoid;
        page-break-after: avoid;
      }
      .print-btn {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="certificate-frame">
    <!-- Top-Left Teal Guilloche Pattern Arc -->
    <div class="frame-bg-tl">
      <svg width="530" height="180" viewBox="0 0 530 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="530" height="180" fill="#0284c7" fill-opacity="0.12"/>
        <path d="M0 0 H530 V40 Q380 40 260 0 Z" fill="#0d9488" fill-opacity="0.85"/>
        <path d="M0 0 Q140 180 320 0 Z" fill="#0284c7" fill-opacity="0.3"/>
        <g stroke="#0d9488" stroke-width="1.2" stroke-opacity="0.45" fill="none">
          <path d="M-50 0 C40 120 180 160 380 0"/>
          <path d="M-50 15 C45 130 185 170 385 15"/>
          <path d="M-50 30 C50 140 190 180 390 30"/>
          <path d="M-50 45 C55 150 195 190 395 45"/>
          <path d="M-50 60 C60 160 200 200 400 60"/>
          <path d="M-50 75 C65 170 205 210 405 75"/>
          <path d="M-50 90 C70 180 210 220 410 90"/>
          <path d="M-50 105 C75 190 215 230 415 105"/>
        </g>
      </svg>
    </div>

    <!-- Top-Right Deep Purple Geometric Block -->
    <div class="frame-bg-tr">
      <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 0 H320 V160 Q220 120 160 60 L70 0 Z" fill="#3b1442"/>
        <polygon points="320,160 320,220 260,180" fill="#ea580c"/>
      </svg>
    </div>

    <!-- Right Side Geometric Mosaic -->
    <div class="frame-bg-right-mosaic">
      <svg width="70" height="330" viewBox="0 0 70 330" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="70,0 70,70 0,70" fill="#3b1442"/>
        <polygon points="0,70 70,70 0,110" fill="#ffffff"/>
        <polygon points="0,110 70,70 70,160" fill="#e11d48"/>
        <polygon points="0,160 70,160 70,230" fill="#0d9488"/>
        <polygon points="0,230 70,230 70,300" fill="#ea580c"/>
        <polygon points="0,300 70,300 0,330" fill="#f59e0b"/>
      </svg>
    </div>

    <!-- Bottom-Left Coral/Pink Concentric Wave -->
    <div class="frame-bg-bl">
      <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120 Q120 120 120 280 H0 Z" fill="#e11d48" fill-opacity="0.85"/>
        <g stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4" fill="none">
          <circle cx="0" cy="280" r="40"/>
          <circle cx="0" cy="280" r="60"/>
          <circle cx="0" cy="280" r="80"/>
          <circle cx="0" cy="280" r="100"/>
          <circle cx="0" cy="280" r="120"/>
          <circle cx="0" cy="280" r="140"/>
          <circle cx="0" cy="280" r="160"/>
        </g>
      </svg>
    </div>

    <!-- Bottom-Right Orange Guilloche Waves -->
    <div class="frame-bg-br">
      <svg width="530" height="200" viewBox="0 0 530 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 200 H530 V0 Q360 80 180 200 Z" fill="#ea580c" fill-opacity="0.8"/>
        <g stroke="#ffffff" stroke-width="1.1" stroke-opacity="0.35" fill="none">
          <path d="M120 200 Q260 80 530 0"/>
          <path d="M140 200 Q280 90 530 15"/>
          <path d="M160 200 Q300 100 530 30"/>
          <path d="M180 200 Q320 110 530 45"/>
          <path d="M200 200 Q340 120 530 60"/>
          <path d="M220 200 Q360 130 530 75"/>
          <path d="M240 200 Q380 140 530 90"/>
          <path d="M260 200 Q400 150 530 105"/>
        </g>
      </svg>
    </div>

    <!-- The White Certificate Inner Card -->
    <div class="cert-card">
      <!-- 1. Header: Logo & Accent Triangles -->
      <div>
        <div class="logo-row">
          <div class="accent-triangle-left"></div>
          <div class="brand-logo">
            <span class="badge-my">My</span>
            <span class="text-school">School</span>
          </div>
          <div class="accent-triangle-right"></div>
        </div>

        <!-- 2. Main Heading -->
        <div class="title-block">
          <h1 class="main-title">CERTIFICATE</h1>
          <div class="sub-title">OF ACHIEVEMENT</div>
        </div>

        <!-- 3. Preamble -->
        <div class="certifies-text">Hereby certifies that</div>

        <!-- 4. Recipient Name -->
        <div class="student-name-container">
          <div class="student-name">${recipientName}</div>
          <div class="teal-bar"></div>
        </div>

        <!-- 5. Birth Date -->
        <div class="born-text">Born on ${birthDateFormatted}</div>

        <!-- 6. Completion Paragraphs -->
        <p class="body-paragraph-1">
          Has successfully completed a course in <strong>${subjectName} ${cefrCode} level</strong> following <strong>the CEFR model</strong> and the standards required by <strong>My School</strong> to merit this certificate.
        </p>

        <p class="body-paragraph-2">
          My School has therefore decreed its signature and conferred upon the holder this certificate on <strong>${completionDateFormatted}</strong> in <strong>El Oued, Algeria.</strong>
        </p>
      </div>

      <!-- 7. Footer: School Info & Authentic Signature -->
      <div class="footer-row">
        <div class="footer-left">
          <div class="footer-left-school">My School</div>
          <div class="footer-left-address">Errimal Street, El Oued, Algeria.</div>
          <div class="footer-left-tel">Tel: +213 770 299 292 \\ +213 770 958 887</div>
        </div>

        <div class="footer-right">
          <!-- Realistic Authentic Ink Signature Vector -->
          <svg class="signature-svg" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 35 70 C 30 45, 45 15, 60 15 C 75 15, 80 55, 65 75 C 55 88, 40 75, 42 50 C 44 25, 65 20, 85 45 C 95 60, 110 75, 125 50 C 135 30, 120 18, 105 25 C 90 32, 85 60, 115 70 C 130 75, 145 60, 150 45" 
                  stroke="#0f172a" 
                  stroke-width="2.2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  fill="none"/>
            <path d="M 52 18 L 50 82" 
                  stroke="#0f172a" 
                  stroke-width="2.2" 
                  stroke-linecap="round"/>
            <path d="M 78 20 L 75 80" 
                  stroke="#0f172a" 
                  stroke-width="2" 
                  stroke-linecap="round"/>
          </svg>
          <div class="signature-divider"></div>
          <div class="signature-label">SIGNATURE</div>
        </div>
      </div>
    </div>
  </div>

  <button type="button" class="print-btn" onclick="window.print()">
    🖨️ Print Certificate (A4 Landscape) / Save PDF
  </button>

</body>
</html>`;

  const blob = new Blob([certificateHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Certificate-${recipientName.replace(/\\s+/g, '_')}-${subjectName}-${cefrCode}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
