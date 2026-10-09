/**
 * Verify Cloudflare Turnstile Token
 */
export async function verifyTurnstileToken(
  token?: string,
  ip?: string
): Promise<{ success: boolean; message?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // In development or if keys are placeholder/dummy, pass gracefully
  if (
    !secretKey ||
    secretKey.includes("0000000000000000000000000000000AA") ||
    process.env.NODE_ENV === "development"
  ) {
    return { success: true };
  }

  if (!token) {
    return { success: false, message: "Spam verification token is missing." };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.success) {
      return { success: true };
    }
    return {
      success: false,
      message: "Security verification failed. Please try again.",
    };
  } catch (err) {
    console.error("Turnstile verification error:", err);
    // Fail open in case of network issue so legitimate customers aren't blocked
    return { success: true };
  }
}
