import { supabase } from '../supabase';
import Papa from 'papaparse';

// Upload CSV file to Supabase Storage
export const uploadCSVToStorage = async (file) => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `earthquake-bucket/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('earthquake-bucket')
      .upload(filePath, file);
    
    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('earthquake-bucket')
      .getPublicUrl(filePath);
    
    return {
      fileName: fileName,
      filePath: filePath,
      publicUrl: urlData.publicUrl,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
    
  } catch (error) {
    throw error;
  }
};

// Parse CSV content and extract earthquake data
export const parseCSVContent = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
    
  } catch (error) {
    throw error;
  }
};

// Process CSV data and add earthquakes to database
export const processCSVData = async (csvData) => {
  try {
    const processedData = [];
    const errors = [];
    
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const rowNumber = i + 2; // +2 because CSV has header and we're 0-indexed
      
      try {
        // Validate required fields
        if (!row.date || !row.magnitude || !row.location || !row.depth || !row.latitude || !row.longitude) {
          errors.push(`Row ${rowNumber}: Missing required fields`);
          continue;
        }
        
        // Parse and validate data
        const earthquakeData = {
          date: row.date,
          magnitude: parseFloat(row.magnitude),
          location: row.location,
          depth: parseFloat(row.depth),
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          description: row.description || '',
          timestamp: new Date(row.date).toISOString()
        };
        
        // Validate numeric values
        if (isNaN(earthquakeData.magnitude) || isNaN(earthquakeData.depth) || 
            isNaN(earthquakeData.magnitude) || isNaN(earthquakeData.longitude)) {
          errors.push(`Row ${rowNumber}: Invalid numeric values`);
          continue;
        }
        
        // Validate coordinate ranges
        if (earthquakeData.latitude < -90 || earthquakeData.latitude > 90) {
          errors.push(`Row ${rowNumber}: Latitude must be between -90 and 90`);
          continue;
        }
        
        if (earthquakeData.longitude < -180 || earthquakeData.longitude > 180) {
          errors.push(`Row ${rowNumber}: Longitude must be between -180 and 180`);
          continue;
        }
        
        processedData.push(earthquakeData);
        
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    }
    
    return {
      validData: processedData,
      errors: errors,
      totalRows: csvData.length
    };
    
  } catch (error) {
    throw error;
  }
};

// Upload CSV and process data in one function
export const uploadAndProcessCSV = async (file) => {
  try {
    // Step 1: Upload to storage
    const storageResult = await uploadCSVToStorage(file);
    
    // Step 2: Parse CSV content
    const csvData = await parseCSVContent(file);
    
    // Step 3: Process and validate data
    const processedResult = await processCSVData(csvData);
    
    return {
      storage: storageResult,
      parsing: {
        totalRows: csvData.length,
        validRows: processedResult.validData.length,
        errorRows: processedResult.errors.length
      },
      data: processedResult.validData,
      errors: processedResult.errors
    };
    
  } catch (error) {
    throw error;
  }
};
