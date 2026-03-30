# Building Sill with SMTP Support

This fork replaces the Mailgun email service with direct SMTP support via nodemailer.

## Prerequisites

- Node.js 22+
- pnpm
- Docker

## Setup

```bash
git clone -b smtp-support https://github.com/jbeker/sill.git
cd sill

# Regenerate the lockfile (required after the mailgun → nodemailer swap)
pnpm install

# Commit the updated lockfile
git add pnpm-lock.yaml
git commit -m "Update pnpm-lock.yaml for nodemailer dependency"
```

## Building Docker Images

```bash
docker build -f docker/Dockerfile.web -t registry.confusticate.com/sill-web:latest .
docker build -f docker/Dockerfile.api -t registry.confusticate.com/sill-api:latest .
docker build -f docker/Dockerfile.worker -t registry.confusticate.com/sill-worker:latest .
```

## Pushing to Registry

```bash
docker push registry.confusticate.com/sill-web:latest
docker push registry.confusticate.com/sill-api:latest
docker push registry.confusticate.com/sill-worker:latest
```

## SMTP Environment Variables

Add these to your `stack.env`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | Yes | — | SMTP server hostname |
| `SMTP_PORT` | No | 587 | SMTP server port |
| `SMTP_USER` | No | — | SMTP username (omit for unauthenticated) |
| `SMTP_PASS` | No | — | SMTP password |
| `SMTP_SECURE` | No | false | Set to `true` for TLS on port 465 |
| `EMAIL_FROM` | No | `Sill <noreply@EMAIL_DOMAIN>` | From address |
| `EMAIL_DOMAIN` | No | — | Fallback domain for From address |

## Changes from Upstream

- `packages/emails/src/email-service.ts` — replaced Mailgun SDK with nodemailer
- `packages/emails/package.json` — swapped `mailgun.js`/`form-data` for `nodemailer`/`@types/nodemailer`
