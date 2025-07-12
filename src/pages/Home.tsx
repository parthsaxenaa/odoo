import { useState } from 'react';
import { QuestionCard } from '@/components/QuestionCard';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Filter } from 'lucide-react';

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: "How to implement JWT authentication in React with TypeScript?",
    description: "I'm building a React application with TypeScript and need to implement JWT authentication. What's the best approach for storing tokens securely and handling token refresh?",
    tags: ["react", "typescript", "jwt", "authentication"],
    answerCount: 5,
    voteCount: 23,
    timestamp: "2024-01-15T10:30:00Z",
    author: { name: "Alex Chen" },
    isAnswered: true,
  },
  {
    id: 2,
    title: "MongoDB aggregation pipeline performance optimization",
    description: "My MongoDB aggregation pipeline is running slowly on large datasets. Are there any best practices for optimizing complex aggregation queries?",
    tags: ["mongodb", "database", "performance", "aggregation"],
    answerCount: 3,
    voteCount: 18,
    timestamp: "2024-01-15T09:15:00Z",
    author: { name: "Sarah Kim" },
    isAnswered: false,
  },
  {
    id: 3,
    title: "Best practices for handling async/await errors in Node.js",
    description: "What are the recommended patterns for error handling when using async/await in Node.js applications? Should I use try-catch blocks everywhere?",
    tags: ["node.js", "javascript", "async", "error-handling"],
    answerCount: 8,
    voteCount: 45,
    timestamp: "2024-01-15T08:45:00Z",
    author: { name: "Mike Johnson" },
    isAnswered: true,
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox: When to use which?",
    description: "I'm confused about when to use CSS Grid versus Flexbox. Can someone explain the key differences and provide examples of when each is more appropriate?",
    tags: ["css", "layout", "grid", "flexbox"],
    answerCount: 12,
    voteCount: 67,
    timestamp: "2024-01-14T16:20:00Z",
    author: { name: "Emma Wilson" },
    isAnswered: true,
  },
  {
    id: 5,
    title: "How to optimize React component re-renders?",
    description: "My React app is experiencing performance issues due to unnecessary re-renders. What are the best techniques to prevent this and optimize rendering performance?",
    tags: ["react", "performance", "optimization", "hooks"],
    answerCount: 6,
    voteCount: 34,
    timestamp: "2024-01-14T14:10:00Z",
    author: { name: "David Brown" },
    isAnswered: false,
  },
  {
    id: 6,
    title: "Python data visualization with matplotlib vs plotly",
    description: "I need to create interactive charts for a data analysis project. Should I use matplotlib or plotly? What are the pros and cons of each library?",
    tags: ["python", "matplotlib", "plotly", "data-visualization"],
    answerCount: 4,
    voteCount: 29,
    timestamp: "2024-01-14T12:30:00Z",
    author: { name: "Lisa Garcia" },
    isAnswered: true,
  },
];

export default function Home() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [sortBy, setSortBy] = useState('newest');
  const [showSidebar, setShowSidebar] = useState(true);

  const handleFilterChange = (filters: any) => {
    let filteredQuestions = [...mockQuestions];
    
    // Apply type filter
    if (filters.type === 'unanswered') {
      filteredQuestions = filteredQuestions.filter(q => !q.isAnswered);
    } else if (filters.type === 'trending') {
      filteredQuestions = filteredQuestions.sort((a, b) => b.voteCount - a.voteCount);
    }
    
    // Apply tag filter
    if (filters.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        filters.tags.some((tag: string) => q.tags.includes(tag))
      );
    }
    
    setQuestions(filteredQuestions);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    let sortedQuestions = [...questions];
    
    switch (sortType) {
      case 'newest':
        sortedQuestions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'votes':
        sortedQuestions.sort((a, b) => b.voteCount - a.voteCount);
        break;
      case 'answers':
        sortedQuestions.sort((a, b) => b.answerCount - a.answerCount);
        break;
    }
    
    setQuestions(sortedQuestions);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          {showSidebar && (
            <div className="hidden lg:block">
              <Sidebar onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">All Questions</h1>
                <p className="text-muted-foreground">
                  {questions.length} questions found
                </p>
              </div>
              
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden mt-4 sm:mt-0"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
              <div className="flex space-x-2">
                {[
                  { id: 'newest', label: 'Newest', icon: Clock },
                  { id: 'votes', label: 'Most Votes', icon: TrendingUp },
                  { id: 'answers', label: 'Most Answers', icon: Clock },
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={sortBy === id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort(id)}
                    className="flex items-center space-x-1"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <div key={question.id} className="animate-fade-in">
                    <QuestionCard question={question} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No questions found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or ask a new question!
                  </p>
                </div>
              )}
            </div>

            {/* Pagination placeholder */}
            {questions.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSidebar(false)}>
            <div className="fixed right-0 top-0 h-full w-80 bg-background p-6 overflow-y-auto">
              <Sidebar onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}