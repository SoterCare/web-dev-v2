// Decorative radar: slow rings around a steady centre.
const WatchdogRadar = () => (
  <div aria-hidden="true" className="relative mx-auto flex h-40 w-40 items-center justify-center">
    <span className="absolute h-full w-full rounded-full border border-white/20" />
    <span className="absolute h-3/4 w-3/4 rounded-full border border-white/20" />
    <span className="absolute h-1/2 w-1/2 rounded-full border border-white/25" />
    <span className="absolute h-1/2 w-1/2 animate-ping rounded-full bg-[#a0cbdb]/30 [animation-duration:3.2s] motion-reduce:animate-none" />
    <span className="relative h-4 w-4 rounded-full bg-[#a0cbdb]" />
  </div>
);

export default WatchdogRadar;
