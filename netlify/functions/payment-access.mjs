const PAYMENT_PORTAL_URL = "https://losalamoslandsca.securepayments.cardpointe.com/pay";
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const redirectToGateway = (request, reason) => {
  const url = new URL("/pay-my-bill", request.url);
  url.searchParams.set("error", reason);
  return Response.redirect(url, 303);
};

export default async (request, context) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not configured for Netlify Functions.");
    return redirectToGateway(request, "configuration");
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return redirectToGateway(request, "invalid-request");
  }

  // Hidden honeypot: legitimate visitors leave this blank.
  if (formData.get("website")) {
    return redirectToGateway(request, "verification");
  }

  const token = formData.get("g-recaptcha-response");
  if (typeof token !== "string" || !token) {
    return redirectToGateway(request, "verification");
  }

  const verificationBody = new URLSearchParams({
    secret,
    response: token,
  });

  const clientIp = context?.ip;
  if (clientIp) verificationBody.set("remoteip", clientIp);

  try {
    const verificationResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: verificationBody,
    });

    if (!verificationResponse.ok) {
      console.error(`reCAPTCHA verification returned HTTP ${verificationResponse.status}.`);
      return redirectToGateway(request, "unavailable");
    }

    const result = await verificationResponse.json();
    const requestHostname = new URL(request.url).hostname.replace(/^www\./, "");
    const verifiedHostname = String(result.hostname || "").replace(/^www\./, "");

    if (!result.success || verifiedHostname !== requestHostname) {
      console.warn("Payment access rejected by reCAPTCHA.", result["error-codes"] || []);
      return redirectToGateway(request, "verification");
    }

    return Response.redirect(PAYMENT_PORTAL_URL, 303);
  } catch (error) {
    console.error("Unable to verify reCAPTCHA for payment access.", error);
    return redirectToGateway(request, "unavailable");
  }
};

export const config = {
  path: "/payment-access",
  method: "POST",
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
