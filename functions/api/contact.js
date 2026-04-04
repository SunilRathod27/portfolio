export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { name, email, message } = await context.request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "All fields are required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const GMAIL_USER = context.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = context.env.GMAIL_APP_PASSWORD;

    const rawEmail = [
      `From: ${GMAIL_USER}`,
      `To: ${GMAIL_USER}`,
      `Reply-To: ${email}`,
      `Subject: Portfolio Contact: ${name}`,
      `Content-Type: text/html; charset=UTF-8`,
      "",
      `<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    ].join("\r\n");

    const encodedMessage = btoa(unescape(encodeURIComponent(rawEmail)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send via Gmail SMTP using Cloudflare TCP sockets
    const sent = await sendViaSMTP(GMAIL_USER, GMAIL_APP_PASSWORD, GMAIL_USER, rawEmail);

    if (sent) {
      return new Response(
        JSON.stringify({ success: true, message: "Message sent successfully!" }),
        { status: 200, headers: corsHeaders }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email." }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Server error. Please try again." }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

async function sendViaSMTP(user, password, to, rawMessage) {
  const socket = connect("smtp.gmail.com:465", { secureTransport: "on" });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  async function readLine() {
    let result = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      if (result.includes("\r\n")) break;
    }
    return result.trim();
  }

  async function send(cmd) {
    await writer.write(encoder.encode(cmd + "\r\n"));
    return await readLine();
  }

  try {
    // Read greeting
    await readLine();

    // EHLO
    await send("EHLO cloudflare.com");

    // AUTH LOGIN
    await send("AUTH LOGIN");
    await send(btoa(user));
    const authResult = await send(btoa(password));

    if (!authResult.startsWith("235")) {
      return false;
    }

    // MAIL FROM
    await send(`MAIL FROM:<${user}>`);

    // RCPT TO
    await send(`RCPT TO:<${to}>`);

    // DATA
    await send("DATA");
    await send(rawMessage + "\r\n.");

    // QUIT
    await send("QUIT");

    writer.releaseLock();
    reader.releaseLock();
    await socket.close();

    return true;
  } catch {
    return false;
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
