'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

type BookingFormProps = {
  teacherId: string;
  hourlyRate?: number;
};

export function BookingForm({ teacherId, hourlyRate }: BookingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('10');
  const [learningGoals, setLearningGoals] = useState('');
  const [isTrialLesson, setIsTrialLesson] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session?.accessToken) {
      setError('Sign in as a parent to request a booking.');
      return;
    }

    const age = Number.parseInt(studentAge, 10);
    if (!bookingDate || !startTime || !endTime || !studentName.trim() || !Number.isFinite(age)) {
      setError('Please fill in date, times, student name, and age.');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(
        ENDPOINTS.bookings.create,
        {
          teacherId,
          bookingDate,
          startTime,
          endTime,
          studentName: studentName.trim(),
          studentAge: age,
          learningGoals: learningGoals.trim() || undefined,
          isTrialLesson,
        },
        session.accessToken,
      );
      setSuccess('Booking requested. The teacher will review and accept before payment.');
      setTimeout(() => router.push('/parent/bookings'), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create booking');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {hourlyRate != null ? (
        <p className="text-sm text-slate-600">
          Rate: <span className="font-semibold text-tutor-green-700">${hourlyRate}/hr</span>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="bookingDate">Lesson date</Label>
          <Input
            id="bookingDate"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="studentAge">Student age</Label>
          <Input
            id="studentAge"
            type="number"
            min={1}
            value={studentAge}
            onChange={(e) => setStudentAge(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="startTime">Start time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="studentName">Student name</Label>
        <Input
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Student full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="learningGoals">Learning goals (optional)</Label>
        <Textarea
          id="learningGoals"
          value={learningGoals}
          onChange={(e) => setLearningGoals(e.target.value)}
          placeholder="What should this lesson focus on?"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isTrialLesson}
          onChange={(e) => setIsTrialLesson(e.target.checked)}
          className="rounded border-gray-300"
        />
        Request as trial lesson
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-tutor-green-700">{success}</p> : null}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? 'Requesting…' : 'Request booking'}
      </Button>
    </form>
  );
}
