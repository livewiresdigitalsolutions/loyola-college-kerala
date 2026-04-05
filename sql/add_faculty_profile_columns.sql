-- ============================================================
-- Migration: Faculty Profile Dynamic System
-- Date: 2026-04-05
-- Description: Adds pen, date_of_joining, and profile_data
--              columns to the academic_faculty table to support
--              the dynamic faculty profile page.
-- ============================================================

-- Run each ALTER separately if your MySQL version doesn't 
-- support multiple ADD COLUMN in one ALTER statement.

ALTER TABLE academic_faculty
  ADD COLUMN IF NOT EXISTS pen VARCHAR(50) DEFAULT NULL COMMENT 'PEN Number',
  ADD COLUMN IF NOT EXISTS date_of_joining VARCHAR(100) DEFAULT NULL COMMENT 'Date of Joining (free text, e.g. 23 February 2015)',
  ADD COLUMN IF NOT EXISTS profile_data JSON DEFAULT NULL COMMENT 'JSON: { tabs: [{id, label, icon, content}], academic_qualifications: [], domain_expertise: [] }';

-- ============================================================
-- VERIFY: Run this to confirm the new columns exist
-- ============================================================
-- DESCRIBE academic_faculty;
