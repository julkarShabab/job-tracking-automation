// import axios from 'axios'

// const JOB_ANALYZER_URL = import.meta.env.VITE_N8N_JOB_ANALYZER

// export const analyzeJob = async (description) => {
//   const response = await axios.post(JOB_ANALYZER_URL, { description }, {
//     headers: { 'Content-Type': 'application/json' }
//   })

//   console.log('FULL RESPONSE:', response.data)

//   // Try all possible structures safely
//   const content =
//     response.data?.choices?.[0]?.message?.content ||
//     response.data?.body?.choices?.[0]?.message?.content ||
//     null

//   if (!content) {
//     throw new Error("Invalid response from n8n")
//   }

//   return content
// }

import axios from 'axios'

const JOB_ANALYZER_URL = import.meta.env.VITE_N8N_JOB_ANALYZER

export const analyzeJob = async (description) => {
  const response = await axios.post(JOB_ANALYZER_URL, { description }, {
    headers: { 'Content-Type': 'application/json' }
  })
  
  console.log('status:', response.status)
  console.log('data type:', typeof response.data)
  console.log('data:', response.data)
  console.log('data stringified:', JSON.stringify(response.data))
  
  return response.data
}