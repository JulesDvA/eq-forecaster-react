# Precomputed Predictions System

This directory contains scripts for generating earthquake predictions offline and serving them to the frontend without requiring live ML inference.

## Overview

Instead of running ML models in real-time when the frontend requests data, this system:
1. **Generates predictions offline** using the ML forecasting models
2. **Saves predictions to JSON files** in `data/predictions/`
3. **Serves precomputed data** via the same API endpoints
4. **Can be scheduled** to run daily/hourly to keep predictions fresh

## Files

- `generate_predictions.py` - Main script to generate predictions for specific years
- `test_prediction_generator.py` - Test script to verify the system works
- `README.md` - This documentation file

## Usage

### Generate Predictions

Generate predictions for specific years:

```bash
# Generate predictions for 2024
python scripts/generate_predictions.py --years 2024

# Generate predictions for multiple years
python scripts/generate_predictions.py --years 2024,2025,2026

# Generate predictions with custom data path
python scripts/generate_predictions.py --years 2024 --data-path /path/to/earthquake_data.csv
```

### Test the System

Test that the prediction generator works correctly:

```bash
python scripts/test_prediction_generator.py
```

### Schedule Daily Updates

To keep predictions fresh, you can schedule the script to run daily:

**Windows (Task Scheduler):**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to Daily
4. Set action to run: `python scripts/generate_predictions.py --years 2024,2025,2026`

**Linux/macOS (cron):**
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /path/to/backend && python scripts/generate_predictions.py --years 2024,2025,2026
```

## Output

Predictions are saved to `data/predictions/` as JSON files:

- `predictions_2024.json` - Predictions for 2024
- `predictions_2025.json` - Predictions for 2025
- etc.

Each file contains:
- Year and generation timestamp
- 24 spatial bins with coordinates
- Predicted earthquake frequency per bin
- Predicted maximum magnitude per bin
- Historical statistics for comparison
- Confidence scores

## API Integration

The frontend continues to use the same API endpoints:
- `GET /api/spatial/available-years` - Lists available prediction years
- `GET /api/spatial/bins?year=2024` - Gets predictions for a specific year

The API now serves precomputed data instead of running live inference.

## Benefits

- **Fast response times** - No ML model loading or inference delays
- **Reliable** - No server crashes during ML processing
- **Scalable** - Can serve many users simultaneously
- **Cost-effective** - ML models run once, results served many times
- **Offline capable** - Predictions work even if ML models are unavailable

## Troubleshooting

### No predictions available
- Run `generate_predictions.py` first
- Check that the data file exists
- Verify the script has write permissions to `data/predictions/`

### Import errors
- Ensure you're in the backend directory
- Check that all required services are available
- Verify Python path includes the backend directory

### Data format issues
- Ensure earthquake data CSV has required columns
- Check that coordinates are in the expected format
- Verify the data preprocessing pipeline works

