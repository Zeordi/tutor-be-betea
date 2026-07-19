'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function VerificationForm() {
  const [fileName, setFileName] = useState('');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        console.info('verification upload', fileName);
      }}
    >
      <div>
        <Label htmlFor="doc">ID or credential document</Label>
        <Input
          id="doc"
          type="file"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
        />
      </div>
      <Button type="submit">Submit for review</Button>
    </form>
  );
}
