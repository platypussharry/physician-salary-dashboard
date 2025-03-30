import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-6">Effective Date: March 30, 2024</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information Collection</h2>
        <p className="mb-4">We collect information that you voluntarily provide when using SalaryDr, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Salary information</li>
          <li>Practice type and location</li>
          <li>Job satisfaction ratings</li>
          <li>Work hours</li>
          <li>Other professional details you choose to share</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use of Information</h2>
        <p className="mb-4">The information we collect is used to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Generate aggregate salary statistics</li>
          <li>Provide insights into physician compensation trends</li>
          <li>Improve our services and user experience</li>
          <li>Communicate important updates or changes to our service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p className="mb-4">We implement appropriate security measures to protect your information, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments</li>
          <li>Limited access to personal information</li>
          <li>Secure data storage practices</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
        <p className="mb-4">We do not sell your personal information. We may share aggregated, anonymized data for research or analytical purposes. Individual data is only shared:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>With your explicit consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights or property</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Children's Privacy</h2>
        <p className="mb-4">Our service is not intended for and does not knowingly collect information from children under 13 years of age.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
        <p className="mb-4">SalaryDr provides this service "as is" and makes no representations about the accuracy or completeness of the data provided by users.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Warranties</h2>
        <p className="mb-4">We make no warranties, expressed or implied, regarding the service or your use of the information provided.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
        <p className="mb-4">By using SalaryDr, you agree to indemnify and hold harmless our company, employees, and affiliates from any claims arising from your use of the service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Changes to Privacy Policy</h2>
        <p className="mb-4">We reserve the right to modify this privacy policy at any time. Changes will be effective immediately upon posting to the website.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
        <p className="mb-4">For questions about this privacy policy, please contact us at: <a href="mailto:thesalarydr@gmail.com" className="text-blue-600 hover:text-blue-800">thesalarydr@gmail.com</a></p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
