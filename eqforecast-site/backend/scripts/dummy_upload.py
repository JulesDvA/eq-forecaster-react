# seed_annual_forecasts.py
from supabase import create_client, Client
import os
import uuid
from datetime import datetime
import os


# --- CONFIG: replace these ---
SUPABASE_URL = "https://rettsbvizhuvyvmiiyed.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldHRzYnZpemh1dnl2bWlpeWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDA5MTMsImV4cCI6MjA3MTcxNjkxM30.NYdhgPFbpW7pdzHoa7njIt0mYMm4LBsVYEtiOF5mz8A"  # use service_role key for server-side scripts


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Sample data to insert
data = {
    "id": str(uuid.uuid4()),
    "model_name": "example_model",
    "bin_id": "bin_001",
    "year": 2025,
    "pred_frequency": 3.14,
    "pred_max_magnitude": 6.9,
    "run_id": "run_abc_001",
    "created_at": datetime.utcnow().isoformat()  # ensure UTC
}

# Insert data into the "annual_forecasts" table
response = supabase.table("annual_forecasts").insert(data).execute()

# Print response from Supabase
print(response)