# rkb-business-server

## Description

This is the backend server for the RKB Business application. It is built with Node.js, Express, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Docker](#docker)
- [License](#license)

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd rkb-business-server
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root of the project.
2.  Add the following environment variables to the `.env` file:

    ```env
    NODE_ENV=development
    PORT=8080
    MONGO_URI=mongodb://localhost:27017/rkb-business
    REDIS_HOST=localhost
    REDIS_PORT=6379
    ```

## Running the App

### Development

To run the app in development mode, use the following command:

```bash
npm run dev
```

This will start the server with `nodemon`, which will automatically restart the server when you make changes to the code.

### Production

To run the app in production, you first need to build the TypeScript code:

```bash
npm run build
```

Then, you can start the server with:

```bash
npm run start
```

## Available Scripts

- `dev`: Starts the server in development mode with nodemon.
- `start`: Starts the server in production mode.
- `lint`: Lints the TypeScript code.
- `test`: Runs the tests.
- `test:watch`: Runs the tests in watch mode.
- `build`: Compiles the TypeScript code to JavaScript.

## Docker

To build and run the application with Docker, use the following commands:

- **Build the Docker image:**
  ```bash
  npm run docker-build
  ```
- **Rebuild the Docker image without cache:**
  ```bash
  npm run docker-rebuild
  ```
- **Run the Docker container:**
  ```bash
  npm run docker-run
  ```

## License

This project is licensed under the ISC License.
