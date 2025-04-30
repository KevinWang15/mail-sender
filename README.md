# Mail Sender

A simple email sending service built with Node.js, Express, and Nodemailer.

## Features

- RESTful API for sending emails
- Authentication with Bearer token
- Support for plain text and HTML emails
- Easy configuration with environment variables

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   SMTP_HOST=your-smtp-host
   SMTP_PORT=your-smtp-port
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-smtp-password
   TOKEN=your-secret-token
   ```

## Usage

### Start the server

```
node server.js
```

The server runs on port 3881 by default.

### Send an email

Send a POST request to `/send-email` with the following:

#### Headers:
- `Content-Type: application/json`
- `Authorization: Bearer your-secret-token`

#### Body:
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text message",
  "html": "<p>HTML formatted message</p>"
}
```

Note: You can include either `text` or `html` or both. If both are provided, the HTML version will be used.

#### Example (using curl):

```bash
curl -X POST http://localhost:3881/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello from Mail Sender",
    "html": "<h1>Hello!</h1><p>This is a test email.</p>"
  }'
```

## Response

### Success
```json
{
  "message": "Email sent successfully"
}
```

### Error
```json
{
  "error": "Error message"
}
```

## License

MIT