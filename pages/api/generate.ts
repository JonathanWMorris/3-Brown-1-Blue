import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    const pythonProcess = spawn('python', ['backend/openai_model.py', prompt]);

    let result = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({ response: result.trim() });
      } else {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
