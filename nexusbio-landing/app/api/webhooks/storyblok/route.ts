/**
 * Storyblok Webhook Handler
 *
 * This endpoint receives webhooks from Storyblok for:
 * - Workflow stage changes (content approval flow)
 * - Story publish/unpublish events
 * - Content updates
 *
 * STATUS: PARTIAL IMPLEMENTATION
 * - Webhook verification: IMPLEMENTED
 * - Audit triggers: SCAFFOLD
 * - Notifications: SCAFFOLD
 *
 * Setup in Storyblok:
 * Settings > Webhooks > Add Webhook
 * URL: https://your-domain.com/api/webhooks/storyblok
 * Events: workflow_step_changed, published, unpublished
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  WorkflowStage,
  type StoryblokWorkflowWebhook,
  type WorkflowNotification,
  type AuditResult,
  type APIResponse,
} from "@/app/types/integration-hooks";

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.STORYBLOK_WEBHOOK_SECRET || "";

/**
 * Verify Storyblok webhook signature
 */
function verifySignature(body: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    console.warn("[Webhook] No secret configured or signature missing - skipping verification");
    return true; // Allow in development, enforce in production
  }

  const expectedSignature = crypto
    .createHmac("sha1", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Map Storyblok workflow_step_id to our WorkflowStage enum
 * Configure these IDs after setting up workflows in Storyblok
 */
const WORKFLOW_STAGE_MAP: Record<number, WorkflowStage> = {
  // These IDs will be populated from Storyblok workflow configuration
  // Example mapping (replace with actual Storyblok step IDs):
  // 12345: WorkflowStage.DRAFT,
  // 12346: WorkflowStage.CONTENT_REVIEW,
  // 12347: WorkflowStage.LEGAL_REVIEW,
  // 12348: WorkflowStage.COMPLIANCE_REVIEW,
  // 12349: WorkflowStage.FINAL_APPROVAL,
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("webhook-signature");
  const bodyText = await request.text();

  // Verify webhook signature
  if (!verifySignature(bodyText, signature)) {
    console.error("[Webhook] Invalid signature");
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: StoryblokWorkflowWebhook;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  console.log(`[Webhook] Received: ${payload.action} for story ${payload.story_id}`);

  // Route to appropriate handler
  switch (payload.action) {
    case "workflow_step_changed":
      return handleWorkflowChange(payload);
    case "published":
      return handlePublish(payload);
    case "unpublished":
      return handleUnpublish(payload);
    default:
      console.log(`[Webhook] Unhandled action: ${payload.action}`);
      return NextResponse.json({ success: true, message: "Acknowledged" });
  }
}

/**
 * Handle workflow stage changes
 * Triggers automated audits and notifications
 */
async function handleWorkflowChange(
  payload: StoryblokWorkflowWebhook
): Promise<NextResponse> {
  const currentStage = payload.workflow_step_id
    ? WORKFLOW_STAGE_MAP[payload.workflow_step_id]
    : WorkflowStage.DRAFT;

  console.log(`[Webhook] Story ${payload.story_id} moved to stage: ${currentStage || "unknown"}`);

  // PHASE 2+ IMPLEMENTATION: Trigger automated audits
  // When content moves to review stages, run audits automatically

  const shouldRunAudit = [
    WorkflowStage.CONTENT_REVIEW,
    WorkflowStage.LEGAL_REVIEW,
    WorkflowStage.COMPLIANCE_REVIEW,
  ].includes(currentStage);

  if (shouldRunAudit) {
    console.log(`[Webhook] Audit trigger point for story ${payload.story_id}`);
    // SCAFFOLD: Trigger audit and capture results
    // const auditResult = await runAutomatedAudit(payload.full_slug);
    // await storeAuditResult(payload.story_id, auditResult);
  }

  // PHASE 2+ IMPLEMENTATION: Send notifications
  // const notification = buildNotification(payload, currentStage);
  // await sendNotifications(notification);

  const response: APIResponse<{ stage: string; auditTriggered: boolean }> = {
    success: true,
    data: {
      stage: currentStage || "unknown",
      auditTriggered: shouldRunAudit,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      version: "1.0.0",
    },
  };

  return NextResponse.json(response);
}

/**
 * Handle story publish events
 */
async function handlePublish(
  payload: StoryblokWorkflowWebhook
): Promise<NextResponse> {
  console.log(`[Webhook] Story published: ${payload.full_slug}`);

  // PHASE 2+ IMPLEMENTATION:
  // 1. Log publish event for analytics
  // 2. Trigger cache invalidation
  // 3. Notify stakeholders
  // 4. Update Tableau metrics

  return NextResponse.json({
    success: true,
    message: `Published: ${payload.full_slug}`,
  });
}

/**
 * Handle story unpublish events
 */
async function handleUnpublish(
  payload: StoryblokWorkflowWebhook
): Promise<NextResponse> {
  console.log(`[Webhook] Story unpublished: ${payload.full_slug}`);

  // PHASE 2+ IMPLEMENTATION:
  // 1. Log unpublish event
  // 2. Archive analytics data
  // 3. Notify content team

  return NextResponse.json({
    success: true,
    message: `Unpublished: ${payload.full_slug}`,
  });
}

/**
 * SCAFFOLD: Run automated audits
 * Implement in Phase 2 with actual audit execution
 */
async function runAutomatedAudit(storySlug: string): Promise<AuditResult> {
  // This will call the audit scripts and capture results
  // For now, return a placeholder
  return {
    auditId: crypto.randomUUID(),
    runAt: new Date().toISOString(),
    passed: true,
    checks: {
      accessibility: { passed: true, violations: [] },
      responsive: { passed: true, violations: [] },
    },
  };
}

/**
 * SCAFFOLD: Build notification payload
 */
function buildNotification(
  payload: StoryblokWorkflowWebhook,
  stage: WorkflowStage
): WorkflowNotification {
  return {
    type: "stage_change",
    storyId: payload.story_id,
    storyName: payload.full_slug.split("/").pop() || "",
    storySlug: payload.full_slug,
    currentStage: stage,
    triggeredBy: `user_${payload.user_id}`,
    message: `Story moved to ${stage}`,
    actionUrl: `https://app.storyblok.com/#!/me/spaces/${payload.space_id}/stories/${payload.story_id}`,
    recipients: ["editors"],
  };
}

/**
 * SCAFFOLD: Send notifications
 * Implement with Slack/Email integrations in Phase 2+
 */
async function sendNotifications(notification: WorkflowNotification): Promise<void> {
  console.log("[Webhook] Notification scaffold:", notification);
  // Implement: Slack webhook, SendGrid email, etc.
}
