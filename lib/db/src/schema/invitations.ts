import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const invitationsTable = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  recipientCompany: text("recipient_company").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  sponsorType: text("sponsor_type").notNull(),
  customMessage: text("custom_message"),
  status: text("status").notNull().default("pending"),
  selectedPlan: text("selected_plan"),
  inKindType: text("in_kind_type"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Invitation = typeof invitationsTable.$inferSelect;
export type InsertInvitation = typeof invitationsTable.$inferInsert;
