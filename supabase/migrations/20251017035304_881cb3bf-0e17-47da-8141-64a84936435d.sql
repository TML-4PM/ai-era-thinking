-- Insert GCBAT Vignettes book
INSERT INTO public.books (
  slug, title, subtitle, lead_description, cover_url, series_name, 
  collection, status, owner, ready_flag
) VALUES (
  'gcbat-vignettes',
  'GCBAT Vignettes',
  '32 Stories of Technology, Humanity, and the Choices We Face',
  'A narrative exploration of governance, compliance, business, architecture, and technology through the eyes of nine professionals navigating the challenges of emerging AI systems. Each story reveals stakeholder conflicts, system failures, and the critical choices we face.',
  '/assets/covers/gcbat-vignettes.jpg',
  'Tech for Humanity',
  'Standalone',
  'draft',
  'Editorial Team',
  true
);

-- Get the book ID for chapter insertion
DO $$
DECLARE
  book_uuid UUID;
BEGIN
  SELECT id INTO book_uuid FROM public.books WHERE slug = 'gcbat-vignettes';

  -- Insert all 55 chapters
  INSERT INTO public.book_chapters (book_id, title, chapter_order, progress_percentage, sections, content) VALUES
  -- Prologue
  (book_uuid, 'Prologue: The Augmented World', 1, 0, '["Prologue"]', ''),
  
  -- Character Profiles (2-10)
  (book_uuid, 'Character Profile: [TBD 1]', 2, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 2]', 3, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 3]', 4, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 4]', 5, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 5]', 6, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 6]', 7, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 7]', 8, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 8]', 9, 0, '["Character Profiles", "Neural Ennead"]', ''),
  (book_uuid, 'Character Profile: [TBD 9]', 10, 0, '["Character Profiles", "Neural Ennead"]', ''),
  
  -- Arc 1: Infrastructure Collapse (11-17)
  (book_uuid, 'Story 1: Subscription Disconnect', 11, 0, '["Arc 1", "Infrastructure Collapse", "Foundation Tier"]', ''),
  (book_uuid, 'Story 2: Cloud Custody Crisis', 12, 0, '["Arc 1", "Infrastructure Collapse", "Foundation Tier"]', ''),
  (book_uuid, 'Story 3: Legacy Lock-Out', 13, 0, '["Arc 1", "Infrastructure Collapse", "Foundation Tier"]', ''),
  (book_uuid, 'Story 4: Edge Computing Failure', 14, 0, '["Arc 1", "Infrastructure Collapse", "Core Tier"]', ''),
  (book_uuid, 'Story 5: Data Center Disaster', 15, 0, '["Arc 1", "Infrastructure Collapse", "Core Tier"]', ''),
  (book_uuid, 'Story 6: Network Fragmentation', 16, 0, '["Arc 1", "Infrastructure Collapse", "Core Tier"]', ''),
  (book_uuid, 'Story 7: Autonomous Transport Gridlock', 17, 0, '["Arc 1", "Infrastructure Collapse", "Spotlight Tier"]', ''),
  
  -- Interlude 1 (18)
  (book_uuid, 'Interlude 1: The Infrastructure Foundation', 18, 0, '["Interlude"]', ''),
  
  -- Arc 2: Cognitive & Social Disruption (19-24)
  (book_uuid, 'Story 8: AI Advisor Addiction', 19, 0, '["Arc 2", "Cognitive & Social Disruption", "Foundation Tier"]', ''),
  (book_uuid, 'Story 9: Deepfake Deception', 20, 0, '["Arc 2", "Cognitive & Social Disruption", "Foundation Tier"]', ''),
  (book_uuid, 'Story 10: Filter Bubble Breakdown', 21, 0, '["Arc 2", "Cognitive & Social Disruption", "Core Tier"]', ''),
  (book_uuid, 'Story 11: Social Credit Manipulation', 22, 0, '["Arc 2", "Cognitive & Social Disruption", "Core Tier"]', ''),
  (book_uuid, 'Story 12: Memory Augmentation Malfunction', 23, 0, '["Arc 2", "Cognitive & Social Disruption", "Core Tier"]', ''),
  (book_uuid, 'Story 13: Relationship Replacement', 24, 0, '["Arc 2", "Cognitive & Social Disruption", "Spotlight Tier"]', ''),
  
  -- Interlude 2 (25)
  (book_uuid, 'Interlude 2: The Human Dimension', 25, 0, '["Interlude"]', ''),
  
  -- Arc 3: Rights & Agency Erosion (26-31)
  (book_uuid, 'Story 14: Privacy Paradox', 26, 0, '["Arc 3", "Rights & Agency Erosion", "Foundation Tier"]', ''),
  (book_uuid, 'Story 15: Consent Confusion', 27, 0, '["Arc 3", "Rights & Agency Erosion", "Foundation Tier"]', ''),
  (book_uuid, 'Story 16: Algorithmic Bias', 28, 0, '["Arc 3", "Rights & Agency Erosion", "Core Tier"]', ''),
  (book_uuid, 'Story 17: Surveillance State', 29, 0, '["Arc 3", "Rights & Agency Erosion", "Core Tier"]', ''),
  (book_uuid, 'Story 18: Digital Identity Theft', 30, 0, '["Arc 3", "Rights & Agency Erosion", "Core Tier"]', ''),
  (book_uuid, 'Story 19: Autonomy Erosion', 31, 0, '["Arc 3", "Rights & Agency Erosion", "Spotlight Tier"]', ''),
  
  -- Interlude 3 (32)
  (book_uuid, 'Interlude 3: The Rights Reckoning', 32, 0, '["Interlude"]', ''),
  
  -- Arc 4: Environmental & Physical Systems (33-38)
  (book_uuid, 'Story 20: Climate Model Catastrophe', 33, 0, '["Arc 4", "Environmental & Physical Systems", "Foundation Tier"]', ''),
  (book_uuid, 'Story 21: Resource Extraction Runaway', 34, 0, '["Arc 4", "Environmental & Physical Systems", "Foundation Tier"]', ''),
  (book_uuid, 'Story 22: Agricultural Automation Failure', 35, 0, '["Arc 4", "Environmental & Physical Systems", "Core Tier"]', ''),
  (book_uuid, 'Story 23: Water Management Collapse', 36, 0, '["Arc 4", "Environmental & Physical Systems", "Core Tier"]', ''),
  (book_uuid, 'Story 24: Energy Grid Breakdown', 37, 0, '["Arc 4", "Environmental & Physical Systems", "Core Tier"]', ''),
  (book_uuid, 'Story 25: Ecological Imbalance', 38, 0, '["Arc 4", "Environmental & Physical Systems", "Spotlight Tier"]', ''),
  
  -- Interlude 4 (39)
  (book_uuid, 'Interlude 4: The Planetary Stakes', 39, 0, '["Interlude"]', ''),
  
  -- Arc 5: Governance Crisis & Resolution (40-46)
  (book_uuid, 'Story 26: Regulatory Arbitrage', 40, 0, '["Arc 5", "Governance Crisis & Resolution", "Foundation Tier"]', ''),
  (book_uuid, 'Story 27: Policy Paralysis', 41, 0, '["Arc 5", "Governance Crisis & Resolution", "Foundation Tier"]', ''),
  (book_uuid, 'Story 28: International Discord', 42, 0, '["Arc 5", "Governance Crisis & Resolution", "Core Tier"]', ''),
  (book_uuid, 'Story 29: Corporate Capture', 43, 0, '["Arc 5", "Governance Crisis & Resolution", "Core Tier"]', ''),
  (book_uuid, 'Story 30: Democratic Deficit', 44, 0, '["Arc 5", "Governance Crisis & Resolution", "Core Tier"]', ''),
  (book_uuid, 'Story 31: Citizen Uprising', 45, 0, '["Arc 5", "Governance Crisis & Resolution", "Spotlight Tier"]', ''),
  (book_uuid, 'Story 32: The Resolution Framework', 46, 0, '["Arc 5", "Governance Crisis & Resolution", "Capstone"]', ''),
  
  -- Success Vignettes (47-49)
  (book_uuid, 'Success Vignette 1: Ethical AI in Healthcare', 47, 0, '["Success Vignettes"]', ''),
  (book_uuid, 'Success Vignette 2: Democratic Technology Governance', 48, 0, '["Success Vignettes"]', ''),
  (book_uuid, 'Success Vignette 3: Sustainable Tech Implementation', 49, 0, '["Success Vignettes"]', ''),
  
  -- Epilogue (50)
  (book_uuid, 'Epilogue: The Choice Before Us', 50, 0, '["Epilogue"]', ''),
  
  -- Appendices (51-55)
  (book_uuid, 'Appendix A: Technical Standards Reference', 51, 0, '["Appendices"]', ''),
  (book_uuid, 'Appendix B: Stakeholder Engagement Toolkit', 52, 0, '["Appendices"]', ''),
  (book_uuid, 'Appendix C: Policy Template Library', 53, 0, '["Appendices"]', ''),
  (book_uuid, 'Appendix D: Glossary of Terms', 54, 0, '["Appendices"]', ''),
  (book_uuid, 'Appendix E: Citation Index', 55, 0, '["Appendices"]', '');
END $$;