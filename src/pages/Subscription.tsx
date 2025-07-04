
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Check, Star, Zap, Crown, Bot, Shield, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Subscription = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const userType = localStorage.getItem('freelancerBotUser') || 'freelancer';

  const plans = [
    {
      name: 'Basic',
      icon: Star,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        'Up to 5 job applications/posts per month',
        'Basic profile/project management',
        'Standard customer support',
        'Basic messaging system',
        'Mobile app access'
      ],
      limitations: [
        'Limited AI matching',
        'No priority support',
        'Basic analytics only'
      ],
      buttonText: 'Current Plan',
      popular: false,
      color: 'border-gray-200'
    },
    {
      name: 'Pro',
      icon: Zap,
      monthlyPrice: 29,
      yearlyPrice: 290,
      description: 'Most popular for professionals',
      features: [
        'Unlimited job applications/posts',
        'Advanced AI-powered matching',
        'Priority customer support',
        'Advanced messaging & video calls',
        'Detailed analytics & insights',
        'Custom portfolio templates',
        'Project collaboration tools',
        'Payment protection insurance'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      popular: true,
      color: 'border-blue-500'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: 'For agencies and large teams',
      features: [
        'Everything in Pro',
        'Team management dashboard',
        'White-label solutions',
        'Custom integrations & API access',
        'Dedicated account manager',
        'Advanced security features',
        'Custom contract templates',
        'Bulk hiring tools',
        'Advanced reporting suite'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      popular: false,
      color: 'border-purple-500'
    }
  ];

  const handleSubscribe = (planName: string, price: number) => {
    if (price === 0) {
      toast({
        title: "You're already on the Basic plan",
        description: "Upgrade to unlock more features!",
      });
      return;
    }

    toast({
      title: `Upgrading to ${planName}`,
      description: `Redirecting to secure payment processing...`,
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "🎉 Subscription Activated!",
        description: `Welcome to ${planName}! All features are now unlocked.`,
      });
    }, 2000);
  };

  const freemiumFeatures = [
    {
      title: 'AI-Powered Matching',
      description: 'Get matched with relevant opportunities',
      icon: Bot,
      free: 'Basic matching',
      premium: 'Advanced AI matching with 95% accuracy'
    },
    {
      title: 'Project Management',
      description: 'Organize and track your work',
      icon: Star,
      free: '5 projects max',
      premium: 'Unlimited projects with advanced tools'
    },
    {
      title: 'Customer Support',
      description: 'Get help when you need it',
      icon: Headphones,
      free: 'Email support',
      premium: '24/7 priority support + phone calls'
    },
    {
      title: 'Security & Protection',
      description: 'Keep your work and payments safe',
      icon: Shield,
      free: 'Basic security',
      premium: 'Enterprise-grade security + payment insurance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(userType === 'freelancer' ? '/freelancer-dashboard' : '/client-dashboard')} 
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Crown className="h-8 w-8 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Subscription Plans
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 mb-8">
            Unlock the full potential of FreelanceBot Pro with our flexible pricing
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <plan.icon className={`h-12 w-12 ${
                    plan.name === 'Basic' ? 'text-gray-600' :
                    plan.name === 'Pro' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    {plan.monthlyPrice > 0 && (
                      <span className="text-lg font-normal text-gray-500">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.name === 'Basic' ? 'bg-gray-600 hover:bg-gray-700' :
                    plan.name === 'Pro' ? 'bg-blue-600 hover:bg-blue-700' :
                    'bg-purple-600 hover:bg-purple-700'
                  }`}
                  onClick={() => handleSubscribe(plan.name, isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Freemium vs Premium Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Free vs Premium Features</CardTitle>
            <CardDescription className="text-center">
              See what you get with each plan level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {freemiumFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs font-medium text-gray-700">Free</p>
                      <p className="text-xs">{feature.free}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-xs font-medium text-blue-700">Premium</p>
                      <p className="text-xs">{feature.premium}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Money-back Guarantee */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">30-Day Money-Back Guarantee</h3>
            <p className="text-green-100 mb-4">
              Try any premium plan risk-free. If you're not completely satisfied, 
              we'll refund your money within 30 days.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                No setup fees
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                24/7 support
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
