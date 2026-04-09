import { useState,useEffect } from 'react'
import {getAnalytics} from '../services/api'

function useAnalytics() {
    const [analytics, setAnalytics] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    useEffect(() =>{
        fetchAnalytics()
    },[])

    const fetchAnalytics = async () => {
        try{
            setLoading(true)
            const res = await getAnalytics()
            setAnalytics(res.data)
        }catch(err){
            setError('failed to load analytics')
        }finally{
            setLoading(false)
        }
    }
    return {analytics,loading,error}
}

export default useAnalytics