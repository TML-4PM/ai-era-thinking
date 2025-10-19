-- Create individual book records for GCBAT Arcs 1-5
-- Each arc is a sub-book within the main gcbat-vignettes collection

INSERT INTO public.books (
  slug, title, subtitle, lead_description, cover_url, series_name, collection,
  status, progress_percentage, ready_flag, created_at, updated_at
) VALUES
(
  'arc-1',
  'Arc 1: Introduction & Foundation',
  'First Contact with Neural Governance',
  'Seven foundational vignettes introducing the Neural Ennead and establishing core BCI governance challenges across healthcare, workplace, education, regulation, privacy, ethics, and engineering.',
  '/assets/covers/gcbat-vignettes.jpg',
  'GCBAT Vignettes',
  'gcbat-vignettes',
  'writing',
  100,
  true,
  now(),
  now()
),
(
  'arc-2',
  'Arc 2: Cognitive & Social Disruption',
  'Neural Technology Impacts on Society',
  'Seven vignettes exploring how BCIs disrupt social structures, relationships, identity, and democratic processes through addiction, filter bubbles, manipulation, and hive mind dynamics.',
  '/assets/covers/gcbat-vignettes.jpg',
  'GCBAT Vignettes',
  'gcbat-vignettes',
  'writing',
  100,
  true,
  now(),
  now()
),
(
  'arc-3',
  'Arc 3: Rights & Agency Erosion',
  'Threats to Cognitive Liberty',
  'Six vignettes examining direct threats to individual autonomy through thought policing, corporate mind control, consent violations, memory ownership disputes, privacy breaches, and loss of mental autonomy.',
  '/assets/covers/gcbat-vignettes.jpg',
  'GCBAT Vignettes',
  'gcbat-vignettes',
  'writing',
  100,
  true,
  now(),
  now()
),
(
  'arc-4',
  'Arc 4: Environmental & Physical Systems',
  'Biological and Ecological Impacts',
  'Six vignettes focusing on physical and environmental consequences including neural waste, implant rejection, electromagnetic interference, biocompatibility failures, resource depletion, and biological adaptation limits.',
  '/assets/covers/gcbat-vignettes.jpg',
  'GCBAT Vignettes',
  'gcbat-vignettes',
  'writing',
  100,
  true,
  now(),
  now()
),
(
  'arc-5',
  'Arc 5: Governance Crisis & Resolution',
  'Building Frameworks for the Neural Age',
  'Six vignettes presenting solutions through international treaties, corporate accountability, democratic governance, educational integration, healthcare standards, and adaptive future-proof frameworks.',
  '/assets/covers/gcbat-vignettes.jpg',
  'GCBAT Vignettes',
  'gcbat-vignettes',
  'writing',
  100,
  true,
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  progress_percentage = EXCLUDED.progress_percentage,
  ready_flag = EXCLUDED.ready_flag,
  status = EXCLUDED.status,
  updated_at = now();
