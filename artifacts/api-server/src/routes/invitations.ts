import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, invitationsTable } from "@workspace/db";
import { ConfirmInvitationBody } from "@workspace/api-zod";

const router: IRouter = Router();

function toPublic(row: typeof invitationsTable.$inferSelect) {
  return {
    token: row.token,
    recipientCompany: row.recipientCompany,
    contactName: row.contactName,
    sponsorType: row.sponsorType,
    customMessage: row.customMessage,
    status: row.status,
    selectedPlan: row.selectedPlan,
    inKindType: row.inKindType,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
  };
}

router.get("/invitations/:token", async (req, res) => {
  const token = String(req.params.token);
  const [row] = await db
    .select()
    .from(invitationsTable)
    .where(eq(invitationsTable.token, token))
    .limit(1);
  if (!row) {
    res.status(404).json({ message: "Invitación no encontrada" });
    return;
  }
  res.json(toPublic(row));
});

router.post("/invitations/:token/confirm", async (req, res) => {
  const parsed = ConfirmInvitationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Plan inválido" });
    return;
  }
  const token = String(req.params.token);
  const [existing] = await db
    .select()
    .from(invitationsTable)
    .where(eq(invitationsTable.token, token))
    .limit(1);
  if (!existing) {
    res.status(404).json({ message: "Invitación no encontrada" });
    return;
  }
  if (existing.status === "confirmed") {
    res.status(409).json({
      message:
        "Esta invitación ya fue confirmada. Contacta al equipo si necesitas cambiar el plan.",
    });
    return;
  }
  const data = parsed.data;
  const [row] = await db
    .update(invitationsTable)
    .set({
      status: "confirmed",
      selectedPlan: data.plan,
      inKindType: data.inKindType ?? null,
      confirmedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(invitationsTable.token, token))
    .returning();
  res.json(toPublic(row));
});

export default router;
