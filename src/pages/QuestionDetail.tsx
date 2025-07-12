import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageSquare, Clock, User, Check, Flag, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Mock data for question detail
const mockQuestion = {
  id: 1,
  title: "How to implement JWT authentication in React with TypeScript?",
  description: `I'm building a React application with TypeScript and need to implement JWT authentication. What's the best approach for storing tokens securely and handling token refresh?

Here's what I've tried so far:

\`\`\`typescript
// Login function
const login = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
};
\`\`\`

However, I'm concerned about storing the token in localStorage due to XSS vulnerabilities. What would be a more secure approach?

I also need to handle token refresh automatically. Any suggestions on implementing this pattern?`,
  tags: ["react", "typescript", "jwt", "authentication"],
  voteCount: 23,
  timestamp: "2024-01-15T10:30:00Z",
  author: { name: "Alex Chen", reputation: 1250 },
  isAsked: true,
};

const mockAnswers = [
  {
    id: 1,
    content: `Great question! You're right to be concerned about localStorage and XSS attacks. Here's a more secure approach:

## Secure Token Storage

Instead of localStorage, consider using **httpOnly cookies** for storing JWTs:

\`\`\`typescript
// Set httpOnly cookie on login (server-side)
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15 minutes
});
\`\`\`

## Token Refresh Pattern

For automatic token refresh, implement an axios interceptor:

\`\`\`typescript
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await axios.post('/api/refresh');
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
\`\`\`

This approach provides better security while maintaining a smooth user experience.`,
    voteCount: 15,
    timestamp: "2024-01-15T11:45:00Z",
    author: { name: "Sarah Kim", reputation: 3450 },
    isAccepted: true,
  },
  {
    id: 2,
    content: `Another approach is to use a combination of access tokens and refresh tokens:

1. **Short-lived access token** (15 minutes) stored in memory
2. **Long-lived refresh token** stored in httpOnly cookie
3. **Silent refresh** using a hidden iframe

Here's a React hook implementation:

\`\`\`typescript
export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch('/api/refresh', {
          credentials: 'include'
        });
        const data = await response.json();
        setToken(data.accessToken);
      } catch (error) {
        setToken(null);
      }
    };
    
    refreshToken();
    const interval = setInterval(refreshToken, 14 * 60 * 1000); // Refresh every 14 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  return { token, setToken };
};
\`\`\`

This provides excellent security while maintaining user experience.`,
    voteCount: 8,
    timestamp: "2024-01-15T13:20:00Z",
    author: { name: "Mike Johnson", reputation: 2100 },
    isAccepted: false,
  },
];

export default function QuestionDetail() {
  const { id } = useParams();
  const [question] = useState(mockQuestion);
  const [answers, setAnswers] = useState(mockAnswers);
  const [newAnswer, setNewAnswer] = useState('');
  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});

  const handleVote = (type: 'up' | 'down', targetType: 'question' | 'answer', targetId: number) => {
    const key = `${targetType}-${targetId}`;
    const currentVote = userVotes[key];
    
    if (currentVote === type) {
      // Remove vote
      setUserVotes(prev => ({ ...prev, [key]: null }));
      toast({
        title: "Vote removed",
        description: `Your ${type}vote has been removed.`,
      });
    } else {
      // Add or change vote
      setUserVotes(prev => ({ ...prev, [key]: type }));
      toast({
        title: "Vote recorded",
        description: `You ${type}voted this ${targetType}.`,
      });
    }
  };

  const handleAcceptAnswer = (answerId: number) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId ? !answer.isAccepted : false
    })));
    
    toast({
      title: "Answer accepted!",
      description: "This answer has been marked as the solution.",
    });
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;
    
    const answer = {
      id: answers.length + 1,
      content: newAnswer,
      voteCount: 0,
      timestamp: new Date().toISOString(),
      author: { name: "You", reputation: 500 },
      isAccepted: false,
    };
    
    setAnswers([...answers, answer]);
    setNewAnswer('');
    
    toast({
      title: "Answer posted!",
      description: "Your answer has been posted successfully.",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          {/* Question Header */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Vote Section */}
            <div className="flex lg:flex-col items-center lg:items-start space-x-4 lg:space-x-0 lg:space-y-2">
              <div className="vote-button">
                <button
                  onClick={() => handleVote('up', 'question', question.id)}
                  className={`p-2 rounded-full transition-colors ${
                    userVotes[`question-${question.id}`] === 'up'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <ChevronUp className="h-6 w-6" />
                </button>
                <span className="text-lg font-semibold text-center min-w-[2rem]">
                  {question.voteCount}
                </span>
                <button
                  onClick={() => handleVote('down', 'question', question.id)}
                  className={`p-2 rounded-full transition-colors ${
                    userVotes[`question-${question.id}`] === 'down'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {question.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Asked {formatTimestamp(question.timestamp)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{answers.length} answers</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {question.description}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{question.author.name}</p>
                    <p className="text-xs text-muted-foreground">{question.author.reputation} reputation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>

          {answers.map((answer) => (
            <div
              key={answer.id}
              className={`bg-card border border-border rounded-xl p-6 ${
                answer.isAccepted ? 'accepted-answer' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Vote Section */}
                <div className="flex lg:flex-col items-center lg:items-start space-x-4 lg:space-x-0 lg:space-y-2">
                  <div className="vote-button">
                    <button
                      onClick={() => handleVote('up', 'answer', answer.id)}
                      className={`p-2 rounded-full transition-colors ${
                        userVotes[`answer-${answer.id}`] === 'up'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <ChevronUp className="h-6 w-6" />
                    </button>
                    <span className="text-lg font-semibold text-center min-w-[2rem]">
                      {answer.voteCount}
                    </span>
                    <button
                      onClick={() => handleVote('down', 'answer', answer.id)}
                      className={`p-2 rounded-full transition-colors ${
                        userVotes[`answer-${answer.id}`] === 'down'
                          ? 'bg-destructive text-destructive-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <ChevronDown className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {question.isAsked && (
                    <Button
                      variant={answer.isAccepted ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAcceptAnswer(answer.id)}
                      className={answer.isAccepted ? "bg-success hover:bg-success/90" : ""}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Answer Content */}
                <div className="flex-1">
                  {answer.isAccepted && (
                    <Badge className="mb-4 bg-success text-success-foreground">
                      <Check className="h-3 w-3 mr-1" />
                      Accepted Answer
                    </Badge>
                  )}
                  
                  <div className="prose prose-sm max-w-none mb-6">
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {answer.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Answered {formatTimestamp(answer.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{answer.author.name}</p>
                        <p className="text-xs text-muted-foreground">{answer.author.reputation} reputation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answer Form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Answer</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your answer here... Use markdown for code formatting."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-[200px] p-4"
            />
            <Button
              onClick={handleSubmitAnswer}
              disabled={!newAnswer.trim()}
              className="btn-primary"
            >
              Post Your Answer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}