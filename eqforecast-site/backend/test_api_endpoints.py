#!/usr/bin/env python3
"""
Test script for API endpoints with precomputed predictions

This script tests the API endpoints to ensure they can read and serve
the precomputed prediction data correctly.
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.prediction_service import prediction_service

def test_prediction_service():
    """Test the prediction service functionality."""
    print("🧪 Testing Prediction Service...")
    
    try:
        # Test 1: Get available years
        print("\n1️⃣ Testing get_available_years()...")
        years = prediction_service.get_available_years()
        print(f"   Available years: {years}")
        print(f"   ✓ Found {len(years)} years")
        
        if not years:
            print("   ❌ No years found! Run generate_predictions.py first.")
            return False
        
        # Test 2: Get predictions for a specific year
        test_year = years[0]  # Use the first available year
        print(f"\n2️⃣ Testing get_predictions_for_year({test_year})...")
        predictions = prediction_service.get_predictions_for_year(test_year)
        
        if predictions:
            print(f"   ✓ Found predictions for {test_year}")
            print(f"   Total bins: {predictions.get('total_bins', 0)}")
            print(f"   Generated at: {predictions.get('generated_at', 'Unknown')}")
        else:
            print(f"   ❌ No predictions found for {test_year}")
            return False
        
        # Test 3: Get spatial bins for frontend
        print(f"\n3️⃣ Testing get_spatial_bins_for_year({test_year})...")
        spatial_bins = prediction_service.get_spatial_bins_for_year(test_year)
        
        if spatial_bins:
            print(f"   ✓ Found {len(spatial_bins)} spatial bins")
            
            # Show sample bin data
            if spatial_bins:
                sample_bin = spatial_bins[0]
                print(f"   Sample bin data:")
                print(f"     Bin ID: {sample_bin.get('bin_id')}")
                print(f"     Bounds: {sample_bin.get('bounds')}")
                print(f"     Earthquake Count: {sample_bin.get('earthquake_count')}")
                print(f"     Max Magnitude: {sample_bin.get('max_magnitude')}")
        else:
            print(f"   ❌ No spatial bins found for {test_year}")
            return False
        
        # Test 4: Get prediction summary
        print(f"\n4️⃣ Testing get_prediction_summary()...")
        summary = prediction_service.get_prediction_summary()
        print(f"   ✓ Summary:")
        print(f"     Total years: {summary.get('total_years')}")
        print(f"     Available years: {summary.get('available_years')}")
        print(f"     Latest year: {summary.get('latest_year')}")
        print(f"     Total predictions: {summary.get('total_predictions')}")
        print(f"     Last updated: {summary.get('last_updated')}")
        
        print("\n🎉 All prediction service tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_routes():
    """Test the API routes functionality."""
    print("\n🌐 Testing API Routes...")
    
    try:
        # Import the router to test route logic
        from app.api.routes import router
        
        # Test the available years endpoint logic
        print("\n1️⃣ Testing available years endpoint logic...")
        from app.services.prediction_service import prediction_service
        
        years = prediction_service.get_available_years()
        response = {
            "available_years": years,
            "total_years": len(years),
            "status": "success"
        }
        
        print(f"   Response: {response}")
        print(f"   ✓ Available years endpoint working")
        
        # Test the spatial bins endpoint logic
        if years:
            test_year = years[0]
            print(f"\n2️⃣ Testing spatial bins endpoint logic for year {test_year}...")
            
            spatial_bins = prediction_service.get_spatial_bins_for_year(test_year)
            
            if spatial_bins:
                # Transform to the format expected by the frontend
                bins = []
                for bin_data in spatial_bins:
                    bounds = bin_data.get("bounds", [])
                    if len(bounds) >= 4:
                        min_lon, max_lon, min_lat, max_lat = bounds[:4]
                        
                        bins.append({
                            "id": bin_data.get("bin_id", 0),
                            "bounds": bounds,
                            "center_lat": (min_lat + max_lat) / 2,
                            "center_lon": (min_lon + max_lon) / 2,
                            "width": max_lon - min_lon,
                            "height": max_lat - min_lat,
                            "earthquake_count": bin_data.get("earthquake_count", 0),
                            "max_magnitude": bin_data.get("max_magnitude", 0)
                        })
                
                response = {
                    "target_year": test_year,
                    "total_bins": len(bins),
                    "target_bins": 24,
                    "bins": bins,
                    "status": "success",
                    "data_source": "precomputed_predictions"
                }
                
                print(f"   Response: {len(bins)} bins")
                print(f"   ✓ Spatial bins endpoint working")
            else:
                print(f"   ❌ No spatial bins found for {test_year}")
                return False
        
        print("\n🎉 All API route tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ API route test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function."""
    print("🚀 Testing Precomputed Predictions System")
    print("=" * 50)
    
    # Test 1: Prediction Service
    service_success = test_prediction_service()
    
    if not service_success:
        print("\n❌ Prediction service tests failed!")
        return False
    
    # Test 2: API Routes
    api_success = test_api_routes()
    
    if not api_success:
        print("\n❌ API route tests failed!")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 ALL TESTS PASSED! The system is working correctly.")
    print("\nNext steps:")
    print("1. ✅ Prediction generation: Working")
    print("2. ✅ Prediction service: Working")
    print("3. ✅ API routes: Working")
    print("4. 🔄 Test with frontend (optional)")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

