import useAnalytics from '../hooks/useAnalytics'
import useJobs from '../hooks/useJobs'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

// Colors for each status in the pie chart
const STATUS_COLORS = {
  will_apply: '#6b7280',
  applied: '#3b82f6',
  interview: '#f59e0b',
  offer: '#10b981',
  rejected: '#ef4444',
}

function Dashboard() {
  const { analytics, loading, error } = useAnalytics()
  const { jobs } = useJobs()

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!analytics) return null

  // Build pie chart data from jobs
  // Count how many jobs have each status
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {})

  // Convert to array format recharts needs
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' '),  // will_apply → will apply
    value: count,
    color: STATUS_COLORS[status]
  }))

  // Build bar chart data — applications per month
  const monthCounts = jobs.reduce((acc, job) => {
    if (!job.applied_date) return acc
    // Get month name from date e.g. "2026-04-09" → "Apr"
    const month = new Date(job.applied_date).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const barData = Object.entries(monthCounts).map(([month, count]) => ({
    month,
    applications: count
  }))

  return (
    <div className="space-y-6">

      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Total Applications */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {analytics.total_applications}
          </p>
        </div>

        {/* Interviews */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Interviews</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">
            {analytics.interviews}
          </p>
        </div>

        {/* Offers */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Offers</p>
          <p className="text-3xl font-bold text-green-500 mt-1">
            {analytics.offers}
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-3xl font-bold text-blue-500 mt-1">
            {analytics.success_rate}%
          </p>
        </div>

      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pie chart — applications by status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Applications by Status
          </h2>

          {pieData.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}   // Makes it a donut chart
                    outerRadius={90}
                    dataKey="value"
                  >
                    {/* Each slice gets its status color */}
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-gray-600">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar chart — applications over time */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Applications per Month
          </h2>

          {barData.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet — add jobs with applied dates</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Recent jobs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Applications</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-400 text-sm">No jobs yet</p>
        ) : (
          <div className="space-y-2">
            {/* Show only last 5 jobs */}
            {jobs.slice(0, 5).map(job => (
              <div
                key={job.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.company}</p>
                  <p className="text-xs text-gray-500">{job.role}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${job.status === 'offer' ? 'bg-green-100 text-green-700' : ''}
                  ${job.status === 'interview' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${job.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                  ${job.status === 'applied' ? 'bg-blue-100 text-blue-700' : ''}
                  ${job.status === 'will_apply' ? 'bg-gray-100 text-gray-700' : ''}
                `}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard