'use client';

import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function Filters({
  subject,
  onSubjectChange,
}: {
  subject: string;
  onSubjectChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="subject">Subject</Label>
      <Select id="subject" value={subject} onChange={(e) => onSubjectChange(e.target.value)}>
        <option value="">All subjects</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="english">English</option>
      </Select>
    </div>
  );
}
