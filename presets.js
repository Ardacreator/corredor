// ============================================================
// TEST SCENARIOS
// Add new example transfers here to test edge cases.
// Each becomes a button in the UI.
// Fields: corridor, amount, rail, purpose, kyc, ubo, taxid,
//         sanctions ('clear'|'possible'|'hit'), pep ('no'|'yes')
// ============================================================

export const presets = {
  clean:     { label: "Clean B2B → Mexico",
    corridor:"US-MX", amount:18000, rail:"bank", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes", sanctions:"clear", pep:"no" },

  brstable:  { label: "Stablecoin → Brazil",
    corridor:"US-BR", amount:40000, rail:"stablecoin", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes", sanctions:"clear", pep:"no" },

  nokyc:     { label: "Unverified large payout",
    corridor:"US-MX", amount:52000, rail:"stablecoin", purpose:"contractor", kyc:"none", ubo:"na", taxid:"no", sanctions:"clear", pep:"no" },

  sanctions: { label: "Sanctions hit → any",
    corridor:"US-MX", amount:12000, rail:"bank", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes", sanctions:"hit", pep:"no" },

  pep:       { label: "PEP recipient → Brazil",
    corridor:"US-BR", amount:30000, rail:"bank", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes", sanctions:"clear", pep:"yes" },

  cocrypto:  { label: "Crypto payout → Colombia",
    corridor:"US-CO", amount:5000, rail:"stablecoin", purpose:"contractor", kyc:"full", ubo:"na", taxid:"yes", sanctions:"clear", pep:"no" },

  arlarge:   { label: "Large crypto → Argentina",
    corridor:"US-AR", amount:45000, rail:"stablecoin", purpose:"supplier", kyc:"full", ubo:"yes", taxid:"yes", sanctions:"clear", pep:"no" },
};
