#!/usr/bin/env python3
"""
Test script for the prediction generator

This script tests the prediction generator to ensure it works correctly.
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from scripts.generate_predictions import PredictionGenerator

def test_prediction_generator():
    """Test the prediction generator functionality."""
    try:
        print("Testing Prediction Generator...")
        
        # Initialize the generator
        generator = PredictionGenerator()
        print(f"✓ Initialized with data path: {generator.data_path}")
        print(f"✓ Predictions directory: {generator.predictions_dir}")
        
        # Test data loading
        print("\nTesting data loading...")
        df = generator.load_and_process_data()
        print(f"✓ Loaded {len(df)} earthquake records")
        
        # Test spatial bin generation
        print("\nTesting spatial bin generation...")
        bins = generator.generate_spatial_bins(df)
        print(f"✓ Generated {len(bins)} spatial bins")
        
        # Test prediction generation for a test year
        test_year = 2024
        print(f"\nTesting prediction generation for year {test_year}...")
        predictions = generator.generate_predictions_for_year(test_year, bins)
        print(f"✓ Generated predictions for {len(predictions['predictions'])} bins")
        
        # Test saving predictions
        print("\nTesting prediction saving...")
        filepath = generator.save_predictions(predictions, test_year)
        print(f"✓ Saved predictions to: {filepath}")
        
        # Verify the file was created
        if filepath.exists():
            print(f"✓ File exists and is {filepath.stat().st_size} bytes")
        else:
            print("✗ File was not created!")
            return False
        
        print("\n🎉 All tests passed! The prediction generator is working correctly.")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_prediction_generator()
    sys.exit(0 if success else 1)

