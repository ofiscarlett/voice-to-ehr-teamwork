//set up Api server to process raw text to backend 
import type {NextApiRequest, NextApiResponse  } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
    const { text } = req.body;
    console.log("Received text:", text); // Log the received text
    if (!text || text.length < 10) {
        console.error("Text is required or too short"); // Log the error
        // Return a 400 Bad Request response if the text is not provided or too short
      return res.status(400).json({ message: "Text is required or too short" });
    }
    try {
      // Process the text here, e.g., save it to a database or perform some analysis
      console.log("Debug processing text:", text); // Log the text being processed

      const response = await fetch("http://localhost:5000/api/analysis/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const json = await response.json();
        console.log('Debug API ：', json);
      } else {
        console.warn('Debug error API error', response.status);
      }
      
       if (!response.ok) {
        throw new Error('Analysis service failed');
      }
        const data = await response.json();
        console.log("Debug received data:", data); // Log the received data
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Analysis completed',
            data,
          });
          
    } catch (error) {
        console.error('Error processing text:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal server error',
            data: null,
          });
          
        }   
        
}