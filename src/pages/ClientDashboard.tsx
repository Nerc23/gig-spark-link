
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  MessageSquare, 
  FolderOpen, 
  Users, 
  DollarSign, 
  CreditCard,
  Megaphone,
  Bell, 
  User, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  Bot
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [notifications] = useState(2);

  const handleLogout = () => {
    localStorage.removeItem('freelancerBotUser');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const navItems = [
    { title: 'Post Jobs', icon: Plus, path: '/post-jobs', color: 'bg-green-500 hover:bg-green-600' },
    { title: 'Messages', icon: MessageSquare, path: '/messages', color: 'bg-blue-500 hover:bg-blue-600', badge: notifications },
    { title: 'Manage Projects', icon: FolderOpen, path: '/manage-projects', color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'Applications', icon: Users, path: '/applications', color: 'bg-orange-500 hover:bg-orange-600', badge: 5 },
    { title: 'Payments', icon: DollarSign, path: '/client-payments', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { title: 'Ads', icon: Megaphone, path: '/ads', color: 'bg-pink-500 hover:bg-pink-600' },
    { title: 'Subscription', icon: CreditCard, path: '/subscription', color: 'bg-indigo-500 hover:bg-indigo-600' },
  ];

  const activeProjects = [
    { title: 'E-commerce Platform', freelancer: 'Sarah Chen', progress: 85, budget: '$12,000', status: 'In Progress' },
    { title: 'Marketing Website', freelancer: 'Mike Johnson', progress: 45, budget: '$4,500', status: 'Design Phase' },
    { title: 'Mobile App Prototype', freelancer: 'Alex Rivera', progress: 20, budget: '$8,000', status: 'Planning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
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
          <h2 className="text-3xl font-bold mb-2">Welcome to your Client Dashboard!</h2>
          <p className="text-gray-600">Manage your projects, find talent, and track your business growth.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$28,450</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Freelancers Hired</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foregreen">+3 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">Project completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access your most important features quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`${item.color} text-white h-20 flex flex-col items-center justify-center relative`}
                >
                  <item.icon className="h-6 w-6 mb-2" />
                  <span className="text-sm text-center">{item.title}</span>
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
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Active Projects
              </CardTitle>
              <CardDescription>Monitor your ongoing work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{project.title}</h4>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Freelancer: {project.freelancer}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget: {project.budget}</span>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => navigate('/manage-projects')}>
                View All Projects
              </Button>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Applications
              </CardTitle>
              <CardDescription>Review freelancer proposals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Emma Thompson</h4>
                    <p className="text-sm text-gray-600">Full-Stack Developer</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">New</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Applied for: React Dashboard Development</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proposal: $3,500</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">David Park</h4>
                    <p className="text-sm text-gray-600">UI/UX Designer</p>
                  </div>
                  <Badge variant="outline">Reviewed</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Applied for: Mobile App Design</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proposal: $2,200</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => navigate('/applications')}>
                View All Applications ({5})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Business Ads Section */}
        <Card className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Boost Your Business</h3>
                <p className="text-green-100">Professional project management tools to scale faster</p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/ads')}>
                Explore Tools
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
