import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, HelpCircle, Lightbulb, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const popularTags = [
    'javascript', 'react', 'python', 'node.js', 'css', 'html',
    'typescript', 'mongodb', 'express', 'api', 'database', 'auth'
  ];

  const questionTips = [
    'Be specific and clear in your title',
    'Provide context and what you\'ve tried',
    'Include relevant code snippets',
    'Add appropriate tags to help others find your question',
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag.toLowerCase()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Add Tags",
        description: "Please add at least one tag to help categorize your question.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Question Posted!",
      description: "Your question has been posted successfully.",
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ask a New Question</h1>
          <p className="text-muted-foreground">
            Get help from the community by asking a detailed question
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Question Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., How to implement authentication in React?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg p-4 h-auto"
                />
                <p className="text-sm text-muted-foreground">
                  Be specific and imagine you're asking a question to another person
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Question Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your question. Include what you've tried, what didn't work, and what you're expecting to happen..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[200px] p-4 text-base"
                />
                <p className="text-sm text-muted-foreground">
                  Include all information someone would need to answer your question
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Tags * (up to 5)
                </Label>
                
                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center space-x-1 px-3 py-1"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Tag Input */}
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(currentTag);
                      }
                    }}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddTag(currentTag)}
                    disabled={!currentTag || tags.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Popular Tags */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Popular tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        disabled={tags.includes(tag) || tags.length >= 5}
                        className={`tag-pill text-xs ${
                          tags.includes(tag) 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-primary hover:text-primary-foreground'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-8 py-3 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Posting Question...
                    </>
                  ) : (
                    'Post Your Question'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="h-5 w-5 text-warning" />
                <h3 className="font-semibold text-foreground">Writing Tips</h3>
              </div>
              <ul className="space-y-3">
                {questionTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guidelines Card */}
            <div className="bg-gradient-hero border border-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Community Guidelines</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Be respectful and constructive</p>
                <p>• Search for existing answers first</p>
                <p>• Provide minimal, reproducible examples</p>
                <p>• Accept helpful answers to help others</p>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Question Preview</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Title:</p>
                  <p className="text-sm font-medium text-foreground">
                    {title || 'Your question title will appear here...'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tags:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <span key={tag} className="tag-pill text-xs">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No tags added yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}