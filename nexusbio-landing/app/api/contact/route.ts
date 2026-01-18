import { NextRequest, NextResponse } from "next/server";

/**
 * Contact Form API Endpoint
 *
 * Handles form submissions from the ContactFormSection component.
 *
 * STATUS: SCAFFOLD - Ready for email service integration
 *
 * Integration Options:
 * - SendGrid: npm install @sendgrid/mail
 * - AWS SES: npm install @aws-sdk/client-ses
 * - Resend: npm install resend
 * - Nodemailer: npm install nodemailer
 */

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  inquiry_type: string;
  message: string;
}

// Simple rate limiting (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 submissions per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 5000); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.inquiry_type || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, email, inquiry_type, message",
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      company: body.company ? sanitizeInput(body.company) : undefined,
      inquiry_type: sanitizeInput(body.inquiry_type),
      message: sanitizeInput(body.message),
      submittedAt: new Date().toISOString(),
      ip: ip,
    };

    // Log submission (always, for audit trail)
    console.log("[Contact Form] New submission:", {
      name: sanitizedData.name,
      email: sanitizedData.email,
      inquiry_type: sanitizedData.inquiry_type,
      timestamp: sanitizedData.submittedAt,
    });

    // ==========================================================================
    // EMAIL SERVICE INTEGRATION (Uncomment and configure one option)
    // ==========================================================================

    // Option 1: SendGrid
    // const sgMail = require("@sendgrid/mail");
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: process.env.CONTACT_EMAIL_TO,
    //   from: process.env.CONTACT_EMAIL_FROM,
    //   subject: `[${sanitizedData.inquiry_type}] New inquiry from ${sanitizedData.name}`,
    //   text: `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nCompany: ${sanitizedData.company || "N/A"}\nInquiry Type: ${sanitizedData.inquiry_type}\n\nMessage:\n${sanitizedData.message}`,
    // });

    // Option 2: Resend
    // const { Resend } = require("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.CONTACT_EMAIL_FROM,
    //   to: process.env.CONTACT_EMAIL_TO,
    //   subject: `[${sanitizedData.inquiry_type}] New inquiry from ${sanitizedData.name}`,
    //   text: `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nCompany: ${sanitizedData.company || "N/A"}\nInquiry Type: ${sanitizedData.inquiry_type}\n\nMessage:\n${sanitizedData.message}`,
    // });

    // ==========================================================================
    // END EMAIL SERVICE INTEGRATION
    // ==========================================================================

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("[Contact Form] Error processing submission:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
