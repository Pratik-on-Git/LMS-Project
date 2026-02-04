import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/requireUser.js";
import * as stripeService from "../services/stripe.service.js";
import Stripe from "stripe";

// POST /api/stripe/checkout - Create checkout session
export async function createCheckout(req: AuthenticatedRequest, res: Response) {
  try {
    const { courseId } = req.body;
    const userId = req.user!.id;
    const userEmail = req.user!.email;
    const userName = req.user!.name;

    const result = await stripeService.createCheckoutSession(
      courseId,
      userId,
      userEmail,
      userName
    );

    if (result.error) {
      return res.status(400).json({
        status: "error",
        message: result.error,
      });
    }

    if (result.alreadyEnrolled) {
      return res.json({
        status: "success",
        message: "You are already enrolled in this course.",
        data: { alreadyEnrolled: true },
      });
    }

    res.json({
      status: "success",
      message: "Checkout session created",
      data: { checkoutUrl: result.checkoutUrl },
    });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({
        status: "error",
        message: "Payment processing error: " + error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Failed to create checkout session",
    });
  }
}

// POST /api/stripe/webhook - Stripe webhook handler
export async function handleWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    console.error("Missing Stripe-Signature header");
    return res.status(400).json({
      status: "error",
      message: "Missing Stripe-Signature header",
    });
  }

  let event: Stripe.Event;

  try {
    event = stripeService.constructWebhookEvent(
      req.body as Buffer,
      signature
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return res.status(400).json({
      status: "error",
      message: "Webhook signature verification failed",
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await stripeService.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }
      case "checkout.session.expired": {
        await stripeService.handleCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    res.status(200).json({ received: true, error: "Processing error" });
  }
}
