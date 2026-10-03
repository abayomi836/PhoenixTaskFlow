const sendEmail = async ({ to, subject, text, html }) => {
  const response = await fetch(process.env.GOOGLE_MAILER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.MAILER_SECRET,
      to,
      subject,
      text,
      html,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to send email");
  }

  return result;
};

module.exports = {
  sendEmail,
};