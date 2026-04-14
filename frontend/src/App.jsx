import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Analyzer from './pages/Analyzer'
import Import from './pages/Import'
import SavedJobs from './pages/SavedJobs'

import Navbar from './components/Navbar'

function App() {
  return (

    <BrowserRouter>
      <Navbar />


      <main className="max-w-6xl mx-auto px-4 py-6">


        <Routes>

          <Route path="/" element={<Dashboard />} />


          <Route path="/jobs" element={<Jobs />} />


          <Route path="/jobs/:id" element={<JobDetail />} />


          <Route path="/analyzer" element={<Analyzer />} />


          <Route path="/import" element={<Import />} />
          <Route path="/saved" element={<SavedJobs />} />
        </Routes>

      </main>
    </BrowserRouter>
  )
}

export default App