import { useState } from 'react'
import { createJob, updateJob } from '../services/api'

function JobForm({ job, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: job?.company || '',
    role: job?.role || '',
    link: job?.link || '',
    description: job?.description || '',
    status: job?.status || 'will_apply',
    applied_date: job?.applied_date || '',
    deadline: job?.deadline || '',
  })

  const [loading, setLoading] = useState(false)


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean the data — convert empty strings to null
      // Backend expects null for optional fields, not empty strings
      const cleanedForm = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      )

      let saved

      if (job) {
        const res = await updateJob(job.id, cleanedForm)
        saved = res.data
      } else {
        const res = await createJob(cleanedForm)
        saved = res.data
      }

      onSave(saved)
    } catch (err) {
      alert('Failed to save job')
      console.error(err)  // This will show the exact error in console
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        {job ? 'Edit Job' : 'Add New Job'}
      </h2>

      {/* Company */}
      <div>
        <label className="text-sm text-gray-600">Company *</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
          placeholder="e.g. Google"
        />
      </div>

      {/* Role */}
      <div>
        <label className="text-sm text-gray-600">Role *</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
          placeholder="e.g. Frontend Developer"
        />
      </div>

      {/* Link */}
      <div>
        <label className="text-sm text-gray-600">Job Link</label>
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
          placeholder="https://..."
        />
      </div>

      {/* Status */}
      <div>
        <label className="text-sm text-gray-600">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
        >
          <option value="will_apply">Will Apply</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applied Date */}
      <div>
        <label className="text-sm text-gray-600">Applied Date</label>
        <input
          type="date"
          name="applied_date"
          value={form.applied_date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
        />
      </div>

      {/* Deadline */}
      <div>
        <label className="text-sm text-gray-600">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm text-gray-600">Job Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm"
          placeholder="Paste job description here..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : job ? 'Update Job' : 'Add Job'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default JobForm