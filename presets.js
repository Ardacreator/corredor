// ============================================================
// TEST SCENARIOS
// Add new example transfers here to test edge cases.
// Each becomes a button in the UI.
// ============================================================

export const presets = {
  clean:     { label: "Clean B2B → Mexico",
    corridor:"US-MX", amount:18000, rail:"bank", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes" },

  brstable:  { label: "Stablecoin → Brazil",
    corridor:"US-BR", amount:40000, rail:"stablecoin", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes" },

  nokyc:     { label: "Unverified large payout",
    corridor:"US-MX", amount:52000, rail:"stablecoin", purpose:"contractor", kyc:"none", ubo:"na", taxid:"no" },

  threshold: { label: "Just over MX reporting line",
    corridor:"US-MX", amount:800, rail:"bank", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"no" },

  cocrypto:  { label: "Crypto payout → Colombia",
    corridor:"US-CO", amount:5000, rail:"stablecoin", purpose:"contractor", kyc:"full", ubo:"na", taxid:"yes" },
};
