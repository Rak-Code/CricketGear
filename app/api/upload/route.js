import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: 'dsuikh3of',
  api_key: '166677822738224',
  api_secret: 'NUBaKfEG6KGaaa-cttTOJ6CEDTY',
});

// Optional Firebase Admin initialization - commented out for now
// Uncommenting requires proper Firebase Admin setup with credentials
/*
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: "cricketgear-3cd94",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-xnwi6@cricketgear-3cd94.iam.gserviceaccount.com",
        // Replace the private key string newlines
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}
*/

export async function POST(request) {
  console.log("Upload API route called with POST");
  
  try {
    // 1. Parse the multipart form data
    const formData = await request.formData();
    console.log("FormData received");
    
    const file = formData.get('file');
    const authToken = formData.get('authToken');
    
    console.log("File received:", file ? {
      name: file.name,
      type: file.type,
      size: file.size,
    } : "No file");
    
    // 2. Authenticate the user (optional)
    // For now, skipping authentication to simplify troubleshooting
    // You can enable this later when core functionality is working
    /*
    if (authToken) {
      try {
        const decodedToken = await getAuth().verifyIdToken(authToken);
        console.log("User authenticated:", decodedToken.uid);
      } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      console.log("No auth token provided");
    }
    */
    
    // 3. Validate the file
    if (!file) {
      console.error("No file provided in request");
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // 4. Convert the file to a buffer (for Cloudinary)
    console.log("Converting file to buffer");
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer created, size:", buffer.length);
    
    // 5. Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    console.log("Generated filename:", filename);
    
    // 6. Upload to Cloudinary
    console.log("Starting Cloudinary upload");
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cricket-gear',
          public_id: filename.split('.')[0], // remove extension
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", {
              public_id: result.public_id,
              format: result.format,
              url: result.secure_url
            });
            resolve(result);
          }
        }
      );
      
      // Write the buffer to the upload stream
      try {
        uploadStream.end(buffer);
      } catch (streamError) {
        console.error("Error writing to upload stream:", streamError);
        reject(streamError);
      }
    });
    
    // 7. Return the result with secure URL and public ID
    console.log("Returning successful response");
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      {
        error: error.message || 'Error uploading image',
        type: error.name || 'UnknownError',
        code: error.code || 'unknown_error'
      },
      { status: 500 }
    );
  }
}

// To handle DELETE requests for removing images
export async function DELETE(request) {
  console.log("Delete API route called");
  
  try {
    const body = await request.json();
    const { publicId } = body;
    
    console.log("Requested deletion of publicId:", publicId);
    
    if (!publicId) {
      console.error("No publicId provided in request");
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
    }
    
    // Delete from Cloudinary
    console.log("Calling Cloudinary delete API");
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    
    return NextResponse.json(
      {
        error: error.message || 'Error deleting image',
        type: error.name || 'UnknownError',
        code: error.code || 'unknown_error'
      },
      { status: 500 }
    );
  }
} 