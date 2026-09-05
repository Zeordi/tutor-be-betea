import React from "react";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { TrustBadges } from "../TrustBadges";

export interface TutorCardProps {
  name: string;
  subjects: string[];
  rating: number;
  reviews: number;
  rate: number;
  location: string;
  avatar?: string;
  nationalId?: boolean;
  degreeVerified?: boolean;
  gold?: boolean;
  elite?: boolean;
  online?: boolean;
  distance?: string;
  compact?: boolean;
  onClick?: () => void;
  onBook?: () => void;
  onViewProfile?: () => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TutorCard({
  name,
  subjects,
  rating,
  reviews,
  rate,
  location,
  avatar,
  nationalId,
  degreeVerified,
  gold,
  elite,
  online,
  distance,
  compact,
  onClick,
  onBook,
  onViewProfile,
}: TutorCardProps) {
  if (compact) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/80"
      >
        <div className="flex gap-3">
          <Avatar name={name} src={avatar} size="md" status={online ? "online" : "offline"} verified={nationalId} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{name}</p>
              <span className="whitespace-nowrap text-sm font-bold text-teal-600">{rate} ETB/hr</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1">
              <Stars rating={rating} />
              <span className="text-[11px] text-slate-500">({reviews})</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <TrustBadges nationalId={nationalId} degreeVerified={degreeVerified} gold={gold} elite={elite} compact />
            </div>
            <p className="mt-1 truncate text-[11px] text-slate-400">
              📍 {location} {distance && `· ${distance}`}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {subjects.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/80"
    >
      <div className="flex gap-4">
        <Avatar name={name} src={avatar} size="lg" status={online ? "online" : "offline"} verified={nationalId} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <Stars rating={rating} />
                <span className="text-xs text-slate-500">
                  {rating} ({reviews} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-teal-600">
                {rate}
                <span className="text-xs font-normal text-slate-400"> ETB/hr</span>
              </p>
              {distance && <p className="text-xs text-slate-400">📍 {distance}</p>}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <TrustBadges nationalId={nationalId} degreeVerified={degreeVerified} gold={gold} elite={elite} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {subjects.map((s) => (
          <span
            key={s}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onBook?.();
          }}
        >
          Book Session
        </Button>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.();
          }}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}

export default TutorCard;