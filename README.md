# Blackcoffer Dashboard

A data analytics dashboard built with Next.js, React, and Chart.js. It provides interactive filtering and visualization of data using various chart types.

## Features
- Dynamic filters for multiple fields (year, topic, sector, region, country, city, PEST, source, SWOT)
- Interactive charts: Bar, Line, Pie, Scatter, Bubble, Map
- Data fetched from a backend API with robust error handling
- Responsive and modern UI

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd for\ Blackcoffer/blackcoffer-dashboard
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard in your browser.

### Project Structure
- `src/components/filters/FilterPanel.tsx`: Filter panel for selecting data filters
- `src/components/charts/`: Chart components (Bar, Line, Pie, Scatter, Bubble, Map)
- `src/app/api/`: API routes for data and filters
- `public/jsondata.json`: Example data file

### Notes
- Ensure MongoDB is running if using the database features.
- To seed data, use the POST endpoint `/api/data`.

## License
MIT
