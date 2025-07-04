
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, MessageSquare, DollarSign, Zap, Star, ArrowRight, Bot, Shield, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleNavigateToDashboard = () => {
    if (profile?.user_type === 'freelancer') {
      navigate('/freelancer-dashboard');
    } else {
      navigate('/client-dashboard');
    }
  };

  if (user && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Bot className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorkFlow Bot
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Welcome back, {profile.full_name || profile.email}! Ready to get to work?
            </p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <Button 
                onClick={handleNavigateToDashboard}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorkFlow Bot
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connect. Create. Collaborate.
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The AI-powered platform that streamlines freelancer-client connections, 
              enhances productivity, and transforms how projects get done.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <CardTitle className="text-2xl">Join as Freelancer</CardTitle>
                  <CardDescription className="text-base">
                    Find amazing projects, build your portfolio, and grow your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      AI-powered job matching
                    </li>
                    <li className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                      Secure payment tracking
                    </li>
                    <li className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
                      Integrated communication
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2">
                <CardHeader className="text-center">
                  <Briefcase className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <CardTitle className="text-2xl">Hire as Client</CardTitle>
                  <CardDescription className="text-base">
                    Find top talent, manage projects, and scale your business efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Users className="h-4 w-4 text-purple-500 mr-2" />
                      Smart freelancer recommendations
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-orange-500 mr-2" />
                      Project milestone tracking
                    </li>
                    <li className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      Quality assurance tools
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose WorkFlow Bot?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">AI-Powered Matching</h4>
              <p className="text-gray-600">
                Our intelligent bot analyzes skills, requirements, and preferences to create perfect matches
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Secure Payments</h4>
              <p className="text-gray-600">
                Built-in escrow system and milestone-based payments ensure everyone gets paid fairly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Streamlined Workflow</h4>
              <p className="text-gray-600">
                From project posting to completion, our platform handles every step seamlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Bot className="h-8 w-8 text-blue-400 mr-2" />
            <h3 className="text-2xl font-bold">WorkFlow Bot</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting talent with opportunity through intelligent automation
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
