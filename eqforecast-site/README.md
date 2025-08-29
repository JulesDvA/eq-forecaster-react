# Earthquake Forecasting React Application

A React-based web application for displaying earthquake forecasts using Supabase as the backend database and Leaflet.js for interactive mapping.

## Features

- Interactive earthquake forecast visualization on maps
- Year-based forecast selection (1960-2025)
- Risk level categorization based on magnitude predictions
- Responsive design with modern UI components
- Real-time data from Supabase database

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd eqforecast-site
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your Supabase credentials in `.env`:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anonymous_key_here
   ```

   **Important:** Use your Supabase anonymous/public key, NOT the service role key!

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
eqforecast-site/
├── src/
│   ├── Frontend/
│   │   ├── Pages/          # React components
│   │   ├── Css/            # Stylesheets
│   │   ├── services/       # API services
│   │   └── Pics/           # Images
│   └── main.jsx            # Entry point
├── backend/                 # Backend scripts
├── .env                     # Environment variables (not in Git)
├── .env.example            # Environment template
└── vite.config.js          # Vite configuration
```

## Security Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- **Use anonymous keys** for frontend applications
- **Service role keys** should only be used in secure backend environments

## Technologies Used

- **Frontend:** React, Vite, Leaflet.js
- **Backend:** Supabase (Database + API)
- **Styling:** CSS3 with custom components
- **Build Tool:** Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]
