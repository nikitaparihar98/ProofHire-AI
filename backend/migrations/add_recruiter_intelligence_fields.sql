-- Migration: Add recruiter intelligence fields to candidates table
-- This script uses ALTER TABLE statements for SQLite. Errors for existing columns are ignored.

ALTER TABLE candidates ADD COLUMN honesty_score FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN skill_mismatch JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN hidden_talents JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN malpractice_severity FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN claimed_skills_json JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN demonstrated_skills_json JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN ai_content_score FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN resume_honesty_index FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN overclaim_risk_score FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN underclaim_score FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN skill_gap_analysis JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN red_flag_alerts JSON DEFAULT '[]';
ALTER TABLE candidates ADD COLUMN demonstrated_skills JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN claimed_skills_analysis JSON DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN candidate_strength_summary TEXT DEFAULT '';
ALTER TABLE candidates ADD COLUMN candidate_weakness_summary TEXT DEFAULT '';
ALTER TABLE candidates ADD COLUMN edge_case_score FLOAT DEFAULT 0.0;
ALTER TABLE candidates ADD COLUMN consistency_score FLOAT DEFAULT 0.0;

-- End of migration
