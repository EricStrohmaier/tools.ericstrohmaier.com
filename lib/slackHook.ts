const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL; // Add your Slack webhook URL to your .env file

export async function sendSlackNotification(message: string) {
  if (!SLACK_WEBHOOK_URL) {
    console.error("Slack webhook URL is not configured.");
    return;
  }

  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch (error) {
    console.error("Failed to send Slack notification", error);
  }
}
