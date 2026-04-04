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

    // Use Gmail SMTP relay via Cloudflare TCP socket
    const result = await sendEmail(GMAIL_USER, GMAIL_APP_PASSWORD, {
      to: GMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });

    if (result.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "Message sent successfully!" }),
        { status: 200, headers: corsHeaders }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error || "Failed to send email." }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Server error: " + err.message }),
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

async function sendEmail(user, password, { to, replyTo, subject, html }) {
  try {
    const socket = connect("smtp.gmail.com:465", { secureTransport: "on" });
    const writer = socket.writable.getWriter();
    const reader = socket.readable.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let buffer = "";

    async function readResponse() {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\r\n");
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i];
          // Multi-line response continues with "XXX-", final line is "XXX "
          if (line.length >= 4 && line[3] === " ") {
            buffer = lines.slice(i + 1).join("\r\n");
            return line;
          }
        }
        buffer = lines[lines.length - 1];
      }
      return buffer;
    }

    async function send(cmd) {
      await writer.write(encoder.encode(cmd + "\r\n"));
      return await readResponse();
    }

    // Read server greeting
    const greeting = await readResponse();
    if (!greeting.startsWith("220")) return { ok: false, error: "SMTP greeting failed: " + greeting };

    // EHLO
    const ehlo = await send("EHLO sunilrathod.pages.dev");
    if (!ehlo.startsWith("250")) return { ok: false, error: "EHLO failed: " + ehlo };

    // AUTH LOGIN
    const auth = await send("AUTH LOGIN");
    if (!auth.startsWith("334")) return { ok: false, error: "AUTH failed: " + auth };

    const userResp = await send(btoa(user));
    if (!userResp.startsWith("334")) return { ok: false, error: "User auth failed: " + userResp };

    const passResp = await send(btoa(password));
    if (!passResp.startsWith("235")) return { ok: false, error: "Password auth failed: " + passResp };

    // MAIL FROM
    const from = await send(`MAIL FROM:<${user}>`);
    if (!from.startsWith("250")) return { ok: false, error: "MAIL FROM failed: " + from };

    // RCPT TO
    const rcpt = await send(`RCPT TO:<${to}>`);
    if (!rcpt.startsWith("250")) return { ok: false, error: "RCPT TO failed: " + rcpt };

    // DATA
    const data = await send("DATA");
    if (!data.startsWith("354")) return { ok: false, error: "DATA failed: " + data };

    // Send email content
    const emailContent = [
      `From: Sunil Rathod Portfolio <${user}>`,
      `To: ${to}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      "",
      html,
      "",
      ".",
    ].join("\r\n");

    const endResp = await send(emailContent);
    if (!endResp.startsWith("250")) return { ok: false, error: "Send failed: " + endResp };

    // QUIT
    await send("QUIT");

    writer.releaseLock();
    reader.releaseLock();
    await socket.close();

    return { ok: true };
  } catch (err) {
    return { ok: false, error: "SMTP error: " + err.message };
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
