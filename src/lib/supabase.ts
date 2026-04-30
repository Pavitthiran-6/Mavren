import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://btaugojhgqkfzlysfhon.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXVnb2poZ3FrZnpseXNmaG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjU2NjcsImV4cCI6MjA5MjAwMTY2N30.AevlCtYz3xOuY-C689DjASxQZ9gnsZfGQbtam-h9uEE'
)
