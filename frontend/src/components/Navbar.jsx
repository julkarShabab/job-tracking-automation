import {Link,useLocation} from 'react-router-dom'

function Navbar(){
    const location = useLocation()

    const isActive = (path) =>
        location.pathname === path
    ? 'text-blue-600 font-semibold'
    : 'text-gray-600 hover:text-blue-500'

    return(
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        
        <Link to="/" className="text-xl font-bold text-blue-600">
          JobTracker
        </Link>

        
        <div className="flex gap-6">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/jobs" className={isActive('/jobs')}>Jobs</Link>
          <Link to="/analyzer" className={isActive('/analyzer')}>AI Analyzer</Link>
          <Link to="/import" className={isActive('/import')}>Import</Link>
        </div>

      </div>
    </nav>
  
    )
}

export default Navbar