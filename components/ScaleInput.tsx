export function ScaleInput({ label, value, min = 1, max = 5, lowLabel = "Low", highLabel = "High", onChange }: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`min-h-11 rounded-xl border text-sm font-black ${value === option ? "border-tcps-maroon bg-tcps-maroon text-white" : "border-black/15 bg-white"}`} aria-pressed={value === option}>
            {option}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-black/50"><span>{lowLabel}</span><span>{highLabel}</span></div>
    </fieldset>
  );
}
