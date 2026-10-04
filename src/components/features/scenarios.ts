import gsap from 'gsap';

// Sample residents shared by the ward screen and the AI watching graphic. Names are made up.
export const RESIDENTS = [
  { name: 'Kamala', status: 'Resting' },
  { name: 'Nimal', status: 'Walking' },
  { name: 'Sunil', status: 'Resting' },
  { name: 'Malini', status: 'Sitting' },
  { name: 'Ranjith', status: 'Resting' },
  { name: 'Chandra', status: 'Sitting' },
  { name: 'Piyal', status: 'Resting' },
  { name: 'Sita', status: 'Offline' },
  { name: 'Gamini', status: 'Walking' },
  { name: 'Latha', status: 'Resting' },
  { name: 'Somapala', status: 'Sitting' },
  { name: 'Indrani', status: 'Resting' },
] as const;

interface Palette {
  solid: string; // dots, borders, buttons
  tint: string; // fills
  text: string; // readable text on the tint
  button: string; // label colour on a solid button
}

// One colour per kind of alert.
export const PALETTES = {
  standup: { solid: '#4FE0C8', tint: 'rgba(79,224,200,0.28)', text: '#0B6B5D', button: '#04332C' },
  fall: { solid: '#F05B6E', tint: 'rgba(240,91,110,0.16)', text: '#B42A3E', button: '#FFFFFF' },
  moisture: { solid: '#7CC4D6', tint: '#C4EBF0', text: '#1F5F73', button: '#10404F' },
  checkup: { solid: '#F5A04A', tint: 'rgba(245,160,74,0.22)', text: '#8A4A0A', button: '#3D2000' },
} satisfies Record<string, Palette>;

export interface Scenario {
  kind: keyof typeof PALETTES;
  resident: number; // index into RESIDENTS
  wardStatus: string; // shown on the ward screen while it is happening
  chip: string; // shown on the AI watching card
  alertText: string; // the caregiver's alert
  record: string; // the line added to the resident record
  type: string; // short alert type shown once the alert is collapsed
  ago: string; // how long ago, shown once the alert is collapsed
  time: string;
  start: number; // seconds into the loop when the AI spots it
  attendedAt?: number; // quick alerts: someone confirms right away
  // Alerts nobody attends at first: they repeat until someone taps On my way, then stay active
  // until someone marks them resolved.
  onWayAt?: number;
  resolvedAt?: number;
  chipOnResolve?: boolean; // default true; false when another alert owns the chip at that time
}

// Listed oldest to newest. Alerts and records are never removed: each new one pushes the
// older ones further down, like a feed.
export const SCENARIOS: Scenario[] = [
  {
    kind: 'standup',
    resident: 11,
    wardStatus: 'Standing up',
    chip: 'Stand-up detected',
    alertText: 'Trying to stand up. Please go and help.',
    record: 'Stand-up attempt, Indrani',
    type: 'Stand-up',
    ago: '14 min ago',
    time: 'Tue 02:14',
    start: 1,
    attendedAt: 4.2,
  },
  {
    kind: 'checkup',
    resident: 4,
    wardStatus: 'High temp',
    chip: 'High temperature',
    alertText: 'Temperature is above normal. Please go and check.',
    record: 'High temperature, Ranjith',
    type: 'High temperature',
    ago: '9 min ago',
    time: 'Tue 03:40',
    start: 6.5,
    onWayAt: 12.1,
    resolvedAt: 20.5,
    chipOnResolve: false,
  },
  {
    kind: 'moisture',
    resident: 9,
    wardStatus: 'Moisture',
    chip: 'Moisture detected',
    alertText: 'Moisture detected. Please check and change.',
    record: 'Moisture event, Latha',
    type: 'Moisture',
    ago: '5 min ago',
    time: 'Tue 05:10',
    start: 13.6,
    attendedAt: 16.7,
  },
  {
    kind: 'fall',
    resident: 6,
    wardStatus: 'Fall',
    chip: 'Fall detected',
    alertText: 'A fall was detected. Please go immediately.',
    record: 'Fall detected, Piyal',
    type: 'Fall',
    ago: '2 min ago',
    time: 'Tue 06:25',
    start: 19,
    onWayAt: 24.6,
    resolvedAt: 28,
  },
];

const LOOP_END = 31;

// Success green for confirmations, and the site blues for the resting state.
const GREEN_TEXT = '#14532d';
const BLUE = '#3d7e93';
const BLUE_TILE = 'rgba(61,126,147,0.08)';
const BLUE_DOT = 'rgba(160,203,219,0.35)';
const WAVE = '#a0cbdb';

const find = (root: HTMLElement, selector: string) =>
  root.querySelector<HTMLElement>(selector);

interface Parts {
  sc: Scenario;
  card: HTMLElement;
  body: HTMLElement;
  full: HTMLElement;
  mini: HTMLElement;
  count: HTMLElement;
  actions: HTMLElement;
  confirm: HTMLElement;
  status: HTMLElement;
  statusText: HTMLElement;
  resolve: HTMLElement;
  rec: HTMLElement;
  tile: HTMLElement;
  tileStatus: HTMLElement;
  tileDot: HTMLElement;
  circle: HTMLElement;
}

function collect(root: HTMLElement): Parts[] | null {
  const out: Parts[] = [];
  for (let i = 0; i < SCENARIOS.length; i++) {
    const sc = SCENARIOS[i];
    const card = find(root, `[data-feed-card="${i}"]`);
    const rec = find(root, `[data-rec="${i}"]`);
    const tile = find(root, `[data-res="${sc.resident}"]`);
    const circle = find(root, `[data-dot="${sc.resident}"]`);
    if (!card || !rec || !tile || !circle) return null;
    const body = find(card, '[data-card-body]');
    const full = find(card, '[data-card-full]');
    const mini = find(card, '[data-card-mini]');
    const count = find(card, '[data-card-count]');
    const actions = find(card, '[data-card-actions]');
    const confirm = find(card, '[data-card-confirm]');
    const status = find(card, '[data-card-status]');
    const statusText = find(card, '[data-card-status-text]');
    const resolve = find(card, '[data-card-resolve]');
    const tileStatus = find(tile, '[data-res-status]');
    const tileDot = find(tile, '[data-res-dot]');
    if (
      !body || !full || !mini || !count || !actions || !confirm || !status || !statusText || !resolve ||
      !tileStatus || !tileDot
    ) {
      return null;
    }
    out.push({
      sc, card, body, full, mini, count, actions, confirm, status, statusText, resolve, rec,
      tile, tileStatus, tileDot, circle,
    });
  }
  return out;
}

// A looping timeline that plays the scenarios across the ward screen, the AI watching graphic,
// the caregiver's phone feed and the resident record. Returns null if markup is missing.
export function buildCareCircleTimeline(root: HTMLElement): gsap.core.Timeline | null {
  const chip = find(root, '[data-watch-chip]');
  const feed = find(root, '[data-feed]');
  const records = find(root, '[data-records]');
  const list = collect(root);
  if (!chip || !feed || !records || !list) return null;

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  gsap.set(chip, { autoAlpha: 0, y: 10 });

  // Everything starts collapsed: each alert and record grows in at the top of its list.
  list.forEach((p) => {
    gsap.set([p.card, p.rec], { display: 'block', height: 0 });
    gsap.set(p.rec, { autoAlpha: 0 });
  });

  // The single watching circle: it sits over a resident, giving off a wave, and moves on to the
  // next resident once it has finished with an alert.
  const watcher = find(root, '[data-watcher]');
  const watcherWave = find(root, '[data-watcher-wave]');
  const watcherRing = find(root, '[data-watcher-ring]');
  if (!watcher || !watcherWave || !watcherRing) return null;
  const placeOn = (circle: HTMLElement) => ({ x: circle.offsetLeft, y: circle.offsetTop });
  const first = list[0].circle;
  gsap.set(watcher, {
    display: 'block',
    width: first.offsetWidth,
    height: first.offsetHeight,
    ...placeOn(list[list.length - 1].circle),
  });
  gsap.set(watcher, { ...placeOn(first) });

  list.forEach((p, idx) => {
    const { sc } = p;
    const c = PALETTES[sc.kind];
    const baseStatus = p.tileStatus.textContent ?? '';

    const flag = (t: number) => {
      tl.to(p.circle, { backgroundColor: c.tint, color: c.text, scale: 1.12, duration: 0.4 }, t)
        .to(watcherWave, { backgroundColor: c.solid, duration: 0.2 }, t)
        .to(watcherRing, { borderColor: c.solid, duration: 0.2 }, t)
        .to(p.tile, { backgroundColor: c.tint, duration: 0.4 }, t)
        .to(p.tileStatus, { color: c.text, duration: 0.4 }, t)
        .to(p.tileDot, { backgroundColor: c.solid, duration: 0.4 }, t)
        .add(() => {
          p.tileStatus.textContent = sc.wardStatus;
        }, t);
    };
    const calm = (t: number) => {
      tl.to(p.circle, { backgroundColor: BLUE_DOT, color: BLUE, scale: 1, duration: 0.5 }, t)
        .to(p.tile, { backgroundColor: BLUE_TILE, duration: 0.5 }, t)
        .to(p.tileStatus, { color: BLUE, duration: 0.5 }, t)
        .to(p.tileDot, { backgroundColor: BLUE, duration: 0.5 }, t)
        .add(() => {
          p.tileStatus.textContent = baseStatus;
        }, t + 0.2);
    };
    const showChip = (t: number, text: string, color: string) => {
      tl.add(() => {
        chip.textContent = text;
      }, t).to(chip, { autoAlpha: 1, y: 0, color, duration: 0.3 }, t);
    };
    const hideChip = (t: number) => {
      tl.to(chip, { autoAlpha: 0, y: 10, duration: 0.4 }, t);
    };
    // A completed alert shrinks to a compact capsule: resident, alert type and how long ago.
    // It keeps its colour tag and stays in the feed.
    const collapse = (t: number) => {
      tl.to(p.full, { autoAlpha: 0, duration: 0.25 }, t).add(() => {
        const from = p.body.offsetHeight;
        p.full.style.display = 'none';
        p.mini.style.display = 'block';
        gsap.set(p.mini, { autoAlpha: 0 });
        const to = p.body.offsetHeight;
        gsap.fromTo(p.body, { height: from }, { height: to, duration: 0.5, ease: 'power2.inOut' });
        gsap.to(p.mini, { autoAlpha: 1, duration: 0.4, delay: 0.2 });
      }, t + 0.3);
    };
    const watcherCalm = (t: number) => {
      tl.to(watcherWave, { backgroundColor: WAVE, duration: 0.5 }, t).to(
        watcherRing,
        { borderColor: 'rgba(61,126,147,0.6)', duration: 0.5 },
        t,
      );
    };
    const travelTo = (circle: HTMLElement, t: number) => {
      tl.to(
        watcher,
        { x: () => circle.offsetLeft, y: () => circle.offsetTop, duration: 0.9, ease: 'power2.inOut' },
        t,
      );
    };
    const tap = (el: HTMLElement, t: number) => {
      tl.to(el, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, t);
    };

    // The repeat counter starts blank on every pass of the loop.
    tl.add(() => {
      p.count.textContent = '';
      gsap.set(p.body, { clearProps: 'height' });
      p.full.style.display = '';
      p.mini.style.display = 'none';
    }, Math.max(0, sc.start - 0.01));

    // The watching circle travels here, then starts its wave on this resident.
    if (idx === 0) travelTo(p.circle, 0);
    // 1. The AI spots it: the resident's circle, the ward tile and the chip all react.
    flag(sc.start);
    showChip(sc.start, sc.chip, c.text);

    // 2. The caregiver is alerted at the top of the feed, and the record gains a line.
    tl.to(p.card, { height: 'auto', duration: 0.55, ease: 'power3.out' }, sc.start + 0.9).to(
      p.rec,
      { height: 'auto', autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
      sc.start + 1.6,
    );

    let watchDone = sc.start;
    if (sc.onWayAt !== undefined && sc.resolvedAt !== undefined) {
      // Nobody attends: the alert repeats, a little louder each time.
      [2.4, 3.9].forEach((offset, k) => {
        const t = sc.start + offset;
        tl.add(() => {
          p.count.textContent = `Alert ${k + 2}`;
          chip.textContent = 'Alert again';
        }, t)
          .to(p.body, { keyframes: { x: [0, -5, 5, -4, 4, 0] }, duration: 0.45 }, t)
          .to(p.tile, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1 }, t);
      });

      // Someone taps On my way: the alert stays in the feed, still active.
      tap(p.confirm, sc.onWayAt - 0.2);
      tl.set(p.actions, { display: 'none' }, sc.onWayAt)
        .set(p.status, { display: 'flex' }, sc.onWayAt)
        .add(() => {
          p.statusText.textContent = 'On my way';
        }, sc.onWayAt);
      showChip(sc.onWayAt, 'On the way', GREEN_TEXT);
      // The watching circle has done its part and moves on; the alert stays active below.
      watchDone = sc.onWayAt + 0.3;
      watcherCalm(watchDone);

      // Later, someone marks it resolved. Only then does it settle back.
      tap(p.resolve, sc.resolvedAt - 0.2);
      tl.set(p.resolve, { display: 'none' }, sc.resolvedAt).add(() => {
        p.statusText.textContent = 'Resolved';
      }, sc.resolvedAt);
      if (sc.chipOnResolve !== false) {
        showChip(sc.resolvedAt, 'Attended', GREEN_TEXT);
        hideChip(sc.resolvedAt + 1.5);
      }
      calm(sc.resolvedAt + 0.6);
      collapse(sc.resolvedAt + 1.1);
    } else if (sc.attendedAt !== undefined) {
      // 3. The caregiver confirms, and everything settles back. The alert stays in the feed.
      tap(p.confirm, sc.attendedAt);
      tl.set(p.actions, { display: 'none' }, sc.attendedAt + 0.2)
        .set(p.status, { display: 'flex' }, sc.attendedAt + 0.2)
        .set(p.resolve, { display: 'none' }, sc.attendedAt + 0.2)
        .add(() => {
          p.statusText.textContent = 'Attended';
        }, sc.attendedAt + 0.2);
      showChip(sc.attendedAt + 0.3, 'Attended', GREEN_TEXT);
      hideChip(sc.attendedAt + 1.8);
      calm(sc.attendedAt + 1.1);
      watchDone = sc.attendedAt + 1.1;
      watcherCalm(watchDone);
      collapse(sc.attendedAt + 1.2);
    }

    // After finishing, the watching circle moves on to the next resident.
    const next = list[idx + 1];
    if (next) travelTo(next.circle, watchDone + 0.1);
  });

  // Fade the lists out just before the loop restarts, so the reset is not seen.
  tl.to([feed, records], { autoAlpha: 0, duration: 0.5 }, LOOP_END - 0.6).to(
    {},
    { duration: 0.1 },
    LOOP_END,
  );

  return tl;
}
