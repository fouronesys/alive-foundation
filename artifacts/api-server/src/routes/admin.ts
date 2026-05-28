import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { db, invitationsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  CreateInvitationBody,
  CreateInvitationResponse,
  DeleteInvitationResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/session";
import { sendInvitationEmail } from "../lib/email";

const router: IRouter = Router();

const tokenAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
const generateToken = customAlphabet(tokenAlphabet, 12);

function serializeInvitation(row: typeof invitationsTable.$inferSelect) {
  return {
    ...row,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

router.post("/admin/login", (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Solicitud inválida" });
    return;
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    req.log.error("ADMIN_PASSWORD is not configured");
    res.status(500).json({ message: "Servidor mal configurado" });
    return;
  }
  if (parsed.data.password !== expected) {
    res.status(401).json({ message: "Contraseña incorrecta" });
    return;
  }
  req.session.isAdmin = true;
  res.json(AdminLoginResponse.parse({ authenticated: true }));
});

router.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ authenticated: false });
  });
});

router.get("/admin/me", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ authenticated: !!req.session?.isAdmin });
});

router.get("/admin/invitations", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(invitationsTable)
    .orderBy(desc(invitationsTable.createdAt));
  res.json(rows.map(serializeInvitation));
});

router.post("/admin/invitations", requireAdmin, async (req, res) => {
  const parsed = CreateInvitationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Solicitud inválida" });
    return;
  }
  const data = parsed.data;
  const [row] = await db
    .insert(invitationsTable)
    .values({
      token: generateToken(),
      recipientCompany: data.recipientCompany,
      contactName: data.contactName ?? null,
      contactEmail: data.contactEmail ?? null,
      sponsorType: data.sponsorType,
      customMessage: data.customMessage ?? null,
    })
    .returning();

  // Send invitation email if a contact email was provided
  if (row.contactEmail) {
    sendInvitationEmail({
      to: row.contactEmail,
      contactName: row.contactName,
      recipientCompany: row.recipientCompany,
      sponsorType: row.sponsorType,
      customMessage: row.customMessage,
      token: row.token,
    }).catch((err) => {
      req.log.error({ err, token: row.token }, "Invitation email delivery failed");
    });
  }

  res.json(CreateInvitationResponse.parse(serializeInvitation(row)));
});

router.delete("/admin/invitations/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  await db.delete(invitationsTable).where(eq(invitationsTable.id, id));
  res.json(DeleteInvitationResponse.parse({ ok: true }));
});

export default router;
