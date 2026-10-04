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
    wardStatus: 'High temperature',
    chip: 'High temperature',
    alertText: 'Temperature is above normal. Please go and check.',
    record: 'High temperature, Ranjith',
    time: 'Tue 03:40',
  },
  {
    kind: 'moisture',
    resident: 9,
    wardStatus: 'Moisture detected',
    chip: 'Moisture detected',
    alertText: 'Moisture detected. Please check and change.',
    record: 'Moisture event, Latha',
    time: 'Tue 05:10',
  },
  {
    kind: 'fall',
    resident: 6,
    wardStatus: 'Fall detected',
    chip: 'Fall detected',
    alertText: 'A fall was detected. Please go immediately.',
    record: 'Fall detected, Piyal',
    time: 'Tue 06:25',
  },
];

// Success green for confirmations, and the site blues for the resting state.
const GREEN_TINT = 'rgba(103,217,116,0.28)';
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
  const confirm = find(root, '[data-alert-confirm]');
  const record = find(root, '[data-record-new]');
  const recordTime = find(root, '[data-record-time]');
  const recordText = find(root, '[data-record-text]');
  const chip = find(root, '[data-watch-chip]');
  if (!notice || !title || !text || !confirm || !record || !recordTime || !recordText || !chip) {
    return null;
  }

  gsap.set([notice, record, chip], { autoAlpha: 0, y: 10 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  SCENARIOS.forEach((sc, i) => {
    const tile = find(root, `[data-res="${sc.resident}"]`);
    const tileStatus = tile && find(tile, '[data-res-status]');
    const tileDot = tile && find(tile, '[data-res-dot]');
    const circle = find(root, `[data-dot="${sc.resident}"]`);
    const wave = circle && find(circle, '[data-dot-wave]');
    if (!tile || !tileStatus || !tileDot || !circle || !wave) return;

    const c = PALETTES[sc.kind];
    const baseStatus = tileStatus.textContent ?? '';
    const label = `s${i}`;
    tl.addLabel(label);

    // 1. The AI spots it: the resident's circle, the ward tile and the chip all react.
    tl.add(() => {
      title.textContent = `${RESIDENTS[sc.resident].name}, Resident ${sc.resident + 1}`;
      text.textContent = sc.alertText;
      confirm.textContent = 'Confirm';
      recordTime.textContent = sc.time;
      recordText.textContent = sc.record;
      chip.textContent = sc.chip;
      tileStatus.textContent = sc.wardStatus;
    }, label)
      .to(circle, { backgroundColor: c.tint, color: c.text, scale: 1.12, duration: 0.4 }, label)
      .to(wave, { backgroundColor: c.solid }, label)
      .to(chip, { autoAlpha: 1, y: 0, backgroundColor: c.tint, color: c.text, duration: 0.4 }, label)
      .to(tile, { backgroundColor: c.tint, duration: 0.4 }, label)
      .to(tileStatus, { color: c.text, duration: 0.4 }, label)
      .to(tileDot, { backgroundColor: c.solid, duration: 0.4 }, label)
      // 2. The caregiver is alerted and the record gains a line.
      .set(notice, { borderLeftColor: c.solid }, `${label}+=0.8`)
      .set(confirm, { backgroundColor: c.solid, color: c.button }, `${label}+=0.8`)
      .to(notice, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, `${label}+=0.9`)
      .to(record, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, `${label}+=1.6`)
      // 3. The caregiver confirms, and everything settles back.
      .to(confirm, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, `${label}+=3.2`)
      .add(() => {
        confirm.textContent = 'On my way';
        chip.textContent = 'Attended';
      }, `${label}+=3.3`)
      .to(chip, { backgroundColor: GREEN_TINT, color: GREEN_TEXT, duration: 0.3 }, `${label}+=3.3`)
      .to(circle, { backgroundColor: BLUE_DOT, color: BLUE, scale: 1, duration: 0.5 }, `${label}+=4.3`)
      .to(wave, { backgroundColor: WAVE, duration: 0.5 }, `${label}+=4.3`)
      .to(tile, { backgroundColor: BLUE_TILE, duration: 0.5 }, `${label}+=4.3`)
      .to(tileStatus, { color: BLUE, duration: 0.5 }, `${label}+=4.3`)
      .to(tileDot, { backgroundColor: BLUE, duration: 0.5 }, `${label}+=4.3`)
      .add(() => {
        tileStatus.textContent = baseStatus;
      }, `${label}+=4.5`)
      .to([notice, record, chip], { autoAlpha: 0, y: 10, duration: 0.4 }, `${label}+=4.8`)
      .to({}, { duration: 0.6 }, `${label}+=5.2`);
  });

  return tl;
}
