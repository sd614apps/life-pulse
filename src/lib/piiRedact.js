// Client-side PII scrubbing before any prompt is sent to the LLM.
// Replaces identifiable tokens with neutral placeholders.
export function redactPII(text) {
  if (!text) return '';
  let t = String(text);
  // Social Security Numbers
  t = t.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
  // Email addresses
  t = t.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[EMAIL]');
  // Phone numbers (US/IN-ish)
  t = t.replace(/\b(\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g, '[PHONE]');
  // Long digit runs (account / card numbers)
  t = t.replace(/\b\d{9,}\b/g, '[ACCOUNT]');
  // Currency + bank / institution mentions, e.g. "$2,450 at Chase Bank"
  t = t.replace(/(\$\d[\d,.]*\s+(?:at|from|with|to)\s+[A-Z][A-Za-z&. ]{2,30})/g, '[FINANCIAL_ACCOUNT]');
  // Street addresses
  t = t.replace(/\b\d+\s+[A-Z][A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd|Lane|Ln)\b/g, '[ADDRESS]');
  return t;
}