export default function CustomTextInput({ customText, setCustomText }) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <label className="mb-2 font-medium">Add custom text for your strip:</label>
      <input
        type="text"
        value={customText}
        onChange={e => setCustomText(e.target.value)}
        maxLength={40}
        placeholder="Type your message here"
        className="border rounded px-3 py-2 w-80 text-lg text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
  );
}
