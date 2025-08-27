# LinkedIn Post Bot

A TypeScript-based LinkedIn automation bot that generates AI-powered posts using Google's Gemini API and posts them to LinkedIn automatically.

## Features

- 🤖 AI-powered post generation using Google Gemini
- 📅 Automated posting with cron scheduling
- 🔄 Hot reloading during development with nodemon
- 📝 TypeScript for better type safety and developer experience
- ⚡ ES modules support

## Project Structure

```
├── src/
│   ├── main.ts              # Main application entry point
│   ├── generatePost.ts      # AI post generation functionality
│   └── postToLinkedIn.ts    # LinkedIn API integration
├── dist/                    # Compiled JavaScript output
├── tsconfig.json           # TypeScript configuration
├── nodemon.json            # Nodemon configuration for development
└── package.json            # Dependencies and scripts
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- LinkedIn API credentials
- Google Gemini API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GEMINI_API_KEY="GEMINI API KEY"
LINKEDIN_CLIENT_ID="CLIENT ID OF YOUR LINKED_IN DASHBOARD APP"
LINKEDIN_CLIENT_SECRET="CLIENT SECRET OF A LINKED_IN DASHBOARD APP"
LINKEDIN_ACCESS_TOKEN="YOUR LINKED_IN ACCOUNT ACCESS TOKEN"
LINKEDIN_PERSON_URN="YOUR LINKED_IN ACCOUNT URN ID"
```
- CLIENT_ID & CLIENT_SECRET    - can be get when you create an App in linked developers page
- ACCESS_TOKEN                 - Generate it from your App's Auth settings page for your account
- PERSON_URN                   - After generating access token hit a req on linked_in user-info API.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
Run the bot in development mode with hot reloading:
```bash
npm run dev
```

### Production Build
Build the TypeScript code to JavaScript:
```bash
npm run build
```

### Production Run
Run the compiled JavaScript:
```bash
npm start
```

## Scripts

- `npm run dev` - Start development mode with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm test` - Run tests (not implemented yet)

## Development

The bot is configured to post twice daily at 9:00 AM and 5:00 PM. You can modify the cron schedule in `src/main.ts`.

## Author
[TheDevPiyush](https://github.com/TheDevPiyush "Visit my GitHub profile")
