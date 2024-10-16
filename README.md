# Hipster Game React App

This project is a React-based application/game, utilizing the Spotify API to create interactive playlist cards with front and back designs. Users can import playlists, edit them, and print out game cards for physical use. The app also supports offline functionality as a Progressive Web App (PWA).

It is written for private use only. All commercial use is prohibited!

## Features
- Import Spotify playlists via URL
- Edit and save playlists locally
- Print playlist cards with front and back designs (6x6cm cards)
- Toggle print modes for front/back printing
- Supports both desktop and mobile printing
- Responsive design for different screen sizes
- PWA functionality for offline use
- Hosted on AWS S3 with CloudFront and Route 53 for HTTPS and domain management

## Tech Stack
- React (TypeScript)
- Spotify API integration
- AWS S3, CloudFront, and Route 53 for hosting

## Installation

### Prerequisites
- Node.js and npm installed on your local machine

### Steps

1. Clone the repository
    ```bash
    git clone https://github.com/hiroshui/hipster-game.git
    cd hipster-game
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3.  Replace your spotify api tokens in src/token.json
    ```json
    {
    "clientId": "YOUR_CLIENT_ID",
    "clientSecret": "YOUR_CLIENT_SECRET"
    }
    ```

4. Start the development server
    ```bash
    npm start
    ```

## Deployment

This app is deployed on AWS S3, with CloudFront for HTTPS and Route 53 for DNS management. Follow these steps for deployment:

1. Build the project
    ```bash
    npm run build
    ```

2. Upload the build files to your S3 bucket
    ```bash
    aws s3 sync build/ s3://your-s3-bucket-name --acl public-read
    ```

3. Set up CloudFront to serve the content over HTTPS:
   - In CloudFront, create a new distribution with your S3 bucket as the origin.
   - Set up an SSL certificate for HTTPS.
   
4. Route53 Setup:
   - In AWS Route53, create an Alias record pointing to the CloudFront distribution for your custom domain.

## Usage

1. Import a playlist by pasting a Spotify playlist URL.
2. Manage your playlists: add, remove, or reorder songs.
3. Toggle print modes for printing cards with front and back designs.

