const OptionCard = ({ icon, title, description, buttonLabel, onAction }) => {
  return (
    <div className="flex-1 bg-[var(--surface)] rounded-2xl shadow-sm border border-[var(--border-subtle)] p-8 md:p-10 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="bg-[var(--surface-muted)] p-3 rounded-xl mb-6">{icon}</div>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">{title}</h2>

      <p className="text-[var(--text-secondary-alt)] text-sm md:text-base mb-8 flex-1">
        {description}
      </p>

      <button
        onClick={onAction}
        className="w-full md:w-auto px-6 py-3 bg-[var(--brand)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default OptionCard;
