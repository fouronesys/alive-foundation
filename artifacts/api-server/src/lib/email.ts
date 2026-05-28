import nodemailer from "nodemailer";
import { logger } from "./logger";

const SMTP_HOST = "smtp.zoho.com";
const SMTP_PORT = 587;
const SMTP_USER = "festival@alivefoundationrd.com";

function createTransport() {
  const pass = process.env["SMTP_PASS"];
  if (!pass) {
    logger.warn("SMTP_PASS is not set — emails will not be sent");
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: { user: SMTP_USER, pass },
    tls: { rejectUnauthorized: true },
  });
}

function buildInvitationUrl(token: string): string {
  const base = (process.env["PUBLIC_BASE_URL"] ?? "").replace(/\/$/, "");
  return `${base}/invitacion/${token}`;
}

const SPONSOR_TYPE_LABELS: Record<string, string> = {
  new: "nuevo aliado",
  returning: "aliado de siempre",
};

export async function sendInvitationEmail(opts: {
  to: string;
  contactName: string | null;
  recipientCompany: string;
  sponsorType: string;
  customMessage: string | null;
  token: string;
}): Promise<void> {
  const transport = createTransport();
  if (!transport) return;

  const invitationUrl = buildInvitationUrl(opts.token);
  const greeting = opts.contactName ? `Hola, ${opts.contactName}` : `Hola`;
  const sponsorLabel = SPONSOR_TYPE_LABELS[opts.sponsorType] ?? "aliado";
  const customBlock = opts.customMessage
    ? `<p style="margin:0 0 20px;color:#374151;">${opts.customMessage}</p>`
    : "";

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Invitación — Festival de la Inclusión 2026</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1a2e52;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#f97316;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Alive Foundation</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:900;">Festival de la Inclusión 2026</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#1a2e52;font-size:18px;font-weight:700;">${greeting},</p>
              <p style="margin:0 0 20px;color:#374151;">
                Es un honor invitar a <strong>${opts.recipientCompany}</strong> a sumarse como <strong>${sponsorLabel}</strong> al
                <strong>Festival de la Inclusión 2026</strong>, un evento que celebra la diversidad y transforma vidas en República Dominicana.
              </p>
              ${customBlock}
              <p style="margin:0 0 32px;color:#374151;">
                Hemos preparado esta invitación exclusiva para que puedas conocer los planes de patrocinio disponibles y elegir el que mejor se adapte a tu compromiso con la inclusión.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${invitationUrl}"
                       style="display:inline-block;padding:16px 40px;background:#f97316;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;border-radius:50px;">
                      Ver mi invitación personalizada →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;color:#6b7280;font-size:13px;text-align:center;">
                O copia y pega este enlace en tu navegador:<br/>
                <a href="${invitationUrl}" style="color:#f97316;word-break:break-all;">${invitationUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                Alive Foundation RD &nbsp;·&nbsp;
                <a href="mailto:info@alivefoundationrd.com" style="color:#9ca3af;">info@alivefoundationrd.com</a>
                &nbsp;·&nbsp; Santiago, República Dominicana
              </p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:11px;text-align:center;">
                "Haciendo de la inclusión una realidad"
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  const text = [
    `${greeting},`,
    ``,
    `Es un honor invitar a ${opts.recipientCompany} a sumarse como ${sponsorLabel} al Festival de la Inclusión 2026.`,
    opts.customMessage ? `\n${opts.customMessage}` : ``,
    ``,
    `Accede a tu invitación personalizada aquí:`,
    invitationUrl,
    ``,
    `— Alive Foundation RD`,
    `info@alivefoundationrd.com`,
  ]
    .join("\n")
    .trim();

  try {
    await transport.sendMail({
      from: `"Alive Foundation" <${SMTP_USER}>`,
      to: opts.to,
      subject: `Invitación al Festival de la Inclusión 2026 — ${opts.recipientCompany}`,
      html,
      text,
    });
    logger.info({ to: opts.to, company: opts.recipientCompany }, "Invitation email sent");
  } catch (err) {
    logger.error({ err, to: opts.to }, "Failed to send invitation email");
    throw err;
  }
}
