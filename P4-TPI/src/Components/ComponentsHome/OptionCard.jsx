const OptionCard = ({ icon, title, description, buttonLabel, onAction }) => {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#e2ddd8] p-8 md:p-10 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="bg-[#f0ede8] p-3 rounded-xl mb-6">{icon}</div>

      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">{title}</h2>

      <p className="text-[#6b6b6b] text-sm md:text-base mb-8 flex-1">
        {description}
      </p>

      <button
        onClick={onAction}
        className="w-full md:w-auto px-6 py-3 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default OptionCard;
