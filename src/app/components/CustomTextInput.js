export default function CustomTextInput({ customText, setCustomText }) {
  return (
    <div className="flex-1 flex flex-col gap-y-2">
      <label className="text-xs text-neutral-500 uppercase font-black tracking-wider leading-none">Text</label>
      <input
        type="text"
        value={customText}
        onChange={e => setCustomText(e.target.value)}
        maxLength={40}
        className="h-8 border border-neutral-300 rounded px-3 py-2 w-full text-base outline-none focus-visible:ring focus-visible:ring-black focus-visible:border-black transition-all"
      />
    </div>
  );
}
