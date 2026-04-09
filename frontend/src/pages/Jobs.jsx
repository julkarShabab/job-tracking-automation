// Main jobs page — shows all jobs and handles add/edit
import { useState } from 'react'
import JobCard from '../components/JobCard'
import JobForm from '../components/JobForm'
import useJobs from '../hooks/useJobs'

function Jobs() {
  const { jobs, loading, error, addJob, editJob, removeJob } = useJobs()

  // Controls whether the form is visible
  const [showForm, setShowForm] = useState(false)

  // If editing, this holds the job being edited. null = add mode
  const [editingJob, setEditingJob] = useState(null)

  // Called when form saves successfully
  const handleSave = (savedJob) => {
    if (editingJob) {
      editJob(savedJob)   // Update existing job in list
    } else {
      addJob(savedJob)    // Add new job to list
    }
    setShowForm(false)
    setEditingJob(null)
  }

  // Called when edit button is clicked on a card
  const handleEdit = (job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  if (loading) return <p className="text-gray-500">Loading jobs...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <button
          onClick={() => { setShowForm(true); setEditingJob(null) }}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + Add Job
        </button>
      </div>

      {/* Form — only shows when showForm is true */}
      {showForm && (
        <JobForm
          job={editingJob}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Job list */}
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs yet. Add your first one!</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={removeJob}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Jobs