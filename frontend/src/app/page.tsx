"use client"; 
import React, { useState, FormEvent } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';

interface ApiResponse {
  status: string;
  message: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');  // State for the prompt input
  const [response, setResponse] = useState<ApiResponse | null>(null);  // State for the backend response
  const [error, setError] = useState<string | null>(null);  // State for error handling

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch(`/api/generate-video?prompt=${encodeURIComponent(prompt)}`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data: ApiResponse = await res.json();
      setResponse(data);  // Set the response data from the Flask backend
      setError(null);  // Clear any previous errors
    } catch (error) {
      setError('Failed to retrieve video. Please try again.');
      setResponse(null);  // Clear any previous responses
    }
  };

  return (
    <main className="flex flex-col justify-between min-h-screen p-8 pb-20 sm:p-20 bg-gray-100">
      <div className="flex-grow flex flex-col items-center justify-end w-full">
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '75ch' } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}  // Form submission handler
        >
          <div className="flex items-center">
            <TextField
              id="outlined-helperText"
              label="Write a fun prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              variant="outlined"
              aria-label="message input"
              fullWidth
            />
            <IconButton color="primary" aria-label="send message" sx={{ ml: 1 }} type="submit">
              <SendIcon />
            </IconButton>
          </div>
        </Box>

        {response && (
          <div className="mt-4">
            <p>Status: {response.status}</p>
            <p>Message: {response.message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
