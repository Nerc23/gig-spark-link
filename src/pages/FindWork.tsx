
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Clock, DollarSign, BookmarkPlus, ArrowLeft, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FindWork = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const jobCategories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Writing & Content',
    'Digital Marketing',
    'Data Science',
    'DevOps',
    'Graphic Design'
  ];

  const jobs = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      client: 'TechCorp Inc.',
      description: 'Looking for an experienced full-stack developer to build a modern e-commerce platform with React, Node.js, and MongoDB.',
      budget: '$3,000 - $5,000',
      timeframe: '4-6 weeks',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      location: 'Remote',
      posted: '2 hours ago',
      proposals: 8,
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'Mobile App UI/UX Design',
      client: 'StartupXYZ',
      description: 'Need a creative designer to create intuitive and modern UI/UX for our fitness tracking mobile application.',
      budget: '$1,500 - $2,500',
      timeframe: '2-3 weeks',
      skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Mobile Design'],
      location: 'Remote',
      posted: '5 hours ago',
      proposals: 12,
      category: 'UI/UX Design'
    },
    {
      id: 3,
      title: 'Technical Blog Writing',
      client: 'DevBlog Media',
      description: 'Seeking experienced technical writers to create in-depth articles about web development, AI, and emerging technologies.',
      budget: '$500 - $800',
      timeframe: '1-2 weeks',
      skills: ['Technical Writing', 'SEO', 'Web Development', 'AI'],
      location: 'Remote',
      posted: '1 day ago',
      proposals: 15,
      category: 'Writing & Content'
    },
    {
      id: 4,
      title: 'React Native Mobile App Development',
      client: 'HealthTech Solutions',
      description: 'Build a cross-platform mobile app for healthcare providers using React Native. Integration with backend APIs required.',
      budget: '$4,000 - $7,000',
      timeframe: '6-8 weeks',
      skills: ['React Native', 'JavaScript', 'API Integration', 'Mobile Development'],
      location: 'Remote',
      posted: '3 hours ago',
      proposals: 6,
      category: 'Mobile Development'
    },
    {
      id: 5,
      title: 'Digital Marketing Campaign',
      client: 'GrowthCo',
      description: 'Plan and execute a comprehensive digital marketing campaign including social media, PPC, and content marketing.',
      budget: '$2,000 - $3,500',
      timeframe: '3-4 weeks',
      skills: ['Digital Marketing', 'Social Media', 'PPC', 'Content Strategy'],
      location: 'Remote',
      posted: '6 hours ago',
      proposals: 20,
      category: 'Digital Marketing'
    }
  ];

  const handleApply = (jobId: number, jobTitle: string) => {
    toast({
      title: "Application Submitted!",
      description: `Your application for "${jobTitle}" has been submitted successfully.`,
    });
  };

  const handleSave = (jobTitle: string) => {
    toast({
      title: "Job Saved!",
      description: `"${jobTitle}" has been saved to your bookmarks.`,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/freelancer-dashboard')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Bot className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Find Work
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for jobs, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {jobCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* AI Recommendations Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bot className="h-8 w-8 mr-3" />
              <div>
                <h3 className="text-lg font-semibold mb-1">AI-Powered Job Matching</h3>
                <p className="text-blue-100">
                  Our intelligent bot has found {filteredJobs.length} jobs matching your skills and preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {filteredJobs.length} Jobs Available
          </h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
            </Badge>
            {searchTerm && (
              <Badge variant="outline">
                Searching: "{searchTerm}"
              </Badge>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-blue-600 mb-2">
                      {job.client}
                    </CardDescription>
                    <p className="text-gray-600 leading-relaxed">{job.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(job.title)}
                    className="ml-4"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-semibold">{job.budget}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span>{job.timeframe}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-purple-600 mr-2" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>Posted {job.posted} • {job.proposals} proposals</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline">
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleApply(job.id, job.title)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all categories</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWork;
