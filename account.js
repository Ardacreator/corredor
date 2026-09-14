// ============================================================
// ACCOUNT & DASHBOARD SHELL (prototype)
// Foundation for future features: subscription tiers, billing,
// usage metering, saved transfers, team seats.
// ------------------------------------------------------------
// For now this is a client-side stub — no real auth, no real
// payments. It defines the SHAPE of the account model so future
// work (Stripe billing, real login, usage limits) has a place to
// plug in. Nothing here moves money or stores real credentials.
// ============================================================

// Plan tiers — placeholder pricing, to be decided later with real data.
export const PLANS = {
  starter: {
    id: "starter", name: "Starter",
    price: 0, priceLabel: "Free",
    screensPerMonth: 50,
    countries: ["US-MX"],
    blurb: "Try the engine on one corridor.",
  },
  growth: {
    id: "growth", name: "Growth",
    price: null, priceLabel: "Usage-based",
    screensPerMonth: 5000,
    countries: ["US-MX", "US-BR", "US-CO", "US-AR"],
    blurb: "All corridors, pay per screened transfer.",
  },
  scale: {
    id: "scale", name: "Scale",
    price: null, priceLabel: "Custom",
    screensPerMonth: Infinity,
    countries: ["US-MX", "US-BR", "US-CO", "US-AR"],
    blurb: "Volume pricing, audit logs, team seats, API.",
  },
};

// A demo account object — future: comes from real auth/backend.
export function demoAccount() {
  return {
    org: "Demo Fintech Inc.",
    plan: "growth",
    screensUsed: 0,          // future: metered per screened transfer
    screensLimit: PLANS.growth.screensPerMonth,
    since: "prototype",
  };
}

// Pricing model note (design intent, not final):
//  - Outcome/usage based: charge per screened transfer or per filed report.
//  - Subscription tiers gate corridors + volume.
//  - "Scale" adds audit logs, team seats, API access.
// Revenue features (Stripe, invoicing, metering) plug in here LATER,
// once the core engine and real customers exist.
