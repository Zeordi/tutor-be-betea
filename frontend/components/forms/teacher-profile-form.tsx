'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function TeacherProfileForm() {
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [subjects, setSubjects] = useState('');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        console.info({ bio, hourlyRate, subjects });
      }}
    >
      <div>
        <Label htmlFor="subjects">Subjects</Label>
        <Input id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="Math, Physics" />
      </div>
      <div>
        <Label htmlFor="rate">Hourly rate</Label>
        <Input id="rate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <Button type="submit">Save profile</Button>
    </form>
  );
}
