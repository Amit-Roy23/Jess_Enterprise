import { Resend } from "resend";
import nodemailer from "nodemailer";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey.startsWith("re_") && resendApiKey !== "re_placeholder"
  ? new Resend(resendApiKey)
  : null;

const emailFrom = process.env.EMAIL_FROM || "Jess Enterprises <noreply@jessenterprisesgoa.com>";
const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL || "jess.enterprises14@gmail.com";

function getSmtpTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  // 1. Try Resend
  if (resend) {
    try {
      await resend.emails.send({
        from: emailFrom,
        to,
        subject,
        html,
      });
      return true;
    } catch (err) {
      console.error("Resend delivery failed, attempting fallback:", err);
    }
  }

  // 2. Try Nodemailer SMTP fallback
  const smtp = getSmtpTransporter();
  if (smtp) {
    try {
      await smtp.sendMail({
        from: emailFrom,
        to,
        subject,
        html,
      });
      return true;
    } catch (err) {
      console.error("Nodemailer SMTP delivery failed:", err);
    }
  }

  // 3. Fallback for development without API keys
  console.log(`[Email Simulated] To: ${to} | Subject: "${subject}"`);
  return true;
}

export interface EnquiryItemEmail {
  productName: string;
  quantity: number;
  note?: string;
  productId?: unknown;
}

export interface EnquiryEmailData {
  type: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  city?: string;
  message: string;
  items?: EnquiryItemEmail[];
  sourcePage?: string;
}

export async function sendBusinessEnquiryNotification(data: EnquiryEmailData): Promise<boolean> {
  const itemsHtml =
    data.items && data.items.length > 0
      ? `
      <div style="margin-top: 15px; margin-bottom: 20px;">
        <h3 style="color: #1e5aa8; margin-bottom: 8px;">Requested Items / Products:</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 8px 12px;">Product</th>
              <th style="padding: 8px 12px; width: 60px;">Qty</th>
              <th style="padding: 8px 12px;">Note</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; font-weight: bold;">${item.productName}</td>
                <td style="padding: 8px 12px;">${item.quantity}</td>
                <td style="padding: 8px 12px; color: #64748b;">${item.note || "-"}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #0f172a;">
      <div style="background-color: #13335e; padding: 16px; border-radius: 6px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">New ${data.type.toUpperCase()} Enquiry Received</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #93c5fd;">Jess Enterprises Website</p>
      </div>

      <div style="padding: 20px 0;">
        <p style="font-size: 15px; line-height: 1.5;">You have received a new enquiry via the website:</p>
        
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td>
            <td style="padding: 6px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Company:</strong></td>
            <td style="padding: 6px 0;">${data.company || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td>
            <td style="padding: 6px 0;"><a href="tel:${data.phone}" style="color: #1e5aa8; font-weight: bold;">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #1e5aa8;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Location:</strong></td>
            <td style="padding: 6px 0;">${data.city || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Enquiry Type:</strong></td>
            <td style="padding: 6px 0;"><span style="background-color: #dbeafe; color: #1e5aa8; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${data.type.toUpperCase()}</span></td>
          </tr>
        </table>

        ${itemsHtml}

        <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #1e5aa8; border-radius: 4px;">
          <h4 style="margin: 0 0 6px 0; color: #334155; font-size: 14px;">Client Message / Technical Specs:</h4>
          <p style="margin: 0; font-size: 14px; white-space: pre-wrap; color: #1e293b;">${data.message}</p>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center;">
        <p style="margin: 0;">Jess Enterprises • Legal Metrology Licence No. 22000126-CLM • Goa, India</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: businessEmail,
    subject: `[New ${data.type.toUpperCase()} Enquiry] from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    html,
  });
}

export async function sendCustomerAcknowledgement(data: EnquiryEmailData): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #0f172a;">
      <div style="background-color: #1e5aa8; padding: 20px; border-radius: 6px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px; font-weight: bold;">JESS ENTERPRISES</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #bfdbfe; letter-spacing: 1px;">INNOVATIVE SERVICES • GOA, INDIA</p>
      </div>

      <div style="padding: 24px 0;">
        <h3 style="color: #0f172a; margin-top: 0;">Dear ${data.name},</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Thank you for reaching out to <strong>Jess Enterprises</strong>. We have successfully received your <strong>${data.type}</strong> request and our sales engineering team has been notified.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          We will review your requirements and follow up with a formal proposal / schedule your service visit within 24 business hours.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px;">Need Immediate Assistance or Urgent Dispatch?</h4>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #15803d;">
            📞 <strong>Direct Mobile / WhatsApp:</strong> +91 91583 91519
          </p>
          <p style="margin: 0; font-size: 13px; color: #15803d;">
            ☎️ <strong>Office Phone:</strong> +91 92259 01519
          </p>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          <strong>Our Accreditations:</strong><br>
          • Government Authorised Legal Metrology Licence No.: <strong>22000126-CLM</strong><br>
          • GSTIN: <strong>30AZCPG5317P1ZG</strong><br>
          • MSME Udyam: <strong>UDYAM-GA-01-0024091</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
        <p style="margin: 0 0 4px 0;">Jess Enterprises • Goa, India</p>
        <p style="margin: 0;">Email: jess.enterprises14@gmail.com</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: `Thank you for contacting Jess Enterprises - We have received your ${data.type} request`,
    html,
  });
}
