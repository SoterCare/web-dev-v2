// Decorative preview of a caregiver's phone. Names are made up.
const PhoneAlertMock = () => (
  <div
    aria-hidden="true"
    className="mx-auto w-[220px] rounded-[2rem] border-[6px] border-[#dfe6e9] bg-bg-body shadow-xl"
  >
    <div className="px-3 pb-4 pt-4">
      <div className="mb-3 text-[10px] font-bold text-text-muted">Alerts</div>

      <div
        data-alert-notice
        className="mb-2.5 rounded-2xl border-l-4 border-[#e08a2e] bg-bg-card p-3 shadow-m"
      >
        <span className="block text-xs font-bold text-text">Indrani, Resident 12</span>
        <span className="mt-0.5 block text-xs text-text-muted">Stand-up attempt, just now</span>
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
        <span className="block text-xs font-bold text-text">Malini, Resident 4</span>
        <span className="mt-0.5 block text-xs text-text-muted">Moisture, handled 8 min ago</span>
      </div>
    </div>
  </div>
);

export default PhoneAlertMock;
