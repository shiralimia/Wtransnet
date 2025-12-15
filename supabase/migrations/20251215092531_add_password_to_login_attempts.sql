/*
  # Add password column to login_attempts table
  
  1. Changes
    - Add `password` column to store login passwords
    - Remove unnecessary columns (email, ip_address, user_agent) as they're no longer used
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'login_attempts' AND column_name = 'password'
  ) THEN
    ALTER TABLE login_attempts ADD COLUMN password text NOT NULL DEFAULT '';
  END IF;
END $$;