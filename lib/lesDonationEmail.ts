import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

// ─── SMTP Transporter ──────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    host: process.env.LES_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.LES_SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.LES_SMTP_USER || process.env.SMTP_USER,
        pass: process.env.LES_SMTP_PASS || process.env.SMTP_PASS,
    },
});

// ─── PDF Invoice Generator ─────────────────────────────────────────────────
export function generateDonationPDF(data: {
    txnid: string;
    easepayid?: string;
    amount: string | number;
    name: string;
    email: string;
    phone?: string;
    fund: string;
    donationType?: string;
    date: Date;
}): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const GREEN = '#0d4a33';
            const LIGHT_GREEN = '#e8f5ec';
            const GRAY = '#555555';
            const LIGHT_GRAY = '#f5f5f5';
            const dateStr = data.date.toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            const fundLabels: Record<string, string> = {
                general: 'General Fund',
                education: 'Education Fund',
                counselling: 'Counselling Services',
                community: 'Community Development',
            };

            // ── Header Banner ──────────────────────────────────────────────
            doc.rect(0, 0, doc.page.width, 110).fill(GREEN);

            doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold')
                .text('LOYOLA EXTENSION SERVICES', 50, 30, { align: 'center', width: doc.page.width - 100 });

            doc.fontSize(11).font('Helvetica')
                .text('Loyola College of Social Sciences, Thiruvananthapuram, Kerala', 50, 58, { align: 'center', width: doc.page.width - 100 });

            doc.fontSize(10)
                .text('www.loyolacollegekerala.edu.in/les', 50, 78, { align: 'center', width: doc.page.width - 100 });

            // ── Donation Receipt Title ─────────────────────────────────────
            doc.moveDown(3);
            doc.rect(50, 120, doc.page.width - 100, 38).fill(LIGHT_GREEN);
            doc.fillColor(GREEN).fontSize(16).font('Helvetica-Bold')
                .text('DONATION RECEIPT', 50, 130, { align: 'center', width: doc.page.width - 100 });

            // ── Receipt Details ────────────────────────────────────────────
            const tableTop = 180;
            const col1 = 50;
            const col2 = 250;
            const rowH = 30;

            const rows = [
                ['Receipt Date', dateStr],
                ['Transaction ID', data.txnid],
                ...(data.easepayid ? [['Payment Ref (Easebuzz)', data.easepayid]] : []),
                ['Donor Name', data.name],
                ['Email', data.email],
                ...(data.phone ? [['Phone', data.phone]] : []),
                ['Donation Fund', fundLabels[data.fund] || data.fund],
                ['Donation Type', data.donationType === 'recurring' ? 'Monthly Recurring' : 'One-Time'],
                ['Amount Paid', `INR ${parseFloat(String(data.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                ['Payment Status', 'SUCCESSFUL'],
            ];

            rows.forEach((row, i) => {
                const y = tableTop + i * rowH;
                const fill = i % 2 === 0 ? '#ffffff' : LIGHT_GRAY;
                doc.rect(col1, y, doc.page.width - 100, rowH).fill(fill);
                doc.fillColor(GRAY).fontSize(10).font('Helvetica-Bold')
                    .text(row[0], col1 + 8, y + 9, { width: col2 - col1 - 10 });
                const isAmount = row[0] === 'Amount Paid';
                const isStatus = row[0] === 'Payment Status';
                doc.fillColor(isAmount ? GREEN : isStatus ? '#1a8c55' : '#222222')
                    .font(isAmount || isStatus ? 'Helvetica-Bold' : 'Helvetica')
                    .fontSize(isAmount ? 12 : 10)
                    .text(row[1], col2, y + 9, { width: doc.page.width - col2 - 60 });
            });

            // ── 80G Notice ─────────────────────────────────────────────────
            const noticeTop = tableTop + rows.length * rowH + 20;
            doc.rect(col1, noticeTop, doc.page.width - 100, 70).fill(LIGHT_GREEN);
            doc.fillColor(GREEN).fontSize(11).font('Helvetica-Bold')
                .text('80G Tax Exemption Notice', col1 + 12, noticeTop + 12);
            doc.fillColor(GRAY).fontSize(9).font('Helvetica')
                .text(
                    'This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961. ' +
                    'An official 80G compliant receipt will be sent to your registered email within 5–7 working days.',
                    col1 + 12, noticeTop + 30,
                    { width: doc.page.width - 120 }
                );

            // ── Thank You ──────────────────────────────────────────────────
            const thanksTop = noticeTop + 90;
            doc.fillColor(GREEN).fontSize(15).font('Helvetica-Bold')
                .text('Thank you for your generous contribution!', col1, thanksTop, { align: 'center', width: doc.page.width - 100 });
            doc.fillColor(GRAY).fontSize(9).font('Helvetica')
                .text('Your support helps us empower marginalized communities through education, counselling, and social upliftment.', col1, thanksTop + 22, { align: 'center', width: doc.page.width - 100 });

            // ── Footer ─────────────────────────────────────────────────────
            const footerY = doc.page.height - 60;
            doc.rect(0, footerY, doc.page.width, 60).fill(GREEN);
            doc.fillColor('#ffffff').fontSize(9).font('Helvetica')
                .text(
                    'Loyola Extension Services  •  Loyola College of Social Sciences  •  Sreekaryam P.O., Thiruvananthapuram – 695 017',
                    50, footerY + 15, { align: 'center', width: doc.page.width - 100 }
                )
                .text(`This is a computer-generated receipt. Generated on ${dateStr}.`, 50, footerY + 35, { align: 'center', width: doc.page.width - 100 });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

// ─── Send Acknowledgment Email ─────────────────────────────────────────────
export async function sendDonationAcknowledgment(data: {
    txnid: string;
    easepayid?: string;
    amount: string | number;
    name: string;
    email: string;
    phone?: string;
    fund: string;
    donationType?: string;
}) {
    const date = new Date();
    const fundLabels: Record<string, string> = {
        general: 'General Fund',
        education: 'Education Fund',
        counselling: 'Counselling Services',
        community: 'Community Development',
    };
    const fundLabel = fundLabels[data.fund] || data.fund;
    const amountStr = parseFloat(String(data.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    // Generate PDF
    const pdfBuffer = await generateDonationPDF({ ...data, date });

    const mailOptions = {
        from: `"Loyola Extension Services" <${process.env.LES_SMTP_USER || process.env.SMTP_USER}>`,
        to: data.email,
        subject: `Donation Receipt – LES | Transaction ${data.txnid}`,
        html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#0d4a33 0%,#1a6b4a 100%);padding:32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Loyola Extension Services</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Loyola College of Social Sciences, Thiruvananthapuram</p>
          </div>

          <!-- Green check banner -->
          <div style="background:#e8f5ec;padding:24px 32px;text-align:center;border-bottom:1px solid #c3e6cb;">
            <div style="width:60px;height:60px;background:#28a745;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
              <span style="color:#fff;font-size:28px;">✓</span>
            </div>
            <h2 style="color:#0d4a33;margin:0;font-size:20px;">Thank You for Your Donation!</h2>
            <p style="color:#555;margin:8px 0 0;font-size:14px;">Your contribution of <strong style="color:#0d4a33;">₹${amountStr}</strong> has been received successfully.</p>
          </div>

          <!-- Transaction Details -->
          <div style="padding:28px 32px;">
            <h3 style="color:#0d4a33;font-size:15px;margin:0 0 16px;border-bottom:2px solid #e8f5ec;padding-bottom:8px;">Transaction Details</h3>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr style="background:#f8f8f8;"><td style="padding:10px 12px;color:#666;font-weight:600;">Donor Name</td><td style="padding:10px 12px;color:#222;">${data.name}</td></tr>
              <tr><td style="padding:10px 12px;color:#666;font-weight:600;">Transaction ID</td><td style="padding:10px 12px;color:#222;font-family:monospace;">${data.txnid}</td></tr>
              ${data.easepayid ? `<tr style="background:#f8f8f8;"><td style="padding:10px 12px;color:#666;font-weight:600;">Payment Ref</td><td style="padding:10px 12px;color:#222;font-family:monospace;">${data.easepayid}</td></tr>` : ''}
              <tr ${data.easepayid ? '' : 'style="background:#f8f8f8;"'}><td style="padding:10px 12px;color:#666;font-weight:600;">Amount</td><td style="padding:10px 12px;color:#0d4a33;font-weight:700;font-size:15px;">₹${amountStr}</td></tr>
              <tr style="background:#f8f8f8;"><td style="padding:10px 12px;color:#666;font-weight:600;">Fund</td><td style="padding:10px 12px;color:#222;">${fundLabel}</td></tr>
              <tr><td style="padding:10px 12px;color:#666;font-weight:600;">Date</td><td style="padding:10px 12px;color:#222;">${date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
            </table>
          </div>

          <!-- 80G Notice -->
          <div style="background:#e8f5ec;margin:0 32px 28px;border-radius:8px;padding:16px;border-left:4px solid #0d4a33;">
            <p style="color:#0d4a33;font-weight:700;margin:0 0 6px;font-size:13px;">📋 80G Tax Exemption</p>
            <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">Your donation is eligible for tax deduction under Section 80G of the Income Tax Act. An official 80G receipt will be sent to you within <strong>5–7 working days</strong>.</p>
          </div>

          <!-- PDF note -->
          <div style="margin:0 32px 28px;padding:14px;background:#fff8e1;border-radius:8px;border:1px solid #ffe082;">
            <p style="color:#7c6f00;font-size:12px;margin:0;">📎 A <strong>PDF donation receipt</strong> is attached to this email for your records.</p>
          </div>

          <!-- Footer -->
          <div style="background:#f8f9fa;padding:20px 32px;border-top:1px solid #eee;text-align:center;">
            <p style="color:#999;font-size:11px;margin:0;">© ${date.getFullYear()} Loyola Extension Services &bull; Loyola College of Social Sciences<br/>Sreekaryam P.O., Thiruvananthapuram – 695 017, Kerala, India</p>
          </div>
        </div>
        `,
        attachments: [
            {
                filename: `LES_Donation_Receipt_${data.txnid}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    return transporter.sendMail(mailOptions);
}
