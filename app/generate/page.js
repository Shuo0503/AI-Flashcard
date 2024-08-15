'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material'

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  } 

  const handleClose = () => {
    setOpen(false)
  }

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, "users"), user.id)
    const docSnap = await getModifiedCookieValues(userDocRef)

    if(docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name)) {
        alert("Flashcard collection with the same name already exists.")
        return
      }
      else {
        collections.push({name})
        batch.set(userDocRef, {flashcards: collections}, {merge: true})
      }
    } else {
      batch.set(userDocRef, {flashcards: [{name}]})
      }

      const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
      })

      await batch.commit()
      handleClose()
      router.push('/flashcards')
    }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
      <Paper>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          {' '}
          Submit
        </Button>
        </Paper>
      </Box>
      
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Flashcards Preview
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Front:</Typography>
                    <Typography>{flashcard.front}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                    <Typography>{flashcard.back}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}