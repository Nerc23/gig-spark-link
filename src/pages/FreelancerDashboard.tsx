
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MessageSquare, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Bell, 
  User, 
  Settings,
  TrendingUp,
  Star,
  Calendar,
  Bot
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [notifications] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem('freelancerBotUser');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const navItems = [
    { title: 'Find Work', icon: Search, path: '/find-work', color: 'bg-blue-500 hover:bg-blue-600' },
    { title: 'Messages', icon: MessageSquare, path: '/messages', color: 'bg-green-500 hover:bg-green-600', badge: notifications },
    { title: 'My Projects', icon: Briefcase, path: '/freelancer-projects', color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'Payments', icon: DollarSign, path: '/freelancer-payments', color: 'bg-orange-500 hover:bg-orange-600' },
    { title: 'Subscription', icon: CreditCard, path: '/subscription', color: 'bg-pink-500 hover:bg-pink-600' },
  ];

  const recentJobs = [
    { title: 'E-commerce Website Development', budget: '$2,500', deadline: '2 weeks', skills: ['React', 'Node.js', 'MongoDB'] },
    { title: 'Mobile App UI/UX Design', budget: '$1,800', deadline: '10 days', skills: ['Figma', 'UI/UX', 'Mobile Design'] },
    { title: 'Content Writing - Tech Blog', budget: '$500', deadline: '1 week', skills: ['Writing', 'SEO', 'Technology'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FreelanceBot Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {notifications > 0 && (
                  <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Freelancer!</h2>
          <p className="text-gray-600">Here's what's happening with your freelance business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,850</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to your most used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`${item.color} text-white h-20 flex flex-col items-center justify-center relative`}
                >
                  <item.icon className="h-6 w-6 mb-2" />
                  <span className="text-sm">{item.title}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 px-1 py-0 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Job Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Recommended Jobs
              </CardTitle>
              <CardDescription>AI-matched opportunities based on your skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{job.title}</h4>
                    <Badge variant="outline">{job.budget}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {job.deadline}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full">Apply Now</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => navigate('/find-work')}>
                View All Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Current Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Active Projects
              </CardTitle>
              <CardDescription>Track your ongoing work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Website Redesign</h4>
                  <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">Modern responsive design for tech startup</p>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-gray-200" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Due: Dec 15, 2024</span>
                  <span className="font-semibold">$3,200</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Mobile App Development</h4>
                  <Badge className="bg-blue-100 text-blue-800">Starting</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">React Native app for fitness tracking</p>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="h-2 bg-gray-200" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Due: Jan 20, 2025</span>
                  <span className="font-semibold">$5,500</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => navigate('/freelancer-projects')}>
                View All Projects
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ad Space */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100">Get access to premium features and priority support</p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/subscription')}>
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
