import { Payment } from '@/types';

export function downloadReceiptHTML(
  payment: Payment,
  studentName: string,
  parentName: string
) {
  const receiptHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إيصال سداد - ${payment.receiptNumber || payment.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
    }

    .receipt-card {
      background: #ffffff;
      width: 100%;
      max-width: 650px;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      padding: 40px;
      position: relative;
      overflow: hidden;
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px dashed #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: white;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);
    }

    .brand-title {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
    }

    .receipt-tag {
      text-align: left;
    }

    .badge-paid {
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .receipt-num {
      font-family: monospace;
      font-size: 13px;
      color: #475569;
      font-weight: 700;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 18px;
      border: 1px solid #f1f5f9;
    }

    .info-item label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
    }

    .info-item span {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }

    .details-table th {
      background: #f1f5f9;
      color: #475569;
      font-size: 12px;
      font-weight: 800;
      padding: 12px 16px;
      text-align: right;
    }

    .details-table th:last-child {
      text-align: left;
    }

    .details-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
    }

    .details-table td:last-child {
      text-align: left;
      font-weight: 800;
      font-family: monospace;
      font-size: 14px;
    }

    .total-row {
      background: #fff1f2;
      border-radius: 16px;
      padding: 18px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }

    .total-label {
      font-size: 14px;
      font-weight: 800;
      color: #9f1239;
    }

    .total-amount {
      font-size: 22px;
      font-weight: 900;
      color: #be123c;
      font-family: monospace;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
      font-size: 11px;
      color: #94a3b8;
      font-weight: 600;
    }

    .stamp {
      border: 2px dashed #059669;
      color: #059669;
      padding: 6px 14px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      transform: rotate(-4deg);
      display: inline-block;
    }

    .print-btn {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: #0f172a;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .receipt-card {
        border: none;
        box-shadow: none;
        padding: 20px;
      }
      .print-btn {
        display: none;
      }
    }
  </style>
</head>
<body>

  <div class="receipt-card">
    <div class="header-bar">
      <div class="brand">
        <div class="brand-logo">و</div>
        <div>
          <div class="brand-title">منصة أَوْلِيَاء التعليمية</div>
          <div class="brand-sub">بوابة أولياء الأمور - الإدارة المالية</div>
        </div>
      </div>
      <div class="receipt-tag">
        <span class="badge-paid">✓ تم السداد بنجاح</span>
        <div class="receipt-num">${payment.receiptNumber || payment.id}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <label>اسم الطالب</label>
        <span>${studentName || 'مريم الدوزكري'}</span>
      </div>
      <div class="info-item">
        <label>ولي الأمر</label>
        <span>${parentName || 'أحمد الدوزكري'}</span>
      </div>
      <div class="info-item">
        <label>تاريخ وتوقيت الدفع</label>
        <span>${payment.date}</span>
      </div>
      <div class="info-item">
        <label>طريقة السداد</label>
        <span>${payment.methodAr}</span>
      </div>
    </div>

    <table class="details-table">
      <thead>
        <tr>
          <th>بيان الرسوم والخدمات</th>
          <th>رقم المرجع</th>
          <th>المبلغ</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${payment.descriptionAr || payment.feeTitleAr || 'رسوم واشتراك دراسي'}</td>
          <td style="font-family: monospace; font-size: 12px;">${payment.receiptNumber}</td>
          <td>${payment.amount} ${payment.currency}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-row">
      <span class="total-label">إجمالي المبلغ المسدد:</span>
      <span class="total-amount">${payment.amount} ${payment.currency}</span>
    </div>

    <div class="footer">
      <div>
        <span>تم إصدار هذا الإيصال إلكترونياً وهو معتمد لدى إدارة الشؤون المالية.</span>
        <div style="margin-top: 4px; font-family: monospace; font-size: 12px; color: #64748b;">
          تاريخ الإصدار: <span style="font-family: monospace; font-weight: 700;">${new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>
      <div class="stamp">معتمد - PAID</div>
    </div>
  </div>

  <button type="button" class="print-btn" onclick="window.print()">
    🖨️ طباعة الإيصال
  </button>

</body>
</html>`;

  const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${payment.receiptNumber || payment.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
