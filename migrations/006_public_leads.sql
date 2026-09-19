CREATE TABLE IF NOT EXISTS clientum_public_contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT,
  team_size TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'public-contact',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clientum_public_contacts_created_idx
  ON clientum_public_contacts (created_at DESC);

CREATE INDEX IF NOT EXISTS clientum_public_contacts_email_idx
  ON clientum_public_contacts (email);

CREATE TABLE IF NOT EXISTS clientum_public_newsletter_subscribers (
  email TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'public-footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);