import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { deleteJob } from '../services/api'

function JobCard({ job, onDelete, onEdit }) {
    const navigate = useNavigate()

    const handleDelete = async (e) => {
        e.stopPropagation()

        if (!window.confirm('Delete this job?')) return

        try {
            await deleteJob(job.id)
            onDelete(job.id)
        } catch (err) {
            alert('failed to delete job')
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        onEdit(job)
    }

    return (
        // Clicking the card navigates to job detail page
        <div
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div>
                    {/* Company name */}
                    <h3 className="font-semibold text-gray-900">{job.company}</h3>
                    {/* Role */}
                    <p className="text-gray-600 text-sm mt-1">{job.role}</p>
                    {/* Deadline if it exists */}
                    {job.deadline && (
                        <p className="text-red-500 text-xs mt-1">Deadline: {job.deadline}</p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={job.status} />

                    <div className="flex gap-2 mt-2">
                        {/* Edit button */}
                        <button
                            onClick={handleEdit}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                        {/* Delete button */}
                        <button
                            onClick={handleDelete}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Applied date */}
            {job.applied_date && (
                <p className="text-gray-400 text-xs mt-3">Applied: {job.applied_date}</p>
            )}
        </div>
    )
}
export default JobCard