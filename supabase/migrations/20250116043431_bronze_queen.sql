/*
  # Wedding RSVP System Schema

  1. New Tables
    - `guests`
      - `id` (uuid, primary key)
      - `name` (text, guest's full name)
      - `email` (text, unique)
      - `attending` (boolean, RSVP status)
      - `dietary_restrictions` (text, any special meal requirements)
      - `plus_one` (boolean, whether bringing a guest)
      - `plus_one_name` (text, name of additional guest)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `guests` table
    - Add policies for authenticated users to manage their RSVPs
    - Add policy for admin to view all RSVPs
*/

CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  attending boolean DEFAULT false,
  dietary_restrictions text DEFAULT '',
  plus_one boolean DEFAULT false,
  plus_one_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create policy for guests to manage their own RSVP
CREATE POLICY "Users can manage their own RSVP"
  ON guests
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create policy for admin to view all RSVPs
CREATE POLICY "Admins can view all RSVPs"
  ON guests
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update the updated_at column
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();