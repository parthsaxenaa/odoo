import { useState } from 'react';
import { Filter, Tag, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  onFilterChange: (filters: any) => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filterOptions = [
    { id: 'all', label: 'All Questions', icon: MessageSquare },
    { id: 'unanswered', label: 'Unanswered', icon: CheckCircle },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  const popularTags = [
    'javascript', 'react', 'python', 'node.js', 'css', 'html',
    'typescript', 'mongodb', 'express', 'api', 'database', 'auth'
  ];

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    onFilterChange({ type: filterId, tags: selectedTags });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onFilterChange({ type: selectedFilter, tags: newTags });
  };

  return (
    <div className="w-64 bg-card border border-border rounded-xl p-6 h-fit sticky top-20">
      <div className="space-y-6">
        {/* Filter Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Filter</h3>
          </div>
          
          <div className="space-y-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.id}
                  variant={selectedFilter === option.id ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFilterSelect(option.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Tags Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Popular Tags</h3>
          </div>
          
          <div className="space-y-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`tag-pill w-full text-left ${
                  selectedTags.includes(tag) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                #{tag}
                {selectedTags.includes(tag) && (
                  <span className="ml-1 text-xs">×</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-hero p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Community Stats</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>1,234 Questions</div>
            <div>567 Answered</div>
            <div>89 Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}