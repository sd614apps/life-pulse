import React from 'react';

export function TermsContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p>By creating an account or using LifePulse ("the Service"), you agree to these Terms of Service. If you do not agree, you may not use the Service.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">2. Your Account</h2>
        <p>You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be at least 13 years old, or use the Service with a guardian's permission, to create an account.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">3. Your Content</h2>
        <p>You retain ownership of the health, financial, family, and travel information you store in LifePulse. You grant us a limited license to process your content solely to provide and secure the Service. Sensitive fields you mark as encrypted are protected client-side before storage.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">4. Acceptable Use</h2>
        <p>You agree not to misuse the Service, upload content you do not have rights to, or attempt to access another user's data. LifePulse enforces tenant isolation; circumventing access controls is prohibited.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">5. Service Availability</h2>
        <p>We strive to keep LifePulse available and secure but do not guarantee uninterrupted access. The Service is provided "as is" without warranty of any kind.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">6. Termination</h2>
        <p>You may delete your account or stop using the Service at any time. We may suspend access for violations of these Terms.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">7. Changes to These Terms</h2>
        <p>We may update these Terms and will notify you of material changes. Continued use after changes constitutes acceptance.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">8. Contact</h2>
        <p>For questions about these Terms, contact Base44 support.</p>
      </section>
    </div>
  );
}

export function PrivacyContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">1. Information We Collect</h2>
        <p>LifePulse stores the health, financial, family, and travel information you choose to enter, along with your account email and preferences. We also collect your browser locale and timezone to format content to your region.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">2. How We Use Your Data</h2>
        <p>We use your data only to provide the Service: organizing your records, generating alerts, and displaying your dashboard. We do not sell your personal data.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">3. Encryption & Security</h2>
        <p>Sensitive fields you designate are encrypted client-side before storage. Data in transit is encrypted, and data at rest is encrypted on managed infrastructure. Row-level security isolates each account's private records.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">4. Privacy Mode</h2>
        <p>Privacy Mode masks balances and other sensitive numbers on screen. This is a display convenience and does not change how data is stored.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">5. Data Retention</h2>
        <p>Your records remain until you delete them. Deleting a record removes it from your account; deleted records may be recoverable for a limited backup window before permanent removal.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">6. Your Rights</h2>
        <p>You may export or delete your data at any time through the Service. You may also adjust regional preferences and privacy settings in your profile.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">7. Sharing</h2>
        <p>We do not share your private records with other users. Features that share within a household only expose what you explicitly assign to family roles.</p>
      </section>
      <section>
        <h2 className="font-heading text-base font-semibold text-foreground">8. Contact</h2>
        <p>For privacy questions, contact Base44 support.</p>
      </section>
    </div>
  );
}