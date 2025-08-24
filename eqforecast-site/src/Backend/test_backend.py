#!/usr/bin/env python3
"""
Simple script to test if the backend is working
"""
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🔍 Testing Backend Connectivity...")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        "/health",
        "/api/status", 
        "/api/regions",
        "/api/model-info"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"Testing {endpoint}...")
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            
            if response.status_code == 200:
                print(f"✅ {endpoint} - SUCCESS")
                if endpoint == "/health":
                    data = response.json()
                    print(f"   Status: {data.get('status', 'unknown')}")
            else:
                print(f"❌ {endpoint} - FAILED (Status: {response.status_code})")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {endpoint} - CONNECTION FAILED (Backend not running)")
            break
        except requests.exceptions.Timeout:
            print(f"❌ {endpoint} - TIMEOUT")
        except Exception as e:
            print(f"❌ {endpoint} - ERROR: {str(e)}")
    
    # Test prediction endpoint
    print("\n🎯 Testing Prediction Endpoint...")
    try:
        prediction_data = {
            "region": "NCR",
            "prediction_days": 30,
            "include_confidence": True
        }
        
        response = requests.post(
            f"{base_url}/api/predict", 
            json=prediction_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Prediction endpoint - SUCCESS")
            data = response.json()
            print(f"   Predicted magnitude: {data.get('predicted_magnitude', 'N/A')}")
            print(f"   Region: {data.get('region', 'N/A')}")
        else:
            print(f"❌ Prediction endpoint - FAILED (Status: {response.status_code})")
            
    except Exception as e:
        print(f"❌ Prediction endpoint - ERROR: {str(e)}")
    
    print("\n" + "=" * 50)
    print("✅ Backend test complete!")
    print("If you see SUCCESS messages, your backend is working!")

if __name__ == "__main__":
    test_backend()
