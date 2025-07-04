
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Bot, Briefcase, DollarSign, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PostJobs = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [jobData, setJobData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    budgetType: 'fixed',
    timeline: '',
    skillsRequired: [] as string[],
    experienceLevel: '',
    projectType: ''
  });
  const [newSkill, setNewSkill] = useState('');

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Writing & Content',
    'Digital Marketing',
    'Data Science',
    'DevOps',
    'Graphic Design',
    'Video & Animation',
    'Photography'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ];

  const timelineOptions = [
    'Less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    'More than 3 months'
  ];

  const addSkill = () => {
    if (newSkill.trim() && !jobData.skillsRequired.includes(newSkill.trim())) {
      setJobData({
        ...jobData,
        skillsRequired: [...jobData.skillsRequired, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setJobData({
      ...jobData,
      skillsRequired: jobData.skillsRequired.filter(skill => skill !== skillToRemove)
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Job Posted Successfully!",
      description: `"${jobData.title}" has been posted and is now visible to freelancers.`,
    });
    
    // Simulate bot notifications
    setTimeout(() => {
      toast({
        title: "🤖 FreelanceBot Update",
        description: "Your job has been sent to 23 matching freelancers based on their skills!",
      });
    }, 2000);

    navigate('/client-dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Job Details
              </CardTitle>
              <CardDescription>Let's start with the basics of your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <Input
                  placeholder="e.g., Build a React E-commerce Website"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={jobData.category} onValueChange={(value) => setJobData({ ...jobData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Description</label>
                <Textarea
                  placeholder="Describe your project in detail. Include requirements, expectations, and any specific technologies you prefer..."
                  rows={6}
                  value={jobData.description}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Budget & Timeline
              </CardTitle>
              <CardDescription>Set your budget and project timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget Type</label>
                <Select value={jobData.budgetType} onValueChange={(value) => setJobData({ ...jobData, budgetType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {jobData.budgetType === 'fixed' ? 'Project Budget' : 'Hourly Rate Range'}
                </label>
                <Input
                  placeholder={jobData.budgetType === 'fixed' ? 'e.g., $3000-5000' : 'e.g., $25-50/hour'}
                  value={jobData.budget}
                  onChange={(e) => setJobData({ ...jobData, budget: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <Select value={jobData.timeline} onValueChange={(value) => setJobData({ ...jobData, timeline: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long should this project take?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Skills & Experience
              </CardTitle>
              <CardDescription>Specify the skills and experience level you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Required Skills</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill (e.g., React, Node.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobData.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <Select value={jobData.experienceLevel} onValueChange={(value) => setJobData({ ...jobData, experienceLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Type</label>
                <Select value={jobData.projectType} onValueChange={(value) => setJobData({ ...jobData, projectType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time project</SelectItem>
                    <SelectItem value="ongoing">Ongoing work</SelectItem>
                    <SelectItem value="contract">Contract to hire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Post</CardTitle>
              <CardDescription>Review your job posting before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{jobData.title}</h3>
                <Badge variant="outline" className="mb-3">{jobData.category}</Badge>
                <p className="text-gray-700 mb-4">{jobData.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong>Budget:</strong> {jobData.budget} ({jobData.budgetType})
                  </div>
                  <div>
                    <strong>Timeline:</strong> {jobData.timeline}
                  </div>
                  <div>
                    <strong>Experience:</strong> {experienceLevels.find(l => l.value === jobData.experienceLevel)?.label}
                  </div>
                  <div>
                    <strong>Type:</strong> {jobData.projectType}
                  </div>
                </div>

                <div>
                  <strong>Required Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobData.skillsRequired.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Bot className="h-5 w-5 text-blue-600 mr-2" />
                  <strong className="text-blue-800">AI Prediction</strong>
                </div>
                <p className="text-blue-700 text-sm">
                  Based on your job requirements, we expect 15-25 qualified freelancers to apply within 24 hours.
                  Your budget range is competitive for this type of work.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/client-dashboard')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Bot className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Post a Job
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= stepNumber 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              Step {step} of 4: {
                step === 1 ? 'Job Details' :
                step === 2 ? 'Budget & Timeline' :
                step === 3 ? 'Skills & Experience' :
                'Review & Post'
              }
            </h2>
          </div>
        </div>

        {/* Form Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              disabled={
                (step === 1 && (!jobData.title || !jobData.category || !jobData.description)) ||
                (step === 2 && (!jobData.budget || !jobData.timeline)) ||
                (step === 3 && (!jobData.experienceLevel || jobData.skillsRequired.length === 0))
              }
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Post Job
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobs;
