# Environment Variables Configuration

This `.env` file contains the necessary environment variables for the project. Replace placeholder values with actual credentials before deployment.

## Database Configuration
```ini
MONGO_URI=mongodb://your_mongo_host:your_mongo_port/your_database
```
- **your_mongo_host**: The hostname or IP address of your MongoDB server.
- **your_mongo_port**: The port MongoDB is running on (default: 27017).
- **your_database**: The name of your database.

## Server Configuration
```ini
URL=http://your_server_url:your_port
PORT=your_port
```
- **your_server_url**: The base URL of your application.
- **your_port**: The port your application will run on.

## Authentication
```ini
JWT_SECRET=your_jwt_secret
```
- **your_jwt_secret**: A secret key used for signing JWT tokens. Keep this secure.

## Application Mode
```ini
NODE_ENV="your_environment"
```
- **your_environment**: The environment mode (e.g., development, production).

## SMTP Configuration
```ini
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```
- **your_smtp_host**: The SMTP server host.
- **your_smtp_port**: The port used for sending emails (e.g., 587 for TLS, 465 for SSL).
- **your_smtp_user**: The username for SMTP authentication.
- **your_smtp_password**: The password for SMTP authentication.

## Cloudinary Configuration
```ini
CLOUDINARY_CLOUDNAME=your_cloudinary_cloudname
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
- **your_cloudinary_cloudname**: Your Cloudinary cloud name.
- **your_cloudinary_api_key**: Your Cloudinary API key.
- **your_cloudinary_api_secret**: Your Cloudinary API secret. Keep this secure.

## Security Notice
**Do not commit this file to version control!** Instead, use a `.env.example` file with placeholders and add `.env` to `.gitignore` to keep credentials secure.
