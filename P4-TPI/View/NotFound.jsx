import { Link } from "react-router-dom";

const NotFound = () => {
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <span className="text-[140px] font-bold text-[#1a1a2e] leading-none tracking-tight">
          404
        </span>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mt-4">
          Page not found
        </h1>

        <p className="text-[#9a9a9a] mt-2 text-sm max-w-xs">
          The page you are looking for doesn't exist or was moved.
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

export default NotFound;