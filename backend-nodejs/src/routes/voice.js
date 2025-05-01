const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    // Return transcribed text in the format frontend expects
    res.json({ 
      status: 'success',
      data: {
        text: "This is a mock transcription response. The actual transcription will be implemented with Deepgram."
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    // Return structured EHR data
    res.json({ 
      status: 'success',
      data: {
        data: {
          report: {
            symptoms: "Patient reports symptoms based on transcribed text",
            diagnosis: "Initial diagnosis based on symptoms",
            treatment: "Recommended treatment plan",
            OTHERS: "Additional observations and notes"
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 