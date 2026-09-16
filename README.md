# tcps-cresset-pilot

A ChatGPT-powered application pilot for TCPS Cresset integration.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/m98s89xqk4-ship-it/tcps-cresset-pilot.git
cd tcps-cresset-pilot
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. ChatGPT Integration Setup

To install and configure ChatGPT integration with override settings:

```bash
# Override default configuration and install ChatGPT
npm install openai --override4

# Or set environment variable for override
export OVERRIDE_CONFIG=true
npm install
```

#### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5.6-luna
NEXT_PUBLIC_PILOT_NAME=Cresset Christian Academy
```

#### 5. Run the Application

```bash
npm start
```

## Configuration Overrides

The `--override4` flag allows you to:
- Override existing dependencies
- Force fresh installation of ChatGPT modules
- Reset configuration to defaults

```bash
npm install --override4
```

## Development

```bash
npm run dev
```

## Contributing

Feel free to submit issues and enhancement requests.
