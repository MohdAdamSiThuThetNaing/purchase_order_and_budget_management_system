type DashboardCardProps = {
  title: string;
  value: string;
};

export function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: 14,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}
