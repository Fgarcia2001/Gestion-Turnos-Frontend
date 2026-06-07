// agregar traslate

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 5A2 2 0 0 1 14 5A7 7 0 0 1 18 11V14L20 16V17H4V16L6 14V11A7 7 0 0 1 10 5Z" /><path d="M9 17V18A3 3 0 0 0 15 18V17" />
  </svg>
);

const Header = ({ username = "Alif Reza" }) => {
  const initials = username.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <header className="flex items-center justify-between w-full px-8 py-5 bg-[#f0ede8]">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] leading-tight">
          Hello, <span className="font-bold">{username}</span>
        </h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">View and control your appointments here!</p>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#e2ddd8] text-[#8a8a8a] hover:bg-[#e4e0da] hover:text-[#1a1a2e] transition-all duration-200 cursor-pointer">
          <IconBell />
        </button>
        <button aria-label="Profile" className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#e2ddd8] cursor-pointer hover:border-[#1a1a2e] transition-all duration-200 shrink-0">
          <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;