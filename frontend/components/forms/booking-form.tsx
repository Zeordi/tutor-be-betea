'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function BookingForm({ teacherId }: { teacherId: string }) {
  const [notes, setNotes] = useState('');
  const [startsAt, setStartsAt] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wired to bookings API in later iterations
    console.info('book', { teacherId, startsAt, notes });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="startsAt">Session start</Label>
        <Input id="startsAt" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button type="submit">Request booking</Button>
    </form>
  );
}
