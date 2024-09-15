# Woof Reading Security Practices Documentation

## Overview

This document outlines the security practices implemented in the Woof Reading application. It covers authentication, data protection, API security, and general web application security best practices.

## Authentication

### JWT (JSON Web Tokens)

- Used for stateless authentication
- Implemented in `auth/index.js`

#### Token Generation

```javascript
const token = jwt.sign(
  {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48, // 48 hour expiration
    data: { id: userMatch.id, username: userMatch.username },
  },
  process.env.JWT_SECRET
);
```

#### Token Verification

- Middleware: `utilities/verifyToken.js`

```javascript
jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
  if (err)
    return res.status(403).send({ error: "Failed to authenticate token." });
  req.user = decodedUser.data.id;
  next();
});
```

### Password Security

- Passwords are hashed using bcrypt before storage
- Implemented in `auth/index.js`

```javascript
const saltRounds = 10;
const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
```

### Password Recovery Attempt Limiting

- Implemented for security question answers in `auth/index.js`

```javascript
const maxAnswerAttempts = 4;
let answerAttempts = 0;
```

## Data Protection

### Environment Variables

- Sensitive data (API keys, database credentials) stored in `.env` file
- Loaded using `dotenv` package

### Database Security

- Using Prisma ORM to prevent SQL injection
- Parameterized queries are used throughout

### Input Validation

- Client-side and server-side validation implemented
- Example in `GamePlay.jsx`:

```javascript
if (checkBadWords() === true) {
  setErrorText("Please only use nice words.");
} else {
  // Proceed with submission
}
```

## API Security

### Anthropic API

- API key stored as an environment variable
- Requests to Anthropic API are made server-side to prevent exposing the API key

## Frontend Security

### localStorage Usage

- JWTs stored in localStorage
- Vulnerable to XSS attacks, consider using httpOnly cookies in production

### Content Security Policy

- Not currently implemented, but recommended to prevent XSS attacks

## Secure Communication

- HTTPS should be enforced in production
- Not visible in the provided code, but recommended:

```javascript
const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

https
  .createServer(
    {
      key: fs.readFileSync("path/to/key.pem"),
      cert: fs.readFileSync("path/to/cert.pem"),
    },
    app
  )
  .listen(443);
```

## User Data Handling

### Data Minimization

- Only necessary user data is collected and stored

### Data Deletion

- Users can delete their account, which removes all associated data
- Implemented in `api/users.js`:

```javascript
router.delete("/:id", verifyToken, async (req, res) => {
  // Delete user data from all related tables
});
```

## Security Headers

- Not currently implemented, but recommended to add security headers:

```javascript
const helmet = require("helmet");
app.use(helmet());
```

## Logging and Monitoring

- Basic request logging implemented using Morgan:

```javascript
app.use(morgan("dev"));
```

- Consider implementing more comprehensive logging and monitoring for production

## Regular Updates and Patching

- Regularly update dependencies to patch known vulnerabilities
- Use `npm audit` to check for vulnerabilities in dependencies

## Security Testing

- Implement regular security testing, including:
  - Penetration testing
  - Vulnerability scanning
  - Code reviews with a security focus

## Incident Response Plan

- Develop and maintain an incident response plan
- Regular drills and updates to the plan are recommended

By following these security practices, the Woof Reading application aims to protect user data and maintain a secure environment. However, security is an ongoing process, and these practices should be regularly reviewed and updated.
