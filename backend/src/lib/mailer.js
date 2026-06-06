const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // your gmail
    pass: process.env.GMAIL_APP_PASSWORD, // gmail app password (not your real password)
  },
});

exports.sendOtpEmail = async (toEmail, otp) => {
  // throws 550 synchronously if email doesn't exist
  await transporter.sendMail({
    from: `"VendorBridge" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for VendorBridge",
    html: `
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>Valid for 10 minutes. Do not share this.</p>
    `,
  });
};

exports.sendInvoiceEmail = async (po) => {
  const itemRows = po.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${Number(item.unit_price).toLocaleString("en-IN")}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${(item.quantity * Number(item.unit_price)).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"VendorBridge" <${process.env.GMAIL_USER}>`,
    to: po.vendor_email,
    subject: `Purchase Order ${po.po_number} — ${po.rfq_title}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0E8A5F;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Purchase Order</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0">${po.po_number}</p>
        </div>

        <div style="border:1px solid #eee;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p>Dear <strong>${po.contact_person || po.vendor_name}</strong>,</p>
          <p>Please find below the purchase order details for <strong>${po.rfq_title}</strong>.</p>

          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <thead>
              <tr style="background:#f5f5f5">
                <th style="padding:10px 12px;text-align:left;font-size:13px;color:#666">Item</th>
                <th style="padding:10px 12px;text-align:center;font-size:13px;color:#666">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#666">Unit Price</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#666">Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:12px;text-align:right;font-weight:600">Grand Total</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:18px;color:#0E8A5F">
                  ₹${Number(po.total_amount).toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#f9f9f9;border-radius:8px;padding:16px;font-size:14px;color:#666">
            <p style="margin:0"><strong>Buyer:</strong> ${po.buyer_name} (${po.buyer_email})</p>
            <p style="margin:6px 0 0"><strong>PO Date:</strong> ${new Date(po.created_at).toLocaleDateString("en-IN")}</p>
          </div>

          <p style="margin-top:24px;font-size:14px;color:#999">
            This is an auto-generated email from VendorBridge. Please do not reply.
          </p>
        </div>
      </div>
    `,
  });
};