
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Bot, Search, MessageSquare, Briefcase, DollarSign, Users, Zap, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const BotHelp = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const userType = localStorage.getItem('freelancerBotUser') || 'freelancer';

  const botCommands = [
    {
      command: '/help',
      description: 'Show all available commands and features',
      example: '/help'
    },
    {
      command: '/findwork [skills]',
      description: 'Find jobs matching your skills (freelancers only)',
      example: '/findwork react javascript'
    },
    {
      command: '/postjob',
      description: 'Start the job posting process (clients only)',
      example: '/postjob'
    },
    {
      command: '/profile',
      description: 'View or edit your profile',
      example: '/profile'
    },
    {
      command: '/payments',
      description: 'View payment history and pending payments',
      example: '/payments'
    },
    {
      command: '/messages',
      description: 'Check unread messages',
      example: '/messages'
    },
    {
      command: '/match [budget]',
      description: 'Find freelancers within budget (clients only)',
      example: '/match 1000-5000'
    },
    {
      command: '/status [project]',
      description: 'Check project status',
      example: '/status website-redesign'
    }
  ];

  const faqData = [
    {
      category: 'Getting Started',
      icon: Zap,
      questions: [
        {
          q: 'How does FreelanceBot Pro work?',
          a: 'FreelanceBot Pro uses AI to connect freelancers with clients. Simply create your profile, and our bot will match you with relevant opportunities based on your skills, experience, and preferences.'
        },
        {
          q: 'Is FreelanceBot Pro free to use?',
          a: 'We offer a freemium model. Basic features are free, including up to 5 job applications/posts per month. Premium plans unlock unlimited access and advanced features.'
        },
        {
          q: 'How do I create a good profile?',
          a: 'Include a professional photo, detailed skills list, portfolio samples, and clear descriptions of your experience. Our AI uses this information for better matching.'
        }
      ]
    },
    {
      category: 'For Freelancers',
      icon: Users,
      questions: [
        {
          q: 'How do I find the right jobs?',
          a: 'Use our AI-powered job matching system. Set your preferences, and the bot will notify you of relevant opportunities. You can also search manually using filters.'
        },
        {
          q: 'How does payment protection work?',
          a: 'We use an escrow system where clients deposit funds before work begins. Payments are released when milestones are approved, ensuring you get paid for completed work.'
        },
        {
          q: 'What if a client doesn\'t respond?',
          a: 'Our bot monitors communication patterns and will escalate inactive projects to our support team. Premium users get priority dispute resolution.'
        }
      ]
    },
    {
      category: 'For Clients',
      icon: Briefcase,
      questions: [
        {
          q: 'How do I find quality freelancers?',
          a: 'Our AI analyzes freelancer profiles, past work, and reviews to recommend the best matches for your project. You can also browse profiles and use filters.'
        },
        {
          q: 'What if I\'m not satisfied with the work?',
          a: 'We offer milestone-based payments and revision requests. If issues persist, our dispute resolution team can help mediate and find solutions.'
        },
        {
          q: 'Can I hire multiple freelancers for one project?',
          a: 'Yes! You can hire teams or individual freelancers for different aspects of your project. Our project management tools help coordinate everything.'
        }
      ]
    },
    {
      category: 'Payments & Billing',
      icon: DollarSign,
      questions: [
        {
          q: 'What payment methods do you accept?',
          q: 'We accept all major credit cards, PayPal, bank transfers, and cryptocurrency. Payments are processed securely through our encrypted platform.'
        },
        {
          q: 'When do I get paid as a freelancer?',
          a: 'Payments are released when clients approve milestones. Typically within 24-48 hours of approval. Premium users can get faster payouts.'
        },
        {
          q: 'Are there any fees?',
          a: 'Basic users pay a small transaction fee (5%). Premium subscribers enjoy reduced fees (2-3%) and Enterprise clients get custom rates.'
        }
      ]
    }
  ];

  const handleCommand = (command: string) => {
    toast({
      title: `🤖 Bot Command: ${command}`,
      description: "Command executed! Check the relevant section for results.",
    });
    
    // Simulate command execution
    if (command.includes('findwork')) {
      navigate('/find-work');
    } else if (command.includes('postjob')) {
      navigate('/post-jobs');
    } else if (command.includes('messages')) {
      navigate('/messages');
    } else if (command.includes('payments')) {
      navigate(userType === 'freelancer' ? '/freelancer-payments' : '/client-payments');
    }
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => qa.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           qa.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              <Bot className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bot Help & Commands
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Bot className="h-12 w-12 mr-4" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Meet FreelanceBot Assistant</h2>
                <p className="text-blue-100">
                  Your AI-powered assistant for seamless freelancing. Use commands, get instant help, 
                  and let the bot handle routine tasks so you can focus on what matters.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search help topics, commands, or FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bot Commands */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Available Bot Commands
            </CardTitle>
            <CardDescription>
              Type these commands in any message field to interact with the bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botCommands
                .filter(cmd => searchTerm === '' || cmd.command.includes(searchTerm.toLowerCase()) || cmd.description.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((cmd, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {cmd.command}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCommand(cmd.command)}
                    >
                      Try It
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cmd.description}</p>
                  <div className="text-xs text-gray-500">
                    <strong>Example:</strong> <code>{cmd.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredFAQ.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <category.icon className="h-6 w-6 mr-2" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.questions.map((qa, qaIndex) => (
                    <AccordionItem key={qaIndex} value={`item-${categoryIndex}-${qaIndex}`}>
                      <AccordionTrigger className="text-left">
                        {qa.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {qa.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Still Need Help?</h3>
            <p className="text-green-100 mb-6">
              Our support team is here to help you succeed. Get personalized assistance 
              from real humans when the bot can't solve your problem.
            </p>
            <div className="space-y-4">
              <Button variant="secondary" className="mr-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat Support
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                Email Support
              </Button>
            </div>
            <div className="mt-4 text-sm text-green-100">
              <p>Average response time: Basic (24h) • Pro (2h) • Enterprise (30min)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BotHelp;
