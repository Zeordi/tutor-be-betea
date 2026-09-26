"use client";

import React from "react";
import { useTheme } from "@tutor/ui";
import { Button } from "@tutor/ui";
import { Input } from "@tutor/ui";
import { Badge } from "@tutor/ui";
import { Avatar } from "@tutor/ui";
import { Card } from "@tutor/ui";
import { Tabs } from "@tutor/ui";
import { AppBar } from "@tutor/ui";
import { Select } from "@tutor/ui";
import { Skeleton } from "@tutor/ui";
import { EmptyState } from "@tutor/ui";
import { Banner } from "@tutor/ui";
import { Toast } from "@tutor/ui";
import { SosButton } from "@tutor/ui";
import { GeofenceMarker } from "@tutor/ui";
import { ConnectsWidget } from "@tutor/ui";
import { EscrowStatusPill, EscrowStatusPillsRow } from "@tutor/ui";
import { MilestoneTimeline } from "@tutor/ui";
import { TrustBadges } from "@tutor/ui";
import { PackagePricingCard } from "@tutor/ui";
import { AIScorecard } from "@tutor/ui";
import { colors, spacing, radius, shadows, typography, grid } from "@tutor/ui";

const swatch = (name: string, hex: string) => (
  <div key={name} className="flex items-center gap-3">
    <span className="h-8 w-8 shrink-0 rounded-lg border border-[var(--border)]" style={{ background: hex }} />
    <div className="min-w-0">
      <p className="text-xs font-semibold text-[var(--foreground)]">{name}</p>
      <p className="text-[10px] text-[var(--muted-foreground)]">{hex}</p>
    </div>
  </div>
);

export default function DesignSystemPage() {
  const { mode, toggleTheme, colors: themeColors } = useTheme();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--foreground)]">Design System</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Tutor Be Betea — Figma v5.1 tokens & components</p>
        </div>
        <Button variant="secondary" onClick={toggleTheme}>
          {mode === "light" ? "🌙 Dark" : "☀️ Light"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Colors</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Light</p>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(colors.light).map(([k, v]) => swatch(k, v))}
              </div>
            </Card>
            <Card>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Dark</p>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(colors.dark).map(([k, v]) => swatch(k, v))}
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Typography</h2>
          <Card>
            <div className="space-y-4">
              {Object.entries(typography.roles).map(([role, style]) => (
                <div key={role} className="flex items-baseline justify-between border-b border-[var(--border)] pb-3 last:border-0">
                  <span style={{ fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight }} className="text-[var(--foreground)]">
                    {role.charAt(0).toUpperCase() + role.slice(1)} — The quick brown fox
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">{style.fontSize} / {style.fontWeight}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Spacing</h2>
          <div className="flex flex-wrap items-end gap-4">
            {Object.entries(spacing).map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-2">
                <div className="rounded bg-[var(--primary-light)] dark:bg-[var(--primary-light)]/40" style={{ width: v, height: v }} />
                <span className="text-[10px] text-[var(--muted-foreground)]">{k}:{v}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Radius</h2>
          <div className="flex flex-wrap items-end gap-4">
            {Object.entries(radius).map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-2">
                <div className="bg-[var(--primary-light)] dark:bg-[var(--primary-light)]/40" style={{ width: 48, height: 48, borderRadius: k === "full" ? "50%" : v }} />
                <span className="text-[10px] text-[var(--muted-foreground)]">{k}:{v}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Shadows</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(shadows).map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6" style={{ boxShadow: v }}>
                <p className="text-xs font-bold text-[var(--foreground)]">{k}</p>
                <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{v}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Grid</h2>
          <Card>
            <p className="text-sm text-[var(--secondary)]">Mobile: {grid.mobile} columns · Desktop: {grid.desktop} columns</p>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Buttons & Inputs</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </Card>
            <Card>
              <div className="space-y-3">
                <Input label="Name" placeholder="Enter name" />
                <Input label="Email" placeholder="you@example.com" error="Invalid email" />
                <Input label="Phone" placeholder="+251..." hint="Include country code" />
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Select & Tabs</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <Select label="Subject" placeholder="Choose…" options={[
                { value: "math", label: "Mathematics" },
                { value: "phys", label: "Physics" },
                { value: "chem", label: "Chemistry" },
              ]} />
            </Card>
            <Card>
              <Tabs tabs={["Overview", "Sessions", "Progress"]} activeIndex={0} onChange={() => {}} />
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">App Bar & Badges</h2>
          <div className="space-y-4">
            <AppBar variant="back-title" title="Tutor Profile" subtitle="Verified · 4.9" onBack={() => {}} />
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="gold">Gold</Badge>
              <Badge variant="elite">Elite</Badge>
              <Badge variant="verified">Verified</Badge>
              <Badge variant="urgent">Urgent</Badge>
              <Badge variant="boost">Boost</Badge>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Cards</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PackagePricingCard
              plan="Basic"
              price={1200}
              sessions={8}
              perSession={150}
              features={["1 subject", "Weekly report", "Chat support"]}
              tutorName="Hana Bekele"
              tutorLocation="Bole"
              currency="ETB"
            />
            <PackagePricingCard
              plan="Premium"
              price={4500}
              sessions={24}
              perSession={187}
              features={["3 subjects", "Daily report", "Priority support", "Geofence check-ins"]}
              tutorName="Hana Bekele"
              tutorLocation="Bole"
              popular
              currency="ETB"
            />
            <AIScorecard
              student="Hana Bekele"
              grade="Grade 10"
              subject="Mathematics"
              mastery={85}
              attendance={92}
              readiness={78}
              aiSummary="Strong in algebra; improve geometry proofs before the national exam."
              trend="up"
              examDate="Mar 15"
            />
            <Card>
              <TrustBadges nationalId degreeVerified gold elite />
              <div className="mt-3">
                <Avatar name="Hana Bekele" size="lg" verified />
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Connects, Geofence, SOS</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ConnectsWidget balance={12} tier="Standard" onBuy={() => {}} />
            <GeofenceMarker status="inside" location="Bole" tutorName="Hana Bekele" />
            <SosButton state="idle" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Escrow</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <EscrowStatusPillsRow />
            </Card>
            <Card>
              <MilestoneTimeline milestones={[
                { id: "1", label: "Milestone 1", amount: "1,200 ETB", status: "done", date: "Aug 10" },
                { id: "2", label: "Milestone 2", amount: "1,800 ETB", status: "current", date: "Aug 24" },
                { id: "3", label: "Milestone 3", amount: "1,500 ETB", status: "upcoming", date: "Sep 07" },
              ]} />
            </Card>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Empty, Skeleton, Banner, Toast</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <EmptyState icon="📭" title="No jobs yet" description="Check back later for new opportunities" actionLabel="Browse" onAction={() => {}} />
              <EmptyState icon="💬" title="No messages" description="Start a conversation with a tutor" />
            </div>
            <Card>
              <SkeletonList rows={3} />
            </Card>
            <div className="md:col-span-2 space-y-2">
              <Banner variant="info" title="System update" description="Scheduled maintenance at 02:00 UTC" actionLabel="Learn more" onAction={() => {}} />
              <Banner variant="warning" title="Low connects" description="You have 2 connects left" />
              <Banner variant="error" title="Payment failed" description="Please update your payment method" />
            </div>
            <div className="md:col-span-2">
              <Toast tone="success" title="Payment released" subtitle="1,200 ETB sent to tutor" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
