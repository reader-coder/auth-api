# Project Environment Configuration

This project uses environment variables to manage configurations securely. Below are the required environment variables and their descriptions.

## Environment Variables

Create a `.env` file in the root directory of your project and include the following variables:

### Database Configuration
```ini
MONGO_URI=mongodb://localhost:27017/mydatabase
```
- **MONGO_URI**: MongoDB connection string pointing to the local database.

### Server Configuration
```ini
URL=http://localhost:4000
PORT=4000
```
- **URL**: Base URL where the server runs.
- **PORT**: The port number on which the application runs.

### Authentication
```ini
JWT_SECRET=your-secure-random-secret-key
```
- **JWT_SECRET**: Secret key used for signing JWT tokens. Ensure this is kept secure.

### Node Environment
```ini
NODE_ENV=development
```
- **NODE_ENV**: Defines the environment in which the application runs (e.g., `development`, `production`).

### SMTP Configuration (for email services)
```ini
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=strongpassword123
```
- **SMTP_HOST**: SMTP server used for sending emails.
- **SMTP_PORT**: Port number used for SMTP (e.g., `587` for TLS, `465` for SSL, `25` for non-secure).
- **SMTP_USER**: Email or username for authentication.
- **SMTP_PASSWORD**: Password or app-specific authentication token.

## Usage Instructions

1. Create a `.env` file in your project root.
2. Copy and paste the above configuration.
3. Replace placeholder values with actual credentials.
4. Ensure that `.env` is listed in `.gitignore` to prevent accidental commits.

## Important Notes
- Never expose sensitive information in public repositories.
- Use a `.env` file for local development and environment variables in production.
- Rotate secrets periodically for enhanced security.

---
For any issues, refer to the official documentation of MongoDB, JWT, and SMTP providers.

