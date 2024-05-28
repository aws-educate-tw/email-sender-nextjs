// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiRequestWithFile = NextApiRequest & {
  files: {
    file: FormidableFile | FormidableFile[];
  };
  fields: {
    filename: string | string[];
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing form data', error: err.message });
        return;
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const filename = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;

      if (!file || !filename) {
        res.status(400).json({ message: 'Missing file or filename' });
        return;
      }

      try {
        const fileData = await readFileAsync(file.filepath);
        
        const response = await fetch('https://qfejh1j35e.execute-api.ap-northeast-1.amazonaws.com/dev/upload-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'filename': filename,
          },
          body: fileData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload file: ${response.statusText}`);
        }

        const result = await response.json();
        res.status(200).json({ 
          status: result.status,
          message: result.message,
          request_id: result.request_id,
          timestamp: result.timestamp,
          S3URL: result.S3URL 
        });
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to upload file', error: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}