import { useState, useEffect } from 'react'
import { getFlaggedJobs, flagJob } from '../services/api'

function SavedJobs() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)
    const [removing, setRemoving] = useState(null)

    useEffect(() => {
        loadFlaggedJobs()
    }, [])

    const loadFlaggedJobs = async () => {
        setLoading(true)
        try {
            const res = await getFlaggedJobs()
            setJobs(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (jobId) => {
        setRemoving(jobId)
        try {
            await flagJob(jobId, {
                is_flagged: false,
                flagged_analysis: null,
                flagged_match: null
            })
            setJobs(jobs.filter(j => j.id !== jobId))
        } catch (err) {
            console.error(err)
        } finally {
            setRemoving(null)
        }
    }

    const toggle = (id) => setExpanded(expanded === id ? null : id)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400 text-sm">Loading saved jobs...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold">🔖 Saved Jobs</h1>
                <p className="text-amber-100 mt-1 text-sm">Jobs you flagged as suitable — with their full analysis and CV match.</p>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <p className="text-4xl mb-3">🔖</p>
                    <p className="text-gray-500 font-medium">No saved jobs yet</p>
                    <p className="text-gray-400 text-sm mt-1">Analyze a job and click "Save to Job" to save it here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                            {/* ── Job Header ── */}
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                                        {job.company?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{job.company}</p>
                                        <p className="text-sm text-gray-500">{job.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Match score badge if available */}
                                    {job.flagged_match?.match_score !== undefined && (
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${job.flagged_match.match_score >= 70 ? 'bg-emerald-100 text-emerald-700' :
                                                job.flagged_match.match_score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {job.flagged_match.match_score}% match
                                        </span>
                                    )}

                                    <button
                                        onClick={() => toggle(job.id)}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition-all"
                                    >
                                        {expanded === job.id ? 'Hide Details' : 'View Details'}
                                    </button>

                                    <button
                                        onClick={() => handleRemove(job.id)}
                                        disabled={removing === job.id}
                                        className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40"
                                    >
                                        {removing === job.id ? 'Removing...' : 'Remove'}
                                    </button>
                                </div>
                            </div>

                            {/* ── Expanded Details ── */}
                            {expanded === job.id && (
                                <div className="border-t border-gray-100 p-5 space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                        {/* ── Analysis ── */}
                                        {job.flagged_analysis && (
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                                    Analysis
                                                </h3>

                                                {job.flagged_analysis.summary && (
                                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Summary</p>
                                                        <p className="text-sm text-gray-700">{job.flagged_analysis.summary}</p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-3">
                                                    {job.flagged_analysis.experience_level && (
                                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                            <p className="text-xs text-gray-400">Experience</p>
                                                            <p className="text-sm font-semibold text-blue-600 mt-0.5">{job.flagged_analysis.experience_level}</p>
                                                        </div>
                                                    )}
                                                    {job.flagged_analysis.job_type && (
                                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                            <p className="text-xs text-gray-400">Job Type</p>
                                                            <p className="text-sm font-semibold text-blue-600 mt-0.5">{job.flagged_analysis.job_type}</p>
                                                        </div>
                                                    )}
                                                    {job.flagged_analysis.location && (
                                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                            <p className="text-xs text-gray-400">Location</p>
                                                            <p className="text-sm font-semibold text-gray-700 mt-0.5">{job.flagged_analysis.location}</p>
                                                        </div>
                                                    )}
                                                    {job.flagged_analysis.salary && (
                                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                            <p className="text-xs text-gray-400">Salary</p>
                                                            <p className="text-sm font-semibold text-emerald-600 mt-0.5">{job.flagged_analysis.salary}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {job.flagged_analysis.skills?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.flagged_analysis.skills.map((s, i) => (
                                                                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {job.flagged_analysis.benefits?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Benefits</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.flagged_analysis.benefits.map((b, i) => (
                                                                <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{b}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {job.flagged_analysis.keywords?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Keywords</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.flagged_analysis.keywords.map((k, i) => (
                                                                <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{k}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── CV Match ── */}
                                        {job.flagged_match && (
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                                                    CV Match
                                                </h3>

                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                    <p className="text-xs text-gray-400 mb-2">Match Score</p>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-4xl font-bold ${job.flagged_match.match_score >= 70 ? 'text-emerald-500' :
                                                                job.flagged_match.match_score >= 40 ? 'text-yellow-500' : 'text-red-500'
                                                            }`}>
                                                            {job.flagged_match.match_score}%
                                                        </span>
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className={`h-2.5 rounded-full transition-all ${job.flagged_match.match_score >= 70 ? 'bg-emerald-500' :
                                                                        job.flagged_match.match_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: job.flagged_match.match_score + '%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {job.flagged_match.summary && (
                                                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">Summary</p>
                                                        <p className="text-sm text-gray-700">{job.flagged_match.summary}</p>
                                                    </div>
                                                )}

                                                {job.flagged_match.matching_skills?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Matching Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.flagged_match.matching_skills.map((s, i) => (
                                                                <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {job.flagged_match.missing_skills?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Missing Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.flagged_match.missing_skills.map((s, i) => (
                                                                <span key={i} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {job.flagged_match.recommendations?.length > 0 && (
                                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recommendations</p>
                                                        {job.flagged_match.recommendations.map((r, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                                <span className="text-blue-400 mt-0.5 font-bold">→</span>
                                                                {r}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* No match yet */}
                                        {!job.flagged_match && (
                                            <div className="flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8">
                                                <div className="text-center">
                                                    <p className="text-2xl mb-2">📋</p>
                                                    <p className="text-sm text-gray-400">No CV match saved for this job.</p>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SavedJobs