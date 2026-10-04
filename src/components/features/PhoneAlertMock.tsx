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
        className="mb-2.5 rounded-2xl border-l-4 border-[#4FE0C8] bg-bg-card p-3 shadow-m"
      >
        <span data-alert-title className="block text-xs font-bold text-text">
          Indrani, Resident 12
        </span>
        <span data-alert-text className="mt-0.5 block text-xs leading-snug text-text-muted">
          Trying to stand up. Please go and help.
        </span>
        <div className="mt-2.5 flex gap-2">
          <span
            data-alert-confirm
            className="rounded-full bg-[#4FE0C8] px-3 py-1 text-[10px] font-bold text-[#04332C]"
          >
            Confirm
          </span>
          <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold text-text-muted">
            Dismiss
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-bg-card/70 p-3">
        <span className="block text-xs font-bold text-text">Kamala, Resident 1</span>
        <span className="mt-0.5 block text-xs text-text-muted">Moisture, attended 8 min ago</span>
      </div>
    </div>
  </div>
);

export default PhoneAlertMock;
