# Database certificates

Supabase signs its Postgres certificates with a private root CA (“Supabase Root
2021 CA”) that Node does not ship, so connecting with full verification needs
that CA supplied explicitly.

Download it from the Supabase dashboard — **Settings → Database → SSL
Configuration → Download certificate** — and save it here as
`supabase-ca.crt`, then set:

```
DATABASE_CA_CERT=certs/supabase-ca.crt
```

**Commit the certificate.** It is a public CA certificate, not a secret, and
the path-based route only works if the file is in the repo.

## On a serverless host, prefer the inline form

`DATABASE_CA_CERT` is resolved and read at runtime. Bundlers do not reliably
ship loose files, so production should pass the certificate contents directly
instead:

```
DATABASE_CA_CERT_VALUE=<the PEM, raw or base64>
```

`payload.config.ts` accepts either encoding and prefers this variable over the
file path. Base64 avoids trouble with hosts whose environment-variable UI
mangles multi-line values:

```sh
base64 -i certs/supabase-ca.crt | tr -d '\n' | pbcopy
```

One of the two is **required** in production — the config throws on boot
without it rather than silently falling back to an unverified connection.
