'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PARENT' });
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await apiClient.post(ENDPOINTS.auth.register, form);
    setMessage('Check your email to verify your account.');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="font-display text-2xl">Create account</h1>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">I am a</Label>
        <Select id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="PARENT">Parent</option>
          <option value="TEACHER">Teacher</option>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Register
      </Button>
      {message && <p className="text-sm text-brand-700">{message}</p>}
    </form>
  );
}
