#!/usr/bin/env python3
"""
Simple script to create 24 bins (B0-B23) and populate annual_forecasts table
"""

from supabase import create_client, Client
import os
import uuid
from datetime import datetime
import random

# --- CONFIG: Supabase connection ---
SUPABASE_URL = "https://rettsbvizhuvyvmiiyed.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldHRzYnZpemh1dnl2bWlpeWVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE0MDkxMywiZXhwIjoyMDcxNzE2OTEzfQ.-PlwB2CwdzOZfFJAe-Uh-Gc5ixaWTSb3i-Pqhtlc0DE"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_all_bins():
    """Create all 24 bins from B0 to B23"""
    print("🗺️  Creating all 24 bins from B0 to B23...")
    
    bins_data = []
    
    for i in range(24):  # 0 to 23
        # Generate realistic coordinates around California
        lat = 32.0 + (i * 0.2)  # Spread latitudes from 32.0 to 36.6
        lon = -116.0 + (i * 0.15)  # Spread longitudes from -116.0 to -112.4
        area = 750.0 + (i * 50)  # Vary areas from 750 to 1900
        
        bin_data = {
            "id": f"B{i}",
            "center_lat": round(lat, 1),
            "center_lon": round(lon, 1),
            "area": area,
            "created_at": datetime.utcnow().isoformat()
        }
        bins_data.append(bin_data)
        print(f"   📍 Creating bin B{i}: ({lat}, {lon}) - area: {area}")
    
    try:
        # Insert all bins
        response = supabase.table("bins").insert(bins_data).execute()
        print(f"✅ Successfully created {len(bins_data)} bins")
        return True
    except Exception as e:
        print(f"❌ Error creating bins: {e}")
        return False

def populate_annual_forecasts_2025():
    """Populate the annual_forecasts table with forecasts for all 24 bins in 2025"""
    print("🔮 Creating forecasts for all 24 bins in 2025...")
    
    # Sample forecast data for 2025 only
    models = ["LSTM_v1", "LSTM_v2", "Attention_LSTM", "Enhanced_LSTM"]
    bin_ids = [f"B{i}" for i in range(24)]  # B0, B1, B2, ..., B23
    
    # Debug: Show what we're creating
    print(f"📊 Creating forecasts for:")
    print(f"   - Models: {models}")
    print(f"   - Bins: {bin_ids}")
    print(f"   - Year: 2025")
    print(f"   - Total forecasts to create: {len(bin_ids)}")
    
    forecasts_data = []
    
    for i, bin_id in enumerate(bin_ids):
        # Use a different model for each bin to create variety
        model = models[i % len(models)]
        forecast = {
            "id": str(uuid.uuid4()),
            "model_name": model,
            "bin_id": bin_id,
            "year": 2025,
            "pred_frequency": round(random.uniform(2.0, 8.0), 2),
            "pred_max_magnitude": round(random.uniform(5.0, 7.5), 1),
            "run_id": f"run_{model}_2025_{bin_id}",
            "created_at": datetime.utcnow().isoformat()
        }
        forecasts_data.append(forecast)
        print(f"   📝 Created forecast: {model} for {bin_id} in 2025")
    
    try:
        # Insert forecasts data
        response = supabase.table("annual_forecasts").insert(forecasts_data).execute()
        print(f"\n✅ Successfully inserted {len(forecasts_data)} forecasts for 2025")
        return True
    except Exception as e:
        print(f"❌ Error inserting forecasts: {e}")
        return False

def main():
    """Main function to create 24 bins and populate annual_forecasts table"""
    print("🚀 Starting table population...")
    print("=" * 50)
    
    # Create all 24 bins fresh
    bins_success = create_all_bins()
    
    if bins_success:
        print("-" * 50)
        # Then populate annual_forecasts table for all 24 bins
        forecasts_success = populate_annual_forecasts_2025()
        
        if forecasts_success:
            print("=" * 50)
            print("🎉 Successfully created 24 bins and forecasts for 2025!")
            print("💡 You can now test your frontend table display!")
        else:
            print("❌ Failed to populate annual_forecasts table")
    else:
        print("❌ Failed to create bins")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
