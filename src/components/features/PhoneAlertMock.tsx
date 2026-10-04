// Decorative sample of a caregiver's phone. Not real residents.
const PhoneAlertMock = () => (
  <div
    aria-hidden="true"
    className="mx-auto w-[220px] rounded-[2rem] bg-text p-2 shadow-xl"
  >
    <div className="rounded-[1.6rem] bg-bg-body px-3 pb-4 pt-5">
      <div className="mb-3 flex items-center justify-between text-[10px] font-semibold text-text-muted">
        <span>Alerts</span>
        <span>Sample view</span>
      </div>

      <div
        data-alert-notice
        className="mb-2.5 rounded-2xl border-l-4 border-[#e08a2e] bg-bg-card p-3 shadow-m"
      >
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-text">Room 12</span>
          <span className="text-[10px] text-text-muted">Just now</span>
        </div>
        <span className="mt-0.5 block text-xs text-text-muted">Stand-up attempt</span>
        <div className="mt-2.5 flex gap-2">
          <span className="rounded-full bg-[#3d7e93] px-3 py-1 text-[10px] font-bold text-white">
            Confirm
          </span>
          <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold text-text-muted">
            Dismiss
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-bg-card/70 p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-text">Room 4</span>
          <span className="text-[10px] text-text-muted">8 min ago</span>
        </div>
        <span className="mt-0.5 block text-xs text-text-muted">Moisture, handled</span>
      </div>
    </div>
  </div>
);

export default PhoneAlertMock;
