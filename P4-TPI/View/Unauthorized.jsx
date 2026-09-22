import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <main className="flex min-h-screen w-full bg-[#F8F5F0] items-center justify-center p-8">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e2ddd8] mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </div>

        <span className="text-[140px] font-bold text-[#1a1a2e] leading-none tracking-tight">
          403
        </span>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mt-4">
          Access denied
        </h1>

        <p className="text-[#9a9a9a] mt-2 text-sm max-w-xs">
          You don't have permission to view this page.
        </p>

        <Link
          to="/"
          className="mt-10 px-6 py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
        >
          ← Go back home
        </Link>
      </div>
    </main>
  );
};

export default Unauthorized;
