import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";

export const invitationsTable = sqliteTable("invitations", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  token: text("token").notNull().unique(),
  recipientCompany: text("recipient_company").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  sponsorType: text("sponsor_type").notNull(),
  customMessage: text("custom_message"),
  status: text("status").notNull().default("pending"),
  selectedPlan: text("selected_plan"),
  inKindType: text("in_kind_type"),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Invitation = typeof invitationsTable.$inferSelect;
export type InsertInvitation = typeof invitationsTable.$inferInsert;
