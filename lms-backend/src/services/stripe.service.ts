import { stripe } from "../config/stripe.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { EnrollmentStatus } from "@prisma/client";
import Stripe from "stripe";

// Get or create Stripe customer
async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name: string,
  existingCustomerId: string | null
): Promise<string> {
  if (existingCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(existingCustomerId);
      if (!customer.deleted) {
        return existingCustomerId;
      }
    } catch {
      console.log(
        `Stripe customer ${existingCustomerId} not found, creating new one`
      );
    }
  }

  const customer = await stripe.customers.create({
    email: email,
    name: name,
    metadata: { userId: userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// Create checkout session for course enrollment
export async function createCheckoutSession(
  courseId: string,
  userId: string,
  userEmail: string,
  userName: string
) {
  // Fetch course details
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      price: true,
      slug: true,
      stripePriceId: true,
      status: true,
    },
  });

  if (!course) {
    return { error: "Course not found." };
  }

  if (course.status !== "PUBLISHED") {
    return { error: "This course is not available for enrollment." };
  }

  if (!course.stripePriceId) {
    return { error: "This course is not configured for payment." };
  }

  // Check if user is already enrolled and completed
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: courseId,
        userId: userId,
      },
    },
    select: { status: true, id: true },
  });

  if (existingEnrollment?.status === EnrollmentStatus.Completed) {
    return { alreadyEnrolled: true };
  }

  // Get or create Stripe customer
  const userWithStripeCustomerId = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  const stripeCustomerId = await getOrCreateStripeCustomer(
    userId,
    userEmail,
    userName,
    userWithStripeCustomerId?.stripeCustomerId ?? null
  );

  // Create or update enrollment record
  let enrollment;
  if (existingEnrollment) {
    enrollment = await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: {
        ammount: course.price,
        status: EnrollmentStatus.Pending,
        updatedAt: new Date(),
      },
    });
  } else {
    enrollment = await prisma.enrollment.create({
      data: {
        courseId: course.id,
        userId: userId,
        ammount: course.price,
        status: EnrollmentStatus.Pending,
      },
    });
  }

  // Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price: course.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
    metadata: {
      userId: userId,
      courseId: course.id,
      enrollmentId: enrollment.id,
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  if (!checkoutSession.url) {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: EnrollmentStatus.Cancelled },
    });
    return { error: "Failed to create checkout session. Please try again." };
  }

  return { checkoutUrl: checkoutSession.url };
}

// Handle checkout session completed webhook
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const { courseId, userId, enrollmentId } = session.metadata ?? {};

  if (!courseId || !userId || !enrollmentId) {
    console.error("Missing required metadata in checkout session:", {
      sessionId: session.id,
      courseId,
      userId,
      enrollmentId,
    });
    return;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: {
      id: true,
      status: true,
      userId: true,
      courseId: true,
      ammount: true,
    },
  });

  if (!enrollment) {
    console.error(`Enrollment not found: ${enrollmentId}`);
    return;
  }

  if (enrollment.userId !== userId || enrollment.courseId !== courseId) {
    console.error("Enrollment mismatch:", {
      expected: { userId, courseId },
      actual: { userId: enrollment.userId, courseId: enrollment.courseId },
    });
    return;
  }

  if (enrollment.status === EnrollmentStatus.Completed) {
    console.log(`Enrollment ${enrollmentId} already completed, skipping`);
    return;
  }

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      status: EnrollmentStatus.Completed,
      ammount: session.amount_total ?? enrollment.ammount,
      updatedAt: new Date(),
    },
  });

  console.log(
    `Enrollment ${enrollmentId} completed for user ${userId}, course ${courseId}`
  );
}

// Handle checkout session expired webhook
export async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session
) {
  const { enrollmentId } = session.metadata ?? {};

  if (!enrollmentId) {
    console.log("No enrollment ID in expired session metadata");
    return;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { id: true, status: true },
  });

  if (!enrollment) {
    console.log(`Enrollment ${enrollmentId} not found for expired session`);
    return;
  }

  if (enrollment.status === EnrollmentStatus.Pending) {
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EnrollmentStatus.Cancelled,
        updatedAt: new Date(),
      },
    });
    console.log(
      `Enrollment ${enrollmentId} cancelled due to expired checkout session`
    );
  }
}

// Construct webhook event from raw body
export function constructWebhookEvent(
  rawBody: Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}
