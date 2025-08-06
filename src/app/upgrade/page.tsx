'use client';

import { useState } from 'react';
import { Check, Star, Zap, Clock, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      highlights: [
        '3 invoices/month',
        'Basic templates',
        'Watermark included'
      ],
      features: [
        'CSV upload',
        'Live invoice preview',
        'PDF export',
        'No saved clients or rates'
      ],
      cta: 'Start for Free',
      popular: false,
      description: 'Perfect for trying out TimeFlow'
    },
    {
      name: 'Pro',
      price: { monthly: 9, yearly: 90 },
      highlights: [
        'Unlimited invoices',
        'Remove watermark',
        'Save up to 5 clients',
        'Add your logo + branding'
      ],
      features: [
        'Everything in Free',
        'Custom colors + footer',
        '3 premium templates',
        'Priority support'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      description: 'Most popular for active freelancers'
    },
    {
      name: 'Premium',
      price: { monthly: 19, yearly: 190 },
      highlights: [
        'Unlimited saved clients & rates',
        'Recurring invoices',
        'Multi-currency & tax handling'
      ],
      features: [
        'Everything in Pro',
        'Invoice scheduling + auto-send',
        'Full template library',
        'Advanced analytics'
      ],
      cta: 'Get Premium',
      popular: false,
      description: 'For growing freelance businesses'
    }
  ];

  const getCurrentPrice = (tier: typeof tiers[0]) => {
    return billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly;
  };

  const getSavings = (tier: typeof tiers[0]) => {
    if (billingCycle === 'yearly' && tier.price.monthly > 0) {
      return tier.price.monthly * 12 - tier.price.yearly;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center cursor-pointer">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TimeFlow</h1>
            </Link>
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Invoice Generator
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Star className="w-4 h-4 mr-2" />
              Upgrade Your Workflow
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upgrade your workflow. Look more professional. Get paid faster.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your freelance business. No setup, no lock-in.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Save 2 months
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                tier.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Tier Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${getCurrentPrice(tier)}
                      </span>
                      {tier.price.monthly > 0 && (
                        <span className="text-gray-500 ml-2">
                          /{billingCycle === 'monthly' ? 'mo' : 'year'}
                        </span>
                      )}
                    </div>
                    {getSavings(tier) > 0 && (
                      <p className="text-green-600 text-sm font-medium mt-1">
                        Save ${getSavings(tier)}/year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : tier.name === 'Free'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {tier.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* All Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Everything Included</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alternative Model */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Just need one invoice?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Pay $2 per invoice without a subscription. Best for occasional freelancers or one-off use cases.
            </p>
            <button className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Pay per Invoice
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
            <p className="text-gray-600">
              Generate professional invoices in under 60 seconds instead of hours of manual work.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Look Professional</h3>
            <p className="text-gray-600">
              Remove watermarks, add your branding, and use premium templates to impress clients.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Paid Faster</h3>
            <p className="text-gray-600">
              Professional invoices with clear payment terms help you get paid on time, every time.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm">
                Yes! You can cancel your subscription at any time. No long-term contracts or hidden fees.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and Apple Pay. All payments are secure and encrypted.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade?</h4>
              <p className="text-gray-600 text-sm">
                Absolutely! You can change your plan at any time. Changes take effect immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 TimeFlow. Generate professional invoices from your time logs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 