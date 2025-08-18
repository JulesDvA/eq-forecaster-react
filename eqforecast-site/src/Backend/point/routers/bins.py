from fastapi import APIRouter, HTTPException
from app.models import BinInfo
from typing import List

router = APIRouter(prefix="/bins", tags=["bins"])

# Mock BIN data - replace with database queries
BINS_DATA = [
    {
        "bin_id": 1,
        "name": "Northern Luzon",
        "risk_level": "low",
        "coordinates": [[18.5, 120.5], [18.5, 122.0], [16.5, 122.0], [16.5, 120.5]]
    },
    {
        "bin_id": 2,
        "name": "Central Luzon", 
        "risk_level": "high",
        "coordinates": [[16.5, 120.0], [16.5, 122.5], [14.0, 122.5], [14.0, 120.0]]
    },
    {
        "bin_id": 3,
        "name": "Southern Luzon",
        "risk_level": "medium", 
        "coordinates": [[14.0, 120.5], [14.0, 124.0], [12.0, 124.0], [12.0, 120.5]]
    },
    {
        "bin_id": 4,
        "name": "Mindanao",
        "risk_level": "attention",
        "coordinates": [[10.0, 121.0], [10.0, 126.5], [5.0, 126.5], [5.0, 121.0]]
    }
]

@router.get("/", response_model=List[BinInfo])
async def get_all_bins():
    """Get all BIN regions information"""
    return [BinInfo(**bin_data) for bin_data in BINS_DATA]

@router.get("/{bin_id}", response_model=BinInfo)
async def get_bin_by_id(bin_id: int):
    """Get specific BIN information by ID"""
    bin_data = next((bin for bin in BINS_DATA if bin["bin_id"] == bin_id), None)
    if not bin_data:
        raise HTTPException(status_code=404, detail="BIN not found")
    return BinInfo(**bin_data)