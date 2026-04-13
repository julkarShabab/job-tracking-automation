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
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">AI Job Tools</h1>
        <p className="text-blue-100 mt-1 text-sm">Analyze jobs, match your CV, and generate cover letters instantly.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Step Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Step 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">1</div>
            <h2 className="font-semibold text-gray-800">Job Description</h2>
          </div>
          <p className="text-xs text-gray-400">Paste the job description below to get started.</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            placeholder="Paste job description here..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !description.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            {analyzing ? '⏳ Analyzing...' : '🔍 Analyze Job'}
          </button>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">2</div>
            <h2 className="font-semibold text-gray-800">Upload CV</h2>
          </div>
          <p className="text-xs text-gray-400">Upload your CV to match it and generate a cover letter.</p>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-8 cursor-pointer transition-colors bg-gray-50">
            <input type="file" accept=".pdf,.docx" onChange={handleCVUpload} className="hidden" />
            {extracting ? (
              <p className="text-sm text-blue-500 font-medium">Extracting text...</p>
            ) : cvFileName ? (
              <div className="text-center space-y-1">
                <p className="text-sm text-green-600 font-semibold">{cvFileName}</p>
                <p className="text-xs text-gray-400">{cvText.split(' ').length} words extracted</p>
                <p className="text-xs text-blue-400">Click to change</p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-2xl">📄</p>
                <p className="text-sm text-gray-500">Click to upload PDF or DOCX</p>
                <p className="text-xs text-gray-400">Supports .pdf and .docx</p>
              </div>
            )}
          </label>

          {cvText && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Your Name <span className="text-gray-400">(for cover letter)</span></label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <button
                onClick={handleMatch}
                disabled={matching || !analysis}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                {matching ? '⏳ Matching...' : '🎯 Match CV to Job'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !analysis}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                {generating ? '⏳ Generating...' : '✉️ Generate Cover Letter'}
              </button>
              {!analysis && (
                <p className="text-xs text-gray-400 text-center">Analyze a job first to enable these</p>
              )}
            </div>
          )}

          {!cvText && !extracting && (
            <p className="text-xs text-gray-400 text-center">Upload your CV to unlock matching and cover letter generation</p>
          )}
        </div>
      </div>

      {/* ── Analysis Results ── */}
      {/* ── Analysis + Match Side by Side ── */}
      {(analysis || matchResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Analysis Results ── */}
          {analysis && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Analysis Results
              </h2>

              {analysis.summary && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Summary</p>
                  <p className="text-sm text-gray-700">{analysis.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {analysis.experience_level && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Experience</p>
                    <p className="text-sm font-semibold text-blue-600 mt-0.5">{analysis.experience_level}</p>
                  </div>
                )}
                {analysis.job_type && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Job Type</p>
                    <p className="text-sm font-semibold text-blue-600 mt-0.5">{analysis.job_type}</p>
                  </div>
                )}
                {analysis.location && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{analysis.location}</p>
                  </div>
                )}
                {analysis.salary && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Salary</p>
                    <p className="text-sm font-semibold text-emerald-600 mt-0.5">{analysis.salary}</p>
                  </div>
                )}
              </div>

              {analysis.apply_method &&
                analysis.apply_method.type !== 'not mentioned' &&
                analysis.apply_method.value &&
                analysis.apply_method.value !== 'null' &&
                analysis.apply_method.value !== null && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">How to Apply</p>
                    {analysis.apply_method.type === 'email' && (
                      <a href={"mailto:" + analysis.apply_method.value} className="text-sm text-indigo-600 hover:underline">
                        {analysis.apply_method.value}
                      </a>
                    )}
                    {(analysis.apply_method.type === 'link' || analysis.apply_method.type === 'both') && (
                      <a href={analysis.apply_method.value} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline font-medium">
                        Apply Here →
                      </a>
                    )}
                  </div>
                )}

              {analysis.skills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.map((s, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.benefits?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.benefits.map((b, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{b}</span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((k, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Match Results ── */}
          {matchResult && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                CV Match Results
              </h2>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Match Score</p>
                <div className="flex items-center gap-4">
                  <span className={`text-4xl font-bold ${matchResult.match_score >= 70 ? 'text-emerald-500' :
                      matchResult.match_score >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                    {matchResult.match_score}%
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${matchResult.match_score >= 70 ? 'bg-emerald-500' :
                          matchResult.match_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: matchResult.match_score + '%' }}
                    />
                  </div>
                </div>
              </div>

              {matchResult.summary && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">Summary</p>
                  <p className="text-sm text-gray-700">{matchResult.summary}</p>
                </div>
              )}

              {matchResult.matching_skills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Matching Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matching_skills.map((s, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {matchResult.missing_skills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Missing Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missing_skills.map((s, i) => (
                      <span key={i} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {matchResult.recommendations?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recommendations</p>
                  {matchResult.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-400 mt-0.5 font-bold">→</span>
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ── Cover Letter ── */}
      {coverLetter && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Generated Cover Letter
            </h2>
            <button
              onClick={handleCopy}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg transition-all font-medium"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{coverLetter}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Analyzer