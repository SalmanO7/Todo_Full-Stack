import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FilterIcon, ArrowUpDownIcon } from 'lucide-react';

interface FilterBarProps {
  statusFilter: 'all' | 'pending' | 'completed';
  sortFilter: 'created' | 'title';
  onStatusChange: (status: 'all' | 'pending' | 'completed') => void;
  onSortChange: (sort: 'created' | 'title') => void;
}

export function FilterBar({ statusFilter, sortFilter, onStatusChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'completed') => onStatusChange(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Sort:</span>
        <Select value={sortFilter} onValueChange={(value: 'created' | 'title') => onSortChange(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">By Date</SelectItem>
            <SelectItem value="title">By Title</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}