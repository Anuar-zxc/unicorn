import { MoreHorizontal } from "lucide-react";
import { recentDocuments } from "@/lib/data";
import { Badge } from "@/components/shared/Badge";

const statusTone = {
  Draft: "amber",
  Active: "green",
  Expired: "neutral"
} as const;

export function DocumentTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-[#252528] bg-[#141418]">
      <div className="border-b border-[#252528] p-5">
        <h2 className="font-display text-lg font-semibold">Recent Documents</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-white/42">
            <tr className="border-b border-[#252528]">
              <th className="px-5 py-3 font-medium">File name</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentDocuments.map((doc) => (
              <tr key={doc.name} className="border-b border-[#252528] last:border-0">
                <td className="px-5 py-4 font-medium">{doc.name}</td>
                <td className="px-5 py-4 text-white/55">{doc.type}</td>
                <td className="px-5 py-4">
                  <Badge tone={statusTone[doc.status as keyof typeof statusTone]}>{doc.status}</Badge>
                </td>
                <td className="px-5 py-4 text-white/55">{doc.date}</td>
                <td className="px-5 py-4">
                  <button aria-label={`Actions for ${doc.name}`} className="rounded-full p-2 hover:bg-white/5">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
