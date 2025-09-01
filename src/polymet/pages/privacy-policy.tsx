export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8">
            <section>
              <p>
                Mind Harmony ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you visit our website mindharmony.life, attend our events, 
                or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Name (first and last)</li>
                <li>Email address</li>
                <li>Phone number (if you opt in to SMS communications)</li>
                <li>City and state (for event planning purposes)</li>
                <li>Event attendance history</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
              <p>We automatically collect certain information when you visit our Website:</p>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our Website</li>
                <li>Music listening activity (for Members)</li>
                <li>Magic link click tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Send event invitations and updates</li>
                <li>Process event reservations and payments</li>
                <li>Deliver exclusive music content to Members</li>
                <li>Send SMS notifications (only if you opt in)</li>
                <li>Analyze usage patterns to improve our offerings</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist us in 
                operating our Website, conducting our business, or serving our users (such as email services, SMS providers, 
                and payment processors)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information 
                may be transferred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage 
              is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Request deletion of your personal information (subject to legal requirements)</li>
                <li>Withdraw consent for SMS communications by replying STOP</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
              <p>We use cookies and similar tracking technologies to enhance your experience on our Website. You can control 
              cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
              <p>Our Website is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. California Privacy Rights</h2>
              <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), 
              including the right to know what personal information we collect, the right to delete personal information, and 
              the right to opt-out of the sale of personal information (note: we do not sell personal information).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date above.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p>
                Mind Harmony<br/>
                Email: events@mail.mindharmony.life<br/>
                Website: mindharmony.life
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
