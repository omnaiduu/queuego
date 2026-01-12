/**
 * Test script for WhatsApp integration
 * Run with: bun run test-whatsapp.ts
 */

import { WhatsApp } from "./src/lib/messageClass";

async function testWhatsAppMessage() {
    console.log("🚀 Testing WhatsApp message...\n");

    const phoneNumber = "917666235448";
    const phoneId = process.env.WHATSAPP_PHONE_ID || "";
    const token = process.env.WHATSAPP_TOKEN || "";

    if (!phoneId || !token) {
        console.error("❌ Error: WHATSAPP_PHONE_ID or WHATSAPP_TOKEN not found in .env");
        process.exit(1);
    }

    console.log(`📱 Sending to: ${phoneNumber}`);
    console.log(`📞 Phone ID: ${phoneId}`);
    console.log(`🔑 Token: ${token.substring(0, 20)}...\n`);

    try {
        const whatsapp = new WhatsApp(phoneNumber, phoneId, token);

        const testMessage =
            `🧪 *QueueGo Test Message*\n\n` +
            `This is a test message from QueueGo!\n\n` +
            `✅ WhatsApp integration is working correctly.\n` +
            `⏰ Timestamp: ${new Date().toLocaleString()}\n\n` +
            `You will receive notifications for:\n` +
            `• Ticket bookings\n` +
            `• Your turn alerts\n` +
            `• Service completion`;

        const response = await whatsapp.sendTextMessage(testMessage);

        if (response?.ok) {
            const data = await response.json();
            console.log("✅ Message sent successfully!");
            console.log("📬 Response:", JSON.stringify(data, null, 2));
            console.log("\n📱 Check WhatsApp on phone 917666235448 for the message");
        } else {
            console.error("❌ Failed to send message");
            if (response) {
                console.error("Response:", await response.text());
            }
        }

    } catch (error) {
        console.error("❌ Error sending message:", error);
        process.exit(1);
    }
}

// Run the test
testWhatsAppMessage();
