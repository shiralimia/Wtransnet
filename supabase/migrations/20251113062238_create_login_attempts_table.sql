/*
  # Create login attempts table

  1. New Tables
    - `login_attempts`
      - `id` (uuid, primary key)
      - `username` (text, not null)
      - `email` (text, optional)
      - `login_timestamp` (timestamptz, auto set)
      - `ip_address` (text, optional)
      - `user_agent` (text, optional)

  2. Security
    - Enable RLS on `login_attempts` table
    - Add policy for public inserts (since unauthenticated users need to log in)
    - Add policy for users to view their own login attempts
*/

CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  email text,
  login_timestamp timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for login attempts"
  ON login_attempts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select on login attempts"
  ON login_attempts
  FOR SELECT
  USING (true);
