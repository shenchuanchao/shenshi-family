-- 字辈表增加省市区字段
-- 在 Supabase Dashboard -> SQL Editor 中执行

ALTER TABLE shen_generation_verses ADD COLUMN IF NOT EXISTS province VARCHAR(20);
ALTER TABLE shen_generation_verses ADD COLUMN IF NOT EXISTS city VARCHAR(30);
ALTER TABLE shen_generation_verses ADD COLUMN IF NOT EXISTS county VARCHAR(30);

-- 索引：按省查询
CREATE INDEX IF NOT EXISTS idx_generation_province ON shen_generation_verses(province);
