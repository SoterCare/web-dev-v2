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
  solid: string; // dots, borders
  tint: string; // fills
  text: string; // readable text on the tint
  button: string; // label colour on a solid button
}

// One colour per kind of alert.
const PALETTES = {
  standup: { solid: '#4FE0C8', tint: 'rgba(79,224,200,0.28)', text: '#0B6B5D', button: '#04332C' },
  fall: { solid: '#F05B6E', tint: 'rgba(240,91,110,0.16)', text: '#B42A3E', button: '#FFFFFF' },
  moisture: { solid: '#7CC4D6', tint: '#C4EBF0', text: '#1F5F73', button: '#10404F' },
  checkup: { solid: '#F5A04A', tint: 'rgba(245,160,74,0.22)', text: '#8A4A0A', button: '#3D2000' },
} satisfies Record<string, Palette>;

interface Scenario {
  kind: keyof typeof PALETTES;
  resident: number; // index into RESIDENTS
  wardStatus: string; // shown on the ward screen while it is happening
  chip: string; // shown on the AI watching card
  alertText: string; // the caregiver's alert
  record: string; // the line added to the resident record
  time: string;
  // Nobody attends right away: the alert repeats until someone taps On my way, then it
  // stays active below until someone marks it resolved.
  escalates?: boolean;
}

const SCENARIOS: Scenario[] = [
  {
    kind: 'standup',
    resident: 11,
    wardStatus: 'Standing up',
    chip: 'Stand-up detected',
    alertText: 'Trying to stand up. Please go and help.',
    record: 'Stand-up attempt, Indrani',
    time: 'Tue 02:14',
  },
  {
    kind: 'checkup',
    resident: 4,
    wardStatus: 'High temp',
    chip: 'High temperature',
    alertText: 'Temperature is above normal. Please go and check.',
    record: 'High temperature, Ranjith',
    time: 'Tue 03:40',
    escalates: true,
  },
  {
    kind: 'moisture',
    resident: 9,
    wardStatus: 'Moisture',
    chip: 'Moisture detected',
    alertText: 'Moisture detected. Please check and change.',
    record: 'Moisture event, Latha',
    time: 'Tue 05:10',
  },
  {
    kind: 'fall',
    resident: 6,
    wardStatus: 'Fall',
    chip: 'Fall detected',
    alertText: 'A fall was detected. Please go immediately.',
    record: 'Fall detected, Piyal',
    time: 'Tue 06:25',
    escalates: true,
  },
];

// Success green for confirmations, and the site blues for the resting state.
const GREEN_TEXT = '#14532d';
const BLUE = '#3d7e93';
const BLUE_TILE = 'rgba(61,126,147,0.08)';
const BLUE_DOT = 'rgba(160,203,219,0.35)';
const WAVE = '#a0cbdb';

const find = (root: HTMLElement, selector: string) =>
  root.querySelector<HTMLElement>(selector);

// A looping timeline that plays each scenario in turn across the ward screen, the AI watching
// graphic, the caregiver's phone and the resident record. Returns null if markup is missing.
export function buildCareCircleTimeline(root: HTMLElement): gsap.core.Timeline | null {
  const notice = find(root, '[data-alert-notice]');
  const title = find(root, '[data-alert-title]');
  const text = find(root, '[data-alert-text]');
  const count = find(root, '[data-alert-count]');
  const confirm = find(root, '[data-alert-confirm]');
  const active = find(root, '[data-active-card]');
  const activeBody = find(root, '[data-active-body]');
  const activeTitle = find(root, '[data-active-title]');
  const activeText = find(root, '[data-active-text]');
  const activeDone = find(root, '[data-active-done]');
  const record = find(root, '[data-record-new]');
  const recordTime = find(root, '[data-record-time]');
  const recordText = find(root, '[data-record-text]');
  const chip = find(root, '[data-watch-chip]');
  if (
    !notice || !title || !text || !count || !confirm || !active || !activeBody || !activeTitle || !activeText ||
    !activeDone || !record || !recordTime || !recordText || !chip
  ) {
    return null;
  }

  gsap.set([notice, record, chip], { autoAlpha: 0, y: 10 });
  gsap.set(active, { height: 0 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  SCENARIOS.forEach((sc, i) => {
    const tile = find(root, `[data-res="${sc.resident}"]`);
    const tileStatus = tile && find(tile, '[data-res-status]');
    const tileDot = tile && find(tile, '[data-res-dot]');
    const circle = find(root, `[data-dot="${sc.resident}"]`);
    const wave = circle && find(circle, '[data-dot-wave]');
    if (!tile || !tileStatus || !tileDot || !circle || !wave) return;

    const c = PALETTES[sc.kind];
    const name = `${RESIDENTS[sc.resident].name}, Resident ${sc.resident + 1}`;
    const baseStatus = tileStatus.textContent ?? '';
    const label = `s${i}`;
    const at = (t: number) => `${label}+=${t}`;
    tl.addLabel(label);

    // 1. The AI spots it: the resident's circle, the ward tile and the chip all react.
    tl.add(() => {
      title.textContent = name;
      text.textContent = sc.alertText;
      count.textContent = '';
      confirm.textContent = 'Confirm';
      recordTime.textContent = sc.time;
      recordText.textContent = sc.record;
      chip.textContent = sc.chip;
      tileStatus.textContent = sc.wardStatus;
    }, label)
      .to(circle, { backgroundColor: c.tint, color: c.text, scale: 1.12, duration: 0.4 }, label)
      .to(wave, { backgroundColor: c.solid }, label)
      .to(chip, { autoAlpha: 1, y: 0, color: c.text, duration: 0.4 }, label)
      .to(tile, { backgroundColor: c.tint, duration: 0.4 }, label)
      .to(tileStatus, { color: c.text, duration: 0.4 }, label)
      .to(tileDot, { backgroundColor: c.solid, duration: 0.4 }, label)
      // 2. The caregiver is alerted and the record gains a line.
      .set(notice, { borderLeftColor: c.solid }, at(0.8))
      .set([confirm, activeDone], { backgroundColor: c.solid, color: c.button }, at(0.8))
      .set(activeBody, { borderLeftColor: c.solid }, at(0.8))
      .to(notice, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, at(0.9))
      .to(record, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, at(1.6));

    let end: number;

    if (sc.escalates) {
      // Nobody attends: the alert repeats, a little louder each time.
      [2.4, 3.9].forEach((t, k) => {
        tl.add(() => {
          count.textContent = `Alert ${k + 2}`;
          chip.textContent = 'Alert again';
        }, at(t))
          .to(notice, { keyframes: { x: [0, -5, 5, -4, 4, 0] }, duration: 0.45 }, at(t))
          .to(tile, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1 }, at(t));
      });

      // Someone taps On my way: the alert slides down into the active list, pushing the
      // older alert further down, and stays there.
      tl.to(confirm, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, at(5.6))
        .add(() => {
          activeTitle.textContent = name;
          activeText.textContent = 'On my way';
          chip.textContent = 'On the way';
        }, at(5.8))
        .to(chip, { color: GREEN_TEXT, duration: 0.3 }, at(5.8))
        .to(notice, { autoAlpha: 0, y: 24, duration: 0.45, ease: 'power2.in' }, at(5.8))
        .to(active, { height: 'auto', duration: 0.55, ease: 'power3.out' }, at(5.9))
        // It stays active until someone confirms it is resolved.
        .to(activeDone, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, at(8.6))
        .add(() => {
          chip.textContent = 'Attended';
        }, at(8.8))
        .to(active, { height: 0, duration: 0.5, ease: 'power2.inOut' }, at(8.9));
      end = 9.2;
    } else {
      // 3. The caregiver confirms, and everything settles back.
      tl.to(confirm, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, at(3.2))
        .add(() => {
          confirm.textContent = 'On my way';
          chip.textContent = 'Attended';
        }, at(3.3))
        .to(chip, { color: GREEN_TEXT, duration: 0.3 }, at(3.3));
      end = 4.3;
    }

    tl.to(circle, { backgroundColor: BLUE_DOT, color: BLUE, scale: 1, duration: 0.5 }, at(end))
      .to(wave, { backgroundColor: WAVE, duration: 0.5 }, at(end))
      .to(tile, { backgroundColor: BLUE_TILE, duration: 0.5 }, at(end))
      .to(tileStatus, { color: BLUE, duration: 0.5 }, at(end))
      .to(tileDot, { backgroundColor: BLUE, duration: 0.5 }, at(end))
      .add(() => {
        tileStatus.textContent = baseStatus;
      }, at(end + 0.2))
      .to([notice, record, chip], { autoAlpha: 0, y: 10, duration: 0.4 }, at(end + 0.5))
      .to({}, { duration: 0.6 }, at(end + 0.9));
  });

  return tl;
}
