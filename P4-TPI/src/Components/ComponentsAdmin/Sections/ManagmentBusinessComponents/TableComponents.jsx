import { useState, useRef, useEffect } from 'react';
import { IconDots, IconEdit, IconClock, IconTrash } from './Icons';
import { Avatar, Badge } from './Shared';

// ── Dropdown context menu ─────────────────────────────────────────────────────
export const RowMenu = ({ tab, onEdit, onDelete, onSchedules }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1 rounded-lg hover:bg-[#f0ede8]"
      >
        <IconDots />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 bg-white border border-[#e2ddd8] rounded-xl shadow-lg overflow-hidden"
          style={{ animation: "fadeSlideIn 0.15s ease", minWidth: "10rem" }}
        >
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1a1a2e] hover:bg-[#f0ede8] transition-colors font-medium"
          >
            <IconEdit />
            Edit
          </button>

          {/* Schedules — branch only */}
          {tab === "branch" && (
            <>
              <div className="h-px bg-[#f0ede8]" />
              <button
                onClick={() => { setOpen(false); onSchedules(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1a1a2e] hover:bg-[#f0ede8] transition-colors font-medium"
              >
                <IconClock />
                Schedules
              </button>
            </>
          )}

          <div className="h-px bg-[#f0ede8]" />
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <IconTrash />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ── Table row ─────────────────────────────────────────────────────────────────
export const TableRow = ({ row, tab, t, onEdit, onDelete, onSchedules }) => {
  const tdClass = "py-3 pr-6 text-sm text-[#6b7280]";
  
  if (tab === "staff") {
    return (
      <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7] transition-colors">
        <td className="py-3 pr-6">
          <div className="flex items-center gap-3">
            <Avatar initials={row.staffName?.charAt(0) || "S"} photo={row.staffLinkPhoto || null} />
            <span className="font-semibold text-[#1a1a2e] text-sm">{row.staffName}</span>
          </div>
        </td>
        <td className={tdClass}>{row.staffEmail}</td>
        <td className={tdClass}>{row.staffPhone}</td>
        <td className="py-3 pr-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0ede8] text-[#1a1a2e]">
            {row.rol}
          </span>
        </td>
        <td className={tdClass}>{row.branchName}</td>
        <td className="py-3 text-right">
          <RowMenu tab={tab} onEdit={onEdit} onDelete={onDelete} onSchedules={onSchedules} />
        </td>
      </tr>
    );
  }

  if (tab === "client") {
    return (
      <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7] transition-colors">
        <td className="py-3 pr-6">
          <div className="flex items-center gap-3">
            <Avatar initials={row.name?.charAt(0) || "C"} photo={null} />
            <span className="font-semibold text-[#1a1a2e] text-sm">{row.name}</span>
          </div>
        </td>
        <td className={tdClass}>{row.email}</td>
        <td className={tdClass}>{row.phone}</td>
        <td className={tdClass}>{row.birthday ? new Date(row.birthday).toLocaleDateString() : ""}</td>
        <td className="py-3 text-right">
          <RowMenu tab={tab} onEdit={onEdit} onDelete={onDelete} onSchedules={onSchedules} />
        </td>
      </tr>
    );
  }

  if (tab === "branch") {
    return (
      <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7] transition-colors">
        <td className="py-3 pr-6">
          <span className="font-semibold text-[#1a1a2e] text-sm">{row.name}</span>
        </td>
        <td className={tdClass}>{row.address}</td>
        <td className={tdClass}>{row.phone}</td>
        <td className={tdClass}>{row.city}</td>
        <td className="py-3 text-right">
          <RowMenu tab={tab} onEdit={onEdit} onDelete={onDelete} onSchedules={onSchedules} />
        </td>
      </tr>
    );
  }

  if (tab === "service") {
    return (
      <tr className="border-b border-[#f0ede8] hover:bg-[#faf9f7] transition-colors">
        <td className="py-3 pr-6">
          <span className="font-semibold text-[#1a1a2e] text-sm">{row.name}</span>
        </td>
        <td className={tdClass}>{row.categoria}</td>
        <td className={tdClass}>{row.description}</td>
        <td className={tdClass}>{row.duration}</td>
        <td className="py-3 pr-6 font-medium text-[#1a1a2e]">{row.price}</td>
        <td className="py-3 text-right">
          <RowMenu tab={tab} onEdit={onEdit} onDelete={onDelete} onSchedules={onSchedules} />
        </td>
      </tr>
    );
  }

  return null;
};

