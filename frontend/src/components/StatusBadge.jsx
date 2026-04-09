function StatusBadge({ status }) {
    const colors = {
        will_apply: 'bg-gray-100 text-gray-700',
        applied: 'bg-blue-100 text-blue-700',
        interview: 'bg-yellow-100 text-yellow-700',
        offer: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    }

    return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )

}

export default StatusBadge