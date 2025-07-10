import { Button } from "@/components/ui/button";
import { CheckIcon, HelpCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Harmony Prelude",
      price: "Free",
      period: "",
      description:
        "Start your journey with a selection of essential piano-guided meditations.",
      features: [
        "Access to 3 guided meditations",
        "Basic meditation intake quiz",
        "Limited personal meditation journal",
        "Monthly newsletter with meditation tips",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Harmony Ensemble",
      price: "$8",
      period: "per month",
      description:
        "Deepen your practice with more meditations and community sessions.",
      features: [
        "Access to 18 guided meditations",
        "1 virtual group session per month",
        "Unlimited meditation journal",
        "Basic meditation resources & worksheets",
        "Access to themed meditation journeys",
      ],
      cta: "Join the Ensemble",
      popular: false,
    },
    {
      name: "Harmony Symphony",
      price: "$18",
      period: "per month",
      description:
        "Our most popular plan with the full library and special perks.",
      features: [
        "Access to all 72 guided meditations",
        "1 virtual group session per month",
        "Downloadable meditation resources",
        "Exclusive discounts on live events",
        "Exclusive Harmonizers Community access",
        "Personalized meditation recommendations",
        "Monthly hand-picked curated experiences",
      ],
      cta: "Experience Symphony",
      popular: true,
    },
  ];

  const masterpiecePlan = {
    name: "Harmony Masterpiece",
    originalPrice: "$162",
    price: "$88",
    period: "per year",
    saleText: "Limited Time – Save 55%",
    description:
      "Our best-value annual plan with exclusive perks and significant savings.",
    features: [
      "All features of Harmony Symphony",
      "Welcome kit: journal, candle, affirmation cards, guide",
      "Quarterly themed 7-day meditation collections",
      "Priority access to limited-capacity events",
      "Advanced progress-tracking dashboard",
      "Renews at $162/year after first year",
    ],
    cta: "Create Your Masterpiece",
  };

  const featureComparison = [
    {
      feature: "Guided Meditations",
      prelude: "3 sessions",
      ensemble: "18 sessions",
      symphony: "All 72 sessions",
      masterpiece: "All 72 + exclusives",
    },
    {
      feature: "Virtual Group Sessions",
      prelude: "Not included",
      ensemble: "1 / month",
      symphony: "1 / month",
      masterpiece: "1 / month",
    },
    {
      feature: "Community Access",
      prelude: "Not included",
      ensemble: "Not included",
      symphony: "Harmonizers Community",
      masterpiece: "Harmonizers Community",
    },
    {
      feature: "Event Discounts & Priority",
      prelude: "None",
      ensemble: "None",
      symphony: "Exclusive discounts",
      masterpiece: "Priority access + discounts",
    },
    {
      feature: "Welcome Kit",
      prelude: "—",
      ensemble: "—",
      symphony: "—",
      masterpiece: "Included",
    },
    {
      feature: "Quarterly Collections",
      prelude: "—",
      ensemble: "—",
      symphony: "—",
      masterpiece: "Included",
    },
    {
      feature: "Progress Dashboard",
      prelude: "—",
      ensemble: "—",
      symphony: "—",
      masterpiece: "Advanced",
    },
  ];

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.",
    },
    {
      question: "Is there a contract or commitment?",
      answer:
        "No, all our plans are month-to-month with no long-term commitment. You can cancel anytime.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 7-day money-back guarantee if you're not satisfied with your subscription.",
    },
    {
      question: "Are there any discounts for annual subscriptions?",
      answer:
        "Yes, we offer a 20% discount when you choose annual billing for any of our plans.",
    },
    {
      question: "How do I book the included sessions?",
      answer:
        "Once subscribed, you'll have access to our booking platform where you can schedule your included sessions based on availability.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/katesessions_young_man_left_1.jpg"
          alt="Kate Sessions Park with young man on left"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Harmony
            </h1>
            <p className="max-w-2xl mx-auto text-lg">
              Choose the plan that fits your meditation journey and unlock the
              transformative power of piano-guided mindfulness.
            </p>
          </div>
        </div>
      </div>

      {/* Harmonize Plans Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Harmonize Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the plan that best suits your needs and begin your journey
              to inner harmony today. All plans include access to our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden border ${
                  plan.popular
                    ? "border-[#D4AF37] shadow-lg relative"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div
                  className={`p-6 ${
                    plan.popular ? "bg-[#F5F0E5]/50" : "bg-card"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-[#D4AF37] hover:bg-[#C4A027] text-white"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
                <div className="p-6 border-t border-border bg-background">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckIcon
                          className="h-5 w-5 text-[#1E3A5F] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Masterpiece Plan – full width */}
          <div className="mt-12 relative rounded-lg overflow-hidden border border-[#3A1E5F] bg-[#3A1E5F]/5 shadow-lg">
            <div className="absolute top-0 right-0 bg-[#3A1E5F] text-white px-4 py-1 text-sm font-medium">
              Best Value
            </div>

            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Left column – details */}
              <div className="flex-1 p-8">
                <h3 className="text-2xl font-semibold mb-2 text-[#3A1E5F]">
                  {masterpiecePlan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-muted-foreground line-through">
                    {masterpiecePlan.originalPrice}
                  </span>
                  <span className="text-4xl font-bold text-[#3A1E5F]">
                    {masterpiecePlan.price}
                  </span>
                  <span className="text-muted-foreground">{masterpiecePlan.period}</span>
                </div>
                <div className="mb-6">
                  <span className="line-through text-sm text-muted-foreground mr-2">
                    Save 25%
                  </span>
                  <span className="text-sm font-semibold text-[#3A1E5F]">
                    Save 55%!
                  </span>
                </div>
                <Button
                  className="bg-[#3A1E5F] hover:bg-[#2C1747] text-white"
                  size="lg"
                >
                  {masterpiecePlan.cta}
                </Button>
              </div>

              {/* Right column – features */}
              <div className="flex-1 p-8 border-t lg:border-t-0 lg:border-l border-border bg-background">
                <ul className="space-y-3">
                  {masterpiecePlan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckIcon
                        className="h-5 w-5 text-[#3A1E5F] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#E5F0F9]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features Comparison</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare our plans to find the perfect fit for your meditation
              practice and spiritual journey.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b border-border">
                    Feature
                  </th>
                  <th className="p-4 border-b border-border">Harmony Prelude</th>
                  <th className="p-4 border-b border-border bg-[#E5F0F9]/30">Harmony Ensemble</th>
                  <th className="p-4 border-b border-border bg-[#F5F0E5]/30">Harmony Symphony</th>
                  <th className="p-4 border-b border-border">Harmony Masterpiece</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-background" : "bg-card/50"}
                  >
                    <td className="p-4 border-b border-border font-medium">
                      {row.feature}
                    </td>
                    <td className="p-4 border-b border-border text-center">
                      {row.prelude}
                    </td>
                    <td className="p-4 border-b border-border text-center bg-[#E5F0F9]/30">
                      {row.ensemble}
                    </td>
                    <td className="p-4 border-b border-border text-center bg-[#F5F0E5]/30">
                      {row.symphony}
                    </td>
                    <td className="p-4 border-b border-border text-center">
                      {row.masterpiece}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our Harmonize plans and
              subscriptions.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-[#E5F0F9]/50"
              >
                <div className="flex items-start gap-3">
                  <HelpCircleIcon
                    className="h-6 w-6 text-[#1E3A5F] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#1E3A5F] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Begin Your Meditation Journey Today
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join our community of mindful individuals and experience the
            transformative power of piano-guided meditation. Choose your plan
            and start your journey to inner harmony.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#1E3A5F] hover:bg-white/90"
            >
              View Plans
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 bg-[#F5F0E5]/30 rounded-lg p-6">
          <div className="w-24 h-24 rounded-full bg-[#F5F0E5] flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-[#D4AF37]"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              7-Day Money Back Guarantee
            </h3>
            <p className="text-muted-foreground">
              We're confident you'll love your Mind Harmony experience. If
              you're not completely satisfied within the first 7 days, we'll
              refund your subscription — no questions asked. Your journey to
              inner peace should be stress-free from the start.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
