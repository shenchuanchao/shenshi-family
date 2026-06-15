-- Gallery moderation: add status & reject_reason to shen_gallery_images
-- status: 'pending' (default for new uploads), 'approved', 'rejected'
-- Existing rows are set to 'approved' so they remain visible.

ALTER TABLE shen_gallery_images
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS reject_reason TEXT;

-- New uploads should default to 'pending'
ALTER TABLE shen_gallery_images
  ALTER COLUMN status SET DEFAULT 'pending';
