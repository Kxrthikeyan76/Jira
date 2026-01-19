export default function DashboardPage() {
  return (
    <div className="max-w-6xl space-y-8">

      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here’s an overview of what’s happening in TrackFlow.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value="0" />
        <StatCard title="Active Projects" value="0" />
        <StatCard title="Open Issues" value="0" />
        <StatCard title="Completed Tasks" value="0" />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-300 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">
            Recent Activity
          </h2>

          <div className="text-gray-500 text-sm py-10 text-center">
            No recent activity to show.
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-300 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <ActionButton label="Create New Project" />
            <ActionButton label="View All Projects" />
            <ActionButton label="Go to Kanban Board" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-sm transition">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-100 transition text-left">
      {label}
    </button>
  );
}
