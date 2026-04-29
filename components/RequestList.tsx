import type { RequestWithWorkCenter } from "@/lib/repositories";
import { ToggleButton } from "./ToggleButton";

type Props = {
  requests: RequestWithWorkCenter[];
};

export function RequestList({ requests }: Props) {
  if (requests.length === 0) {
    return <p style={{ color: "#888", marginTop: "1rem" }}>No requests found.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {requests.map((req) => (
        <li
          key={req.id}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            padding: "0.85rem 1rem",
            marginBottom: "0.5rem",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            background: "#fafafa",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{req.title}</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#777",
                  padding: "0.1rem 0.4rem",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  background: "#fff",
                }}
              >
                {req.work_center_name}
              </span>
            </div>
            {req.note && (
              <p style={{ margin: "0.3rem 0 0", color: "#555", fontSize: "0.87rem" }}>
                {req.note}
              </p>
            )}
            <time
              dateTime={req.created_at}
              style={{ display: "block", marginTop: "0.3rem", fontSize: "0.75rem", color: "#999" }}
            >
              {new Date(req.created_at).toLocaleString()}
            </time>
          </div>
          <div style={{ flexShrink: 0 }}>
            <ToggleButton request={req} />
          </div>
        </li>
      ))}
    </ul>
  );
}
