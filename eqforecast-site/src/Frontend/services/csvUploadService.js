import { supabase } from '../supabase';
import Papa from 'papaparse';

// Upload CSV file to Supabase Storage
export const uploadCSVToStorage = async (file) => {
  try {
    console.log('📁 Uploading CSV to Supabase Storage:', file.name);
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `earthquake-bucket/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('earthquake-bucket')
      .upload(filePath, file);
    
    if (error) {
      console.error('❌ Storage upload error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    console.log('✅ CSV uploaded to storage successfully:', data.path);
    
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
    console.error('❌ Error in uploadCSVToStorage:', error);
    throw error;
  }
};

// Parse CSV content and extract earthquake data
export const parseCSVContent = async (file) => {
  try {
    console.log('📊 Parsing CSV content...');
    
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('✅ CSV parsed successfully:', results.data.length, 'rows');
          resolve(results.data);
        },
        error: (error) => {
          console.error('❌ CSV parsing error:', error);
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error in parseCSVContent:', error);
    throw error;
  }
};

// Process CSV data and add earthquakes to database
export const processCSVData = async (csvData) => {
  try {
    console.log('🔄 Processing CSV data...');
    
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
            isNaN(earthquakeData.latitude) || isNaN(earthquakeData.longitude)) {
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
    
    console.log(`✅ Processed ${processedData.length} valid rows, ${errors.length} errors`);
    
    return {
      validData: processedData,
      errors: errors,
      totalRows: csvData.length
    };
    
  } catch (error) {
    console.error('❌ Error in processCSVData:', error);
    throw error;
  }
};

// Upload CSV and process data in one function
export const uploadAndProcessCSV = async (file) => {
  try {
    console.log('🚀 Starting CSV upload and processing...');
    
    // Step 1: Upload to storage
    const storageResult = await uploadCSVToStorage(file);
    console.log('📁 File uploaded to storage:', storageResult.fileName);
    
    // Step 2: Parse CSV content
    const csvData = await parseCSVContent(file);
    console.log('📊 CSV parsed:', csvData.length, 'rows');
    
    // Step 3: Process and validate data
    const processedResult = await processCSVData(csvData);
    console.log('✅ Data processed:', processedResult.validData.length, 'valid rows');
    
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
    console.error('❌ Error in uploadAndProcessCSV:', error);
    throw error;
  }
};
