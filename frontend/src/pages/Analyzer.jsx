import { useState } from "react";
import { analyzeJobAI } from '../services/api'

function Analyzer() {
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!description.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await analyzeJobAI({ description })
      setResult(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to analyze job. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">AI Job Analyzer</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Paste a job description and AI will extract skills, keywords, experience level and more.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          placeholder="Paste job description here..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !description.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Job'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="space-y-4">

          {/* Summary */}
          {result.summary && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Summary</h2>
              <p className="text-sm text-gray-600">{result.summary}</p>
            </div>
          )}

          {/* Experience Level and Job Type */}
          <div className="grid grid-cols-2 gap-4">
            {result.experience_level && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Experience Level</h2>
                <p className="text-sm text-blue-600 font-medium">{result.experience_level}</p>
              </div>
            )}
            {result.job_type && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Job Type</h2>
                <p className="text-sm text-blue-600 font-medium">{result.job_type}</p>
              </div>
            )}
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-2 gap-4">
            {result.location && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Location</h2>
                <p className="text-sm text-blue-600 font-medium">{result.location}</p>
              </div>
            )}
            {result.salary && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Salary</h2>
                <p className="text-sm text-green-600 font-medium">{result.salary}</p>
              </div>
            )}
          </div>

          {/* How to Apply */}
          {result.apply_method && result.apply_method.type !== 'not mentioned' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">How to Apply</h2>
              {result.apply_method.type === 'email' && (
                <a
                  href={"mailto:" + result.apply_method.value}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {result.apply_method.value}
                </a>
              )}
              {result.apply_method.type === 'link' && (
                <a
                  href={result.apply_method.value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Apply Here
                </a>
              )}
              {result.apply_method.type === 'both' && (
                <div className="flex gap-4">
                  <a
                    href={"mailto:" + result.apply_method.value}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Apply via Email
                  </a>
                  <a
                    href={result.apply_method.value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Apply via Link
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          {result.benefits && result.benefits.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Benefits</h2>
              <div className="flex flex-wrap gap-2">
                {result.benefits.map((benefit, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {result.skills && result.skills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {result.keywords && result.keywords.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default Analyzer