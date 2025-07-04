import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createMilestone, getProjectMilestones, updateMilestone, ProjectMilestone } from '@/hooks/useEnhancedSupabase';

interface ProjectMilestonesProps {
  projectId: string;
  isOwner: boolean;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({ projectId, isOwner }) => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: '',
    due_date: ''
  });

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    setLoading(true);
    const { data, error } = await getProjectMilestones(projectId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load milestones",
        variant: "destructive"
      });
    } else {
      setMilestones(data || []);
    }
    setLoading(false);
  };

  const handleCreateMilestone = async () => {
    if (!newMilestone.title.trim()) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive"
      });
      return;
    }

    const milestoneData = {
      project_id: projectId,
      title: newMilestone.title,
      description: newMilestone.description,
      amount: newMilestone.amount ? parseFloat(newMilestone.amount) : undefined,
      due_date: newMilestone.due_date || undefined,
      status: 'pending' as const
    };

    const { data, error } = await createMilestone(milestoneData);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Milestone created successfully"
      });
      setMilestones([...milestones, data]);
      setNewMilestone({ title: '', description: '', amount: '', due_date: '' });
      setIsDialogOpen(false);
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, status: string) => {
    const updates: Partial<ProjectMilestone> = { 
      status: status as ProjectMilestone['status']
    };
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await updateMilestone(milestoneId, updates);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Milestone marked as ${status}`
      });
      loadMilestones();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'disputed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    return (completed / milestones.length) * 100;
  };

  const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const completedAmount = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.amount || 0), 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Project Milestones
            </CardTitle>
            <CardDescription>
              Track project progress with milestone-based payments
            </CardDescription>
          </div>
          {isOwner && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Milestone</DialogTitle>
                  <DialogDescription>
                    Add a milestone to track project progress and payments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      placeholder="e.g., Complete wireframes"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      placeholder="Describe what needs to be completed for this milestone"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount ($)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newMilestone.amount}
                        onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <Input
                        type="date"
                        value={newMilestone.due_date}
                        onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateMilestone}>
                      Create Milestone
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {milestones.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(calculateProgress())}% Complete
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2 mb-4" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                <span>Completed: ${completedAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                <span>Total: ${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No milestones created yet</p>
              {isOwner && (
                <p className="text-sm">Add milestones to track project progress</p>
              )}
            </div>
          ) : (
            milestones.map((milestone, index) => (
              <div key={milestone.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(milestone.status)}
                    <h4 className="font-semibold ml-2">{milestone.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status.replace('_', ' ')}
                    </Badge>
                    {milestone.amount && (
                      <Badge variant="outline">
                        ${milestone.amount.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {milestone.description && (
                  <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {milestone.due_date && (
                      <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {isOwner && milestone.status !== 'completed' && (
                    <div className="space-x-2">
                      {milestone.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateMilestoneStatus(milestone.id, 'in_progress')}
                        >
                          Start
                        </Button>
                      )}
                      {milestone.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateMilestoneStatus(milestone.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMilestones;