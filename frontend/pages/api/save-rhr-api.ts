//API process to save ehr
import type { NextApiRequest, NextApiResponse } from 'next';
import { json } from 'stream/consumers';
//use localstorage

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            status: "error",
            code: 405,
            message: "Method not allowed",
            data: null
          });
    }
    const { structuredEhr } = req.body;
    if (!structuredEhr || !structuredEhr.report) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "No structed EHR data",
            data: null,
        });
    
    }
    try {
        console.log('Debug save EHR data:',JSON.stringify(structuredEhr, null, 2)); // Log the received data
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Structured EHR data saved successfully",
            data: structuredEhr
          });
    } catch (error) {
        console.error('Error saving EHR data:', error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal server error",
            data: null,
        });
    }}
