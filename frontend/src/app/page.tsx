"use client";
import React, { useState, FormEvent } from 'react';
import { 
  Box, ThemeProvider, createTheme, CssBaseline, TextField, Button, Typography, 
  Paper, IconButton, Fade, CircularProgress, useMediaQuery
} from '@mui/material';
import { 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon,
  MovieCreation as MovieIcon,
  Send as SendIcon
} from '@mui/icons-material';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  React.useEffect(() => {
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#bb86fc' : '#6200ee',
      },
      secondary: {
        main: isDarkMode ? '#03dac6' : '#03dac6',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/backend/generate_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const videoBlob = await response.blob();
      setVideoBlob(videoBlob);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 4,
          background: isDarkMode
            ? 'linear-gradient(135deg, #1a237e 0%, #311b92 50%, #4a148c 100%)'
            : 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #9fa8da 100%)',
          transition: theme.transitions.create(['background'], {
            duration: theme.transitions.duration.complex,
          }),
        }}
      >
        <Paper
          elevation={24}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            borderRadius: 4,
            overflow: 'hidden',
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.complex,
            }),
          }}
        >
          <Box
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Typography variant="h3" align="center" color="primary" gutterBottom>
              AI Video Generator
            </Typography>
            
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                backgroundColor: 'background.default',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              {videoBlob ? (
                <Fade in={true} timeout={1000}>
                  <video
                    src={URL.createObjectURL(videoBlob)}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </Fade>
              ) : (
                <Fade in={true} timeout={1000}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <MovieIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary" align="center">
                      {isLoading ? "Generating your video..." : "Your video will appear here"}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
              <TextField
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate..."
                variant="outlined"
                sx={{ flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isLoading}
                sx={{
                  minWidth: '56px',
                  height: '56px',
                  p: 0,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}