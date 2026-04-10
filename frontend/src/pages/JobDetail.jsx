import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import {
  getJob, updateJob,
  getNotes, createNote,
  getTimeline, createTimelineEntry, deleteTimelineEntry
} from '../services/api'
import NoteItem from "../components/NoteItem";
import StatusBadge from '../components/StatusBadge'

const STAGE_OPTIONS = [
  'Applied',
  'HR Call',
  'Technical Interview',
  'Final Interview',
  'Offer',
  'Rejected',
  'Other'
]

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [notes, setNotes] = useState([])
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  const [newNote, setNewNote] = useState('')

  const [newStage, setNewStage] = useState('HR Call')
  const [newStageDate, setNewStageDate] = useState('')
  const [newStageNote, setNewStageNote] = useState('')

  useEffect(() => {
    if (id) {
      loadAll()
    }

  }, [id])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [jobRes, notesRes, timelineRes] = await Promise.all([
        getJob(id),
        getNotes(id),
        getTimeline(id)
      ])

      // job comes from res.data
      setJob(jobRes.data)

      // notes and timeline come directly as arrays
      // check both possibilities
      setNotes(Array.isArray(notesRes.data) ? notesRes.data : [])
      setTimeline(Array.isArray(timelineRes.data) ? timelineRes.data : [])

    } catch (err) {
      console.error(err)
      alert('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    try {
      const res = await updateJob(id, { status: newStatus })
      setJob(res.data)
    } catch (err) {
      alert('failed to update status')
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    try {
      const res = await createNote({ job_id: id, content: newNote })
      const savedNote = Array.isArray(res.data) ? res.data[0] : res.data

      setNotes(prev => [...prev, savedNote])
      setNewNote('')
    } catch (err) {
      console.error(err)
      alert('failed to add note')
    }
  }

  const handleAddStage = async () => {
    if (!newStage) return
    try {
      const data = {
        job_id: id,
        stage: newStage,
        notes: newStageNote || null,
        date: newStageDate || null
      }
      const res = await createTimelineEntry(data)
      setTimeline(prev => [...prev, res.data])
      setNewStageDate('')
      setNewStageNote('')
    } catch (err) {
      alert('failed to add stage')
    }
  }

  const handleDeleteStage = async (entryId) => {
    if (!window.confirm('delete this stage??')) return
    try {
      await deleteTimelineEntry(entryId)
      setTimeline(prev => prev.filter(e => e.id !== entryId))
    } catch (err) {
      alert('failed to delete stage')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!job) return <p className="text-red-500">Job not found</p>

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Back button */}
      <button
        onClick={() => navigate('/jobs')}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </button>

      {/* Job header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.company}</h1>
            <p className="text-gray-600 mt-1">{job.role}</p>
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm hover:underline mt-1 block"
              >
                View Job Posting
              </a>
            )}
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Dates */}
        <div className="flex gap-6 mt-4 text-sm text-gray-500">
          {job.applied_date && <p>Applied: {job.applied_date}</p>}
          {job.deadline && <p className="text-red-500">Deadline: {job.deadline}</p>}
        </div>

        {/* Quick status update */}
        <div className="mt-4">
          <label className="text-sm text-gray-600">Update Status</label>
          <select
            value={job.status}
            onChange={handleStatusChange}
            className="ml-3 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="will_apply">Will Apply</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Description */}
        {job.description && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Job Description</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        )}
      </div>

      {/* Timeline section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>

        {/* Timeline entries */}
        {timeline.length === 0 ? (
          <p className="text-gray-400 text-sm mb-4">No stages yet</p>
        ) : (
          <div className="space-y-3 mb-6">
            {timeline.map((entry, index) => (
              <div key={entry.id} className="flex items-start gap-3">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                  {/* Line connecting dots — hide on last item */}
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{entry.stage}</p>
                    <button
                      onClick={() => handleDeleteStage(entry.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  {entry.date && (
                    <p className="text-xs text-gray-400">{entry.date}</p>
                  )}
                  {entry.notes && (
                    <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new stage */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Add Stage</p>
          <div className="flex gap-2">
            {/* Stage dropdown */}
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
            >
              {STAGE_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {/* Date input */}
            <input
              type="date"
              value={newStageDate}
              onChange={(e) => setNewStageDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          {/* Optional note for this stage */}
          <input
            type="text"
            value={newStageNote}
            onChange={(e) => setNewStageNote(e.target.value)}
            placeholder="Optional note for this stage..."
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleAddStage}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Add Stage
          </button>
        </div>
      </div>

      {/* Notes section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>

        {/* Existing notes */}
        <div className="space-y-3 mb-4">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-sm">No notes yet</p>
          ) : (
            notes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={(noteId) => setNotes(prev => prev.filter(n => n.id !== noteId))}
                onUpdate={(updated) => setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))}
              />
            ))
          )}
        </div>

        {/* Add new note */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            placeholder="Add a note... e.g. Interview on Monday at 3pm"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleAddNote}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Add Note
          </button>
        </div>
      </div>

    </div>
  )

}
export default JobDetail