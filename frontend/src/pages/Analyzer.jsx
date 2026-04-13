import { useState } from "react"
import { analyzeJobAI, cvMatchAI, coverLetterAI, extractCV } from '../services/api'

function Analyzer() {
  // Step 1 — Job description and analysis
  const [description, setDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Step 2 — CV upload and match
  const [cvText, setCvText] = useState('')
  const [cvFileName, setCvFileName] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [matchResult, setMatchResult] = useState(null)
  const [matching, setMatching] = useState(false)

  // Step 3 — Cover letter
  const [coverLetter, setCoverLetter] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')

  const [error, setError] = useState(null)

  // Step 1 — Analyze job description
  const handleAnalyze = async () => {
    if (!description.trim()) return
    setAnalyzing(true)
    setError(null)
    setAnalysis(null)
    setMatchResult(null)
    setCoverLetter('')

    try {
      const res = await analyzeJobAI({ description })
      setAnalysis(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to analyze job. Make sure backend is running.')
    } finally {
      setAnalyzing(false)
    }
  }

  // Step 2a — Upload and extract CV text
  const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setExtracting(true)
    setError(null)
    setCvFileName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await extractCV(formData)
      setCvText(res.data.text)
    } catch (err) {
      console.error(err)
      setError('Failed to extract CV text. Make sure file is PDF or DOCX.')
    } finally {
      setExtracting(false)
    }
  }

  // Step 2b — Match CV to job
  const handleMatch = async () => {
    if (!cvText || !description) return
    setMatching(true)
    setError(null)
    setMatchResult(null)

    try {
      const res = await cvMatchAI({ cv: cvText, description })
      setMatchResult(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to match CV.')
    } finally {
      setMatching(false)
    }
  }

  // Step 3 — Generate cover letter
  const handleGenerate = async () => {
    if (!description) return
    setGenerating(true)
    setError(null)
    setCoverLetter('')

    try {
      const res = await coverLetterAI({ description, cv: cvText, name })
      setCoverLetter(res.data.cover_letter)
    } catch (err) {
      console.error(err)
      setError('Failed to generate cover letter.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">AI Job Tools</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* ───────── TOP SECTION ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Step 1 */}
        <div className="md:col-span-2 bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Step 1 — Job Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={12}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !description.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Job'}
          </button>
        </div>

        {/* Step 2 */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Step 2 — Upload CV</h2>

          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-blue-400">
            <input type="file" onChange={handleCVUpload} className="hidden" />
            {cvFileName ? (
              <p className="text-green-600 font-medium">{cvFileName}</p>
            ) : (
              <p className="text-gray-500">Upload CV</p>
            )}
          </label>

          {cvText && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <button
                onClick={handleMatch}
                disabled={matching || !analysis}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Match CV
              </button>

              <button
                onClick={handleGenerate}
                disabled={generating || !analysis}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Generate Cover Letter
              </button>
            </>
          )}
        </div>
      </div>

      {/* ───────── SIDE-BY-SIDE RESULTS ───────── */}
      {(analysis || matchResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ───── ANALYSIS ───── */}
          {analysis && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Analysis</h2>

              <div className="space-y-4">

                {analysis.summary && (
                  <div className="bg-white border rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-sm text-gray-600">{analysis.summary}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {analysis.experience_level && (
                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="text-blue-600 font-medium">{analysis.experience_level}</p>
                    </div>
                  )}

                  {analysis.job_type && (
                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-xs text-gray-500">Job Type</p>
                      <p className="text-blue-600 font-medium">{analysis.job_type}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {analysis.location && (
                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-xs text-gray-500">Location</p>
                      <p>{analysis.location}</p>
                    </div>
                  )}

                  {analysis.salary && (
                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-xs text-gray-500">Salary</p>
                      <p className="text-green-600 font-medium">{analysis.salary}</p>
                    </div>
                  )}
                </div>

                {analysis.skills?.length > 0 && (
                  <div className="bg-white border rounded-xl p-4">
                    <h3 className="mb-2 font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs whitespace-nowrap"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ───── MATCH ───── */}
          {matchResult && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Match</h2>

              <div className="space-y-4">

                <div className="bg-white border rounded-xl p-4">
                  <p className="text-xs text-gray-500">Match Score</p>
                  <p className="text-3xl font-bold">{matchResult.match_score}%</p>
                </div>

                {matchResult.summary && (
                  <div className="bg-white border rounded-xl p-4">
                    <h3 className="mb-2 font-semibold">Summary</h3>
                    <p className="text-sm text-gray-600">{matchResult.summary}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 items-stretch">

                  {/* Matching */}
                  {matchResult.matching_skills?.length > 0 && (
                    <div className="bg-white border rounded-xl p-4 h-full flex flex-col">
                      <h3 className="mb-2 font-semibold">Matching</h3>
                      <div className="flex flex-wrap gap-2 content-start max-h-24 overflow-y-auto">
                        {matchResult.matching_skills.map((s, i) => (
                          <span
                            key={i}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs whitespace-nowrap"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing */}
                  {matchResult.missing_skills?.length > 0 && (
                    <div className="bg-white border rounded-xl p-4 h-full flex flex-col">
                      <h3 className="mb-2 font-semibold">Missing</h3>
                      <div className="flex flex-wrap gap-2 content-start max-h-24 overflow-y-auto">
                        {matchResult.missing_skills.map((s, i) => (
                          <span
                            key={i}
                            className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs whitespace-nowrap"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {matchResult.recommendations?.length > 0 && (
                  <div className="bg-white border rounded-xl p-4">
                    <h3 className="mb-2 font-semibold">Recommendations</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {matchResult.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ───────── COVER LETTER ───────── */}
      {coverLetter && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Cover Letter</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {coverLetter}
          </p>
        </div>
      )}
    </div>
  )
}

export default Analyzer