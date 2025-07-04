
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Search, Bot, User, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const userType = localStorage.getItem('freelancerBotUser') || 'freelancer';

  const conversations = [
    {
      id: 1,
      name: userType === 'freelancer' ? 'TechCorp Inc.' : 'Sarah Chen',
      role: userType === 'freelancer' ? 'Client' : 'Full-Stack Developer',
      avatar: '/placeholder.svg',
      lastMessage: 'The project looks great! When can we start?',
      time: '2 min ago',
      unread: 2,
      online: true,
      project: 'E-commerce Website Development'
    },
    {
      id: 2,
      name: userType === 'freelancer' ? 'StartupXYZ' : 'Mike Johnson',
      role: userType === 'freelancer' ? 'Client' : 'UI/UX Designer',
      avatar: '/placeholder.svg',
      lastMessage: 'I have some questions about the timeline',
      time: '1 hour ago',
      unread: 0,
      online: false,
      project: 'Mobile App UI/UX Design'
    },
    {
      id: 3,
      name: userType === 'freelancer' ? 'DevBlog Media' : 'Alex Rivera',
      role: userType === 'freelancer' ? 'Client' : 'Mobile Developer',
      avatar: '/placeholder.svg',
      lastMessage: 'Thanks for the update!',
      time: '3 hours ago',
      unread: 1,
      online: true,
      project: 'Technical Blog Writing'
    },
    {
      id: 4,
      name: 'FreelanceBot Assistant',
      role: 'AI Assistant',
      avatar: '/placeholder.svg',
      lastMessage: 'I can help you with project questions anytime!',
      time: '1 day ago',
      unread: 0,
      online: true,
      project: 'Support & Assistance'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: userType === 'freelancer' ? 'TechCorp Inc.' : 'Sarah Chen',
      content: 'Hi! I reviewed your proposal and I\'m impressed with your portfolio.',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thank you! I\'m excited about this project. When would be a good time to discuss the requirements in detail?',
      time: '10:32 AM',
      isMe: true
    },
    {
      id: 3,
      sender: userType === 'freelancer' ? 'TechCorp Inc.' : 'Sarah Chen',
      content: 'How about we schedule a call for tomorrow at 2 PM? I can share more details about the project scope.',
      time: '10:35 AM',
      isMe: false
    },
    {
      id: 4,
      sender: 'You',
      content: 'Perfect! I\'ll send you a calendar invite. Also, I have some initial questions about the tech stack preferences.',
      time: '10:36 AM',
      isMe: true
    },
    {
      id: 5,
      sender: userType === 'freelancer' ? 'TechCorp Inc.' : 'Sarah Chen',
      content: 'The project looks great! When can we start?',
      time: '10:45 AM',
      isMe: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <MessageSquare className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Conversations List */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedChat === index 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedChat(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.name === 'FreelanceBot Assistant' ? (
                            <Bot className="h-6 w-6" />
                          ) : (
                            conversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="px-1 py-0 text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conversation.role}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-blue-600 mt-1 truncate">{conversation.project}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={filteredConversations[selectedChat]?.avatar} />
                <AvatarFallback>
                  {filteredConversations[selectedChat]?.name === 'FreelanceBot Assistant' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    filteredConversations[selectedChat]?.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{filteredConversations[selectedChat]?.name}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">{filteredConversations[selectedChat]?.role}</p>
                  {filteredConversations[selectedChat]?.online && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      Online
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {filteredConversations[selectedChat]?.project}
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isMe 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${
                        message.isMe ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Bot Integration Notice */}
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center text-sm text-blue-700">
                <Bot className="h-4 w-4 mr-2" />
                <span>FreelanceBot is monitoring this conversation and can assist with project questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
