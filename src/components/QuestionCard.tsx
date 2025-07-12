import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  answerCount: number;
  voteCount: number;
  timestamp: string;
  author: {
    name: string;
    avatar?: string;
  };
  isAnswered?: boolean;
}

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const questionTime = new Date(timestamp);
    const diffMs = now.getTime() - questionTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="question-card group">
      <Link to={`/question/${question.id}`} className="block">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {question.title}
            </h2>
            {question.isAnswered && (
              <Badge variant="default" className="bg-success text-success-foreground ml-3 shrink-0">
                Answered
              </Badge>
            )}
          </div>

          {/* Description Preview */}
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {question.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{question.voteCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{question.answerCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimestamp(question.timestamp)}</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">{question.author.name}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}