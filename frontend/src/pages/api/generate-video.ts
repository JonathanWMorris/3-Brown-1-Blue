import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  const process = spawn('python', ['backend/openai_model.py'])

  let output = ''
  let errorOutput = ''

  process.stdout.on('data', (data) => {
    output += data.toString()
  })

  process.stderr.on('data', (data) => {
    errorOutput += data.toString()
  })

  process.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: errorOutput || 'An error occurred' })
    }
    try {
      const jsonOutput = JSON.parse(output)
      return res.status(200).json(jsonOutput)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to parse output' })
    }
  })

  // Send the prompt to the Python script
  process.stdin.write(JSON.stringify({ prompt }))
  process.stdin.end()
}
