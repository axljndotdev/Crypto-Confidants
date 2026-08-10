# Crypto Confidant

Sovereign marketing & educational platform offering global education on crypto self-custody, cold storage, financial portability, and confidential consultation referral paths.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)

## Getting Started Locally

1. **Extract / Clone the repository**
   Make sure you have downloaded all project files into a folder on your computer.

2. **Install Dependencies**
   Open your terminal in the project directory and run:
   ```bash
   npm install
   ```

3. **Start the Development Server**
   Run:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the URL output in your terminal).

4. **Build for Production**
   To generate production static assets:
   ```bash
   npm run build
   ```
   The production build will be generated in the `dist/` directory.

5. **Preview Production Build Locally**
   ```bash
   npm run preview
   ```

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
