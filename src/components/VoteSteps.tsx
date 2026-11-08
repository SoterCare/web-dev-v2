'use client';

import { useEffect, useState } from 'react';
import { Check, ExternalLink, Heart, Lock, PartyPopper, UserPlus } from 'lucide-react';

const PAGE_URL = 'https://www.facebook.com/imhackx';
const VIDEO_URL = 'https://www.facebook.com/reel/1705984630946731';
const STORAGE_KEY = 'votehackx-progress';

type Done = { follow: boolean; like: boolean };
const EMPTY: Done = { follow: false, like: false };

export default function VoteSteps() {
  const [done, setDone] = useState<Done>(EMPTY);
  // A step is "opened" once its button was clicked; only then is the confirm button offered.
  const [opened, setOpened] = useState<Done>(EMPTY);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDone({ ...EMPTY, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const update = (next: Done) => {
    setDone(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const allDone = done.follow && done.like;
  const activeStep = !done.follow ? 1 : !done.like ? 2 : 3;

  return (
    <section className="flex flex-col items-center text-center gap-5 pb-4">
      <span className="bg-bg-card px-6 py-2.5 rounded-[2rem] shadow-m text-xs sm:text-sm font-bold text-text-muted">
        hackX 11.0 · Most Popular Team
      </span>
      <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl font-bold text-text leading-tight">
        Vote for <span className="text-[#3d7e93]">SoterCare</span>
      </h1>
      <p className="max-w-xl text-base md:text-lg text-text-muted leading-relaxed">
        Voting is now open! We are one of the 15 finalist teams of hackX 11.0. Two quick steps and
        you&apos;re backing us for Most Popular Team.
      </p>

      <div className="w-full max-w-md mt-2" role="progressbar" aria-valuemin={0} aria-valuemax={2} aria-valuenow={Number(done.follow) + Number(done.like)}>
        <div className="flex justify-between text-xs font-semibold text-text-muted mb-2">
          <span>Step {Math.min(activeStep, 2)} of 2</span>
          <span>{allDone ? 'All done' : 'Takes about 30 seconds'}</span>
        </div>
        <div className="h-2 rounded-full bg-bg-panel overflow-hidden">
          <div
            className="h-full rounded-full bg-[#3d7e93] transition-all duration-500"
            style={{ width: `${((Number(done.follow) + Number(done.like)) / 2) * 100}%` }}
          />
        </div>
      </div>

      <ol className="w-full flex flex-col gap-3 sm:gap-4 mt-2 text-left">
        <StepCard
          n={1}
          title="Follow hackX on Facebook"
          desc="Head to the official hackX page and hit Follow."
          Icon={UserPlus}
          state={done.follow ? 'done' : activeStep === 1 ? 'active' : 'locked'}
          actionLabel="Open hackX page"
          href={PAGE_URL}
          opened={opened.follow}
          onOpen={() => setOpened((o) => ({ ...o, follow: true }))}
          confirmLabel="I've followed the page"
          onConfirm={() => update({ ...done, follow: true })}
        />
        <StepCard
          n={2}
          title="Cast your vote"
          desc="Watch our video and tap the like button to back SoterCare."
          Icon={Heart}
          state={done.like ? 'done' : activeStep === 2 ? 'active' : 'locked'}
          actionLabel="Open our video"
          href={VIDEO_URL}
          opened={opened.like}
          onOpen={() => setOpened((o) => ({ ...o, like: true }))}
          confirmLabel="I've liked the video"
          onConfirm={() => update({ ...done, like: true })}
        />
      </ol>

      {allDone && (
        <div className="w-full mt-2 bg-bg-card rounded-3xl shadow-m border border-black/5 p-8 flex flex-col items-center gap-3">
          <PartyPopper className="text-[#3d7e93]" size={36} />
          <h2 className="text-2xl md:text-3xl font-bold text-text">Thank you for your support!</h2>
          <p className="text-text-muted max-w-md">
            You&apos;re officially part of the SoterCare cheering squad. Share this page with a
            friend and help us reach the top.
          </p>
          <button
            type="button"
            onClick={() => {
              update(EMPTY);
              setOpened(EMPTY);
            }}
            className="mt-3 w-full sm:w-auto rounded-2xl bg-bg-panel border border-black/10 px-8 py-4 text-base font-semibold text-text active:scale-[0.98] hover:bg-[#a0cbdb]/30 transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </section>
  );
}

function StepCard({
  n,
  title,
  desc,
  Icon,
  state,
  actionLabel,
  href,
  opened,
  onOpen,
  confirmLabel,
  onConfirm,
}: {
  n: number;
  title: string;
  desc: string;
  Icon: React.ElementType;
  state: 'locked' | 'active' | 'done';
  actionLabel: string;
  href: string;
  opened: boolean;
  onOpen: () => void;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  const active = state === 'active';
  return (
    <li
      className={`rounded-3xl border p-4 sm:p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 ${
        active
          ? 'bg-bg-card shadow-m border-[#3d7e93]/30'
          : state === 'done'
            ? 'bg-bg-card/70 border-black/5'
            : 'bg-bg-card/50 border-black/5 opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold ${
            state === 'done' ? 'bg-[#3d7e93] text-white' : 'bg-bg-panel text-[#3d7e93]'
          }`}
        >
          {state === 'done' ? <Check size={20} /> : state === 'locked' ? <Lock size={18} /> : n}
        </span>
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-bold text-text flex items-center gap-2">
            <Icon size={18} className="text-[#3d7e93]" /> {title}
          </h2>
          <p className="text-sm text-text-muted mt-1">{desc}</p>
        </div>
      </div>

      {active && (
        <div className="flex flex-col sm:flex-row gap-3 sm:pl-[3.75rem] [&>*]:w-full sm:[&>*]:w-auto">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpen}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3d7e93] text-white font-semibold px-6 py-4 text-base active:scale-[0.98] hover:bg-[#356f82] transition-colors"
          >
            {actionLabel} <ExternalLink size={16} />
          </a>
          {opened && (
            <button
              autoFocus
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-bg-panel text-text font-semibold px-6 py-4 text-base active:scale-[0.98] hover:bg-[#a0cbdb]/30 border border-black/10 transition-colors"
            >
              <Check size={16} /> {confirmLabel}
            </button>
          )}
        </div>
      )}
    </li>
  );
}
