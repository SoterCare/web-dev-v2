// Decorative preview of a caregiver's phone. Names are made up.
// New alerts land in the top slot. Once someone taps On my way, the alert slides down into the
// active list, pushing the older alert along, and stays there until it is marked resolved.
const PhoneAlertMock = () => (
  <div
    aria-hidden="true"
    className="mx-auto w-[220px] rounded-[2rem] border-[6px] border-[#dfe6e9] bg-bg-body shadow-xl"
  >
    <div className="h-[330px] overflow-hidden px-3 pb-4 pt-4">
      <div className="mb-3 text-[10px] font-bold text-text-muted">Alerts</div>

      <div
        data-alert-notice
        className="mb-2.5 rounded-2xl border-l-4 border-[#4FE0C8] bg-bg-card p-3 shadow-m"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span data-alert-title className="block text-xs font-bold text-text">
            Indrani, Resident 12
          </span>
          <span data-alert-count className="shrink-0 text-[10px] font-bold text-text-muted" />
        </div>
        <span data-alert-text className="mt-0.5 block text-xs leading-snug text-text-muted">
          Trying to stand up. Please go and help.
        </span>
        <div className="mt-2.5 flex gap-2">
          <span
            data-alert-confirm
            className="inline-flex h-6 items-center justify-center rounded-full bg-[#4FE0C8] px-3 text-[10px] font-bold leading-none text-[#04332C]"
          >
            Confirm
          </span>
          <span className="inline-flex h-6 items-center justify-center rounded-full bg-black/5 px-3 text-[10px] font-bold leading-none text-text-muted">
            Dismiss
          </span>
        </div>
      </div>

      {/* Active alert: collapsed until an alert is claimed. */}
      <div data-active-card className="h-0 overflow-hidden">
        <div data-active-body className="mb-2.5 rounded-2xl border-l-4 border-[#4FE0C8] bg-bg-card p-3 shadow-m">
          <span data-active-title className="block text-xs font-bold text-text">
            Indrani, Resident 12
          </span>
          <span data-active-text className="mt-0.5 block text-xs leading-snug text-text-muted">
            On my way
          </span>
          <div className="mt-2.5">
            <span
              data-active-done
              className="inline-flex h-6 items-center justify-center rounded-full bg-[#4FE0C8] px-3 text-[10px] font-bold leading-none text-[#04332C]"
            >
              Mark resolved
            </span>
          </div>
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
