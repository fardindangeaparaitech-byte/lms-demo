import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    // Getting Data from request body
    const { data, type } = req.body

    // Switch Cases for differernt Events
    switch (type) {
      case 'user.created': {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// Stripe Webhooks to Manage Payments Action - COMPLETELY UPDATED
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("✅ Webhook received:", event.type);
  }
  catch (err) {
    console.log("❌ Webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      try {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        console.log("💰 Payment succeeded, PaymentIntent ID:", paymentIntentId);

        // Getting Session Metadata
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1
        });

        if (sessions.data.length === 0) {
          console.log("❌ No session found for payment intent:", paymentIntentId);
          break;
        }

        const session = sessions.data[0];
        const { purchaseId } = session.metadata;

        console.log("📦 Purchase ID from metadata:", purchaseId);

        if (!purchaseId) {
          console.log("❌ No purchaseId in session metadata");
          break;
        }

        // FIND PURCHASE DATA
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.log("❌ Purchase not found with ID:", purchaseId);
          break;
        }

        console.log("👤 User ID:", purchaseData.userId);
        console.log("📚 Course ID:", purchaseData.courseId);

        // FIND USER AND COURSE
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());

        if (!userData) {
          console.log("❌ User not found with ID:", purchaseData.userId);
          break;
        }

        if (!courseData) {
          console.log("❌ Course not found with ID:", purchaseData.courseId);
          break;
        }

        // ADD USER TO COURSE'S ENROLLED STUDENTS (USER ID ONLY)
        if (!courseData.enrolledStudents.includes(purchaseData.userId)) {
          courseData.enrolledStudents.push(purchaseData.userId);
          await courseData.save();
          console.log("✅ User added to course enrolledStudents");
        } else {
          console.log("ℹ️ User already enrolled in course");
        }

        // ADD COURSE TO USER'S ENROLLED COURSES (COURSE ID ONLY)
        if (!userData.enrolledCourses.includes(purchaseData.courseId)) {
          userData.enrolledCourses.push(purchaseData.courseId);
          await userData.save();
          console.log("✅ Course added to user enrolledCourses");
        } else {
          console.log("ℹ️ Course already in user's enrolledCourses");
        }

        // UPDATE PURCHASE STATUS
        purchaseData.status = 'completed';
        await purchaseData.save();
        console.log("✅ Purchase status updated to completed");

        console.log("🎉 Enrollment completed successfully!");

      } catch (error) {
        console.error("💥 Error in payment_intent.succeeded:", error);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      try {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        console.log("❌ Payment failed, PaymentIntent ID:", paymentIntentId);

        // GET SESSION WITH METADATA
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1
        });

        if (sessions.data.length === 0) {
          console.log("❌ No session found for failed payment intent:", paymentIntentId);
          break;
        }

        const session = sessions.data[0];
        const { purchaseId } = session.metadata;

        if (purchaseId) {
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = 'failed';
            await purchaseData.save();
            console.log("✅ Purchase status updated to failed");
          }
        }
      } catch (error) {
        console.error("💥 Error in payment_intent.payment_failed:", error);
      }
      break;
    }

    case 'checkout.session.completed': {
      // EXTRA SAFETY KE LIYE
      try {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        console.log("🛒 Checkout session completed, Purchase ID:", purchaseId);
        // Yahan same enrollment logic daal sakte ho agar chaho
      } catch (error) {
        console.error("💥 Error in checkout.session.completed:", error);
      }
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}