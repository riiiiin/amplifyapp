import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createNote } from './graphql/mutations'
import { listNotes } from './graphql/queries'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [Notes, setNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchNotes() {
    try {
      const NoteData = await API.graphql(graphqlOperation(listNotes))
      const Notes = NoteData.data.listNotes.items
      setNotes(Notes)
    } catch (err) { console.log('error fetching Notes') }
  }

  async function addNote() {
    try {
      if (!formState.name || !formState.description) return
      const Note = { ...formState }
      setNotes([...Notes, Note])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createNote, {input: Note}))
    } catch (err) {
      console.log('error creating Note:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Notes</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addNote}>Create Note</button>
      {
        Notes.map((Note, index) => (
          <div key={Note.id ? Note.id : index} style={styles.Note}>
            <p style={styles.NoteName}>{Note.name}</p>
            <p style={styles.NoteDescription}>{Note.description}</p>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  Note: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  NoteName: { fontSize: 20, fontWeight: 'bold' },
  NoteDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App