import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Clock, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { startTimeTracking, stopTimeTracking, getTimeTrackingForProject, TimeTracking } from '@/hooks/useEnhancedSupabase';

interface TimeTrackerProps {
  projectId: string;
  freelancerId: string;
  hourlyRate?: number;
  isFreelancer: boolean;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ 
  projectId, 
  freelancerId, 
  hourlyRate = 0, 
  isFreelancer 
}) => {
  const [timeEntries, setTimeEntries] = useState<TimeTracking[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeTracking | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeEntries();
  }, [projectId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeEntry) {
      interval = setInterval(() => {
        const startTime = new Date(activeEntry.start_time).getTime();
        const now = new Date().getTime();
        setCurrentTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeEntry]);

  const loadTimeEntries = async () => {
    setLoading(true);
    const { data, error } = await getTimeTrackingForProject(projectId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load time entries",
        variant: "destructive"
      });
    } else {
      const entries = data || [];
      setTimeEntries(entries);
      
      // Check for active entry
      const active = entries.find(entry => !entry.end_time && entry.freelancer_id === freelancerId);
      if (active) {
        setActiveEntry(active);
        const startTime = new Date(active.start_time).getTime();
        const now = new Date().getTime();
        setCurrentTime(Math.floor((now - startTime) / 1000));
      }
    }
    setLoading(false);
  };

  const handleStartTimer = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for this time entry",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await startTimeTracking(projectId, freelancerId, description);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to start timer",
        variant: "destructive"
      });
    } else {
      setActiveEntry(data);
      setCurrentTime(0);
      toast({
        title: "Timer Started",
        description: "Time tracking has begun"
      });
    }
  };

  const handleStopTimer = async () => {
    if (!activeEntry) return;

    const { data, error } = await stopTimeTracking(activeEntry.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to stop timer",
        variant: "destructive"
      });
    } else {
      setActiveEntry(null);
      setCurrentTime(0);
      setDescription('');
      loadTimeEntries();
      toast({
        title: "Timer Stopped",
        description: "Time entry saved successfully"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateEarnings = (minutes: number, rate: number) => {
    return ((minutes / 60) * rate).toFixed(2);
  };

  const totalMinutes = timeEntries
    .filter(entry => entry.freelancer_id === freelancerId && entry.duration_minutes)
    .reduce((sum, entry) => sum + (entry.duration_minutes || 0), 0);

  const totalEarnings = totalMinutes && hourlyRate ? (totalMinutes / 60) * hourlyRate : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Time Tracking
        </CardTitle>
        <CardDescription>
          Track time spent on this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current Timer */}
        {isFreelancer && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-mono font-bold">
                {formatTime(currentTime)}
              </div>
              <div className="space-x-2">
                {!activeEntry ? (
                  <Button onClick={handleStartTimer} disabled={!description.trim()}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                ) : (
                  <Button onClick={handleStopTimer} variant="destructive">
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Timer
                  </Button>
                )}
              </div>
            </div>
            
            {!activeEntry && (
              <Input
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2"
              />
            )}
            
            {activeEntry && (
              <div className="text-sm text-gray-600">
                Working on: {activeEntry.description}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatDuration(totalMinutes)}
            </div>
            <div className="text-sm text-blue-600">Total Time</div>
          </div>
          {hourlyRate > 0 && (
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${totalEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-green-600">Total Earnings</div>
            </div>
          )}
        </div>

        {/* Time Entries */}
        <div className="space-y-3">
          <h4 className="font-semibold">Time Entries</h4>
          {timeEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No time entries yet</p>
              {isFreelancer && (
                <p className="text-sm">Start tracking time to see entries here</p>
              )}
            </div>
          ) : (
            timeEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{entry.description}</div>
                  <div className="flex items-center space-x-2">
                    {entry.duration_minutes && (
                      <Badge variant="outline">
                        {formatDuration(entry.duration_minutes)}
                      </Badge>
                    )}
                    {entry.hourly_rate && entry.duration_minutes && (
                      <Badge className="bg-green-100 text-green-800">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {calculateEarnings(entry.duration_minutes, entry.hourly_rate)}
                      </Badge>
                    )}
                    {!entry.end_time && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div>Started: {new Date(entry.start_time).toLocaleString()}</div>
                  {entry.end_time && (
                    <div>Ended: {new Date(entry.end_time).toLocaleString()}</div>
                  )}
                  {!isFreelancer && (
                    <div>Freelancer: {(entry as any).freelancer?.full_name}</div>
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

export default TimeTracker;