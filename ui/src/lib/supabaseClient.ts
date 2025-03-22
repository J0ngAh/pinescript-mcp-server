/**
 * Supabase Client Configuration
 * 
 * This module handles Supabase client initialization with proper
 * environment variable handling and graceful fallbacks for development.
 */

import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with proper type checking
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  // For client-side, use Next.js public env vars
  if (typeof window !== 'undefined') {
    // @ts-ignore - Next.js injects these variables
    return window.__NEXT_DATA__?.props?.pageProps?.env?.[key];
  }
  return undefined;
};

// Get environment variables with safe fallbacks
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create client only if valid credentials exist
const createSupabaseClient = () => {
  // Only try to create a client if both URL and key are present and valid
  if (typeof supabaseUrl === 'string' && 
      supabaseUrl.startsWith('http') && 
      typeof supabaseKey === 'string' && 
      supabaseKey.length > 0) {
    try {
      return createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      return null;
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Supabase credentials not found in environment variables. ' +
      'Using mock implementation. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables for proper configuration.'
    );
  }
  
  return null;
};

// Initialize the client (or set to null if not configured)
const supabaseClient = createSupabaseClient();

// Define types that match what we'd expect from Supabase
export interface UploadLogResponse {
  id: string;
  file_name: string;
  created_at: string;
  error?: boolean;
}

/**
 * Logs a file upload with graceful fallback to mock implementation
 * 
 * @param fileName - Name of the uploaded file
 * @param fileSize - Size of the file in bytes
 * @param uploadType - Type of upload (e.g., 'trade_results', 'historical_data')
 * @param fileType - MIME type of the file
 * @param metadata - Additional metadata about the upload
 * @returns Promise with the result or a mock response
 */
export async function logFileUpload(
  fileName: string,
  fileSize: number,
  uploadType: 'trade_results' | 'historical_data' | 'strategy_code',
  fileType: string = 'text/csv',
  metadata: Record<string, any> = {}
): Promise<UploadLogResponse> {
  try {
    // Log the upload information (debug mode only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('File upload log:', {
        fileName,
        fileSize,
        uploadType,
        fileType,
        timestamp: new Date().toISOString(),
      });
    }
    
    // If we have a valid Supabase client, use it
    if (supabaseClient) {
      try {
        // Real Supabase implementation
        // const { data, error } = await supabaseClient
        //   .from('file_uploads')
        //   .insert([
        //     {
        //       file_name: fileName,
        //       file_size: fileSize,
        //       upload_type: uploadType,
        //       file_type: fileType,
        //       metadata,
        //     },
        //   ])
        //   .select()
        //   .single();
        
        // if (error) throw error;
        // return data as UploadLogResponse;
        
        // Mock the response for now
        return {
          id: `upload_${Date.now()}`,
          file_name: fileName,
          created_at: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Supabase operation failed:', error);
        throw error;
      }
    }
    
    // Mock implementation for development or when Supabase is not configured
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    return {
      id: `upload_mock_${Date.now()}`,
      file_name: fileName,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error logging file upload:', error);
    
    // Return a graceful error response
    return {
      id: `upload_error_${Date.now()}`,
      file_name: fileName,
      created_at: new Date().toISOString(),
      error: true
    };
  }
}

/**
 * Check if Supabase is available and properly configured
 * 
 * @returns Promise<boolean> indicating if Supabase is available
 */
export async function isSupabaseAvailable(): Promise<boolean> {
  return Promise.resolve(supabaseClient !== null);
}

export default supabaseClient; 