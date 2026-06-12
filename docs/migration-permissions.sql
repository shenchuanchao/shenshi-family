-- ============================================================================
-- 沈氏文化家园 - 权限系统数据库迁移
-- 请在 Supabase Dashboard → SQL Editor 中执行以下三条语句
-- ============================================================================

-- 1. 用户表：添加角色字段（user / editor / admin）
ALTER TABLE shen_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. 文章表：添加审核状态字段（draft / published / rejected）
ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

-- 3. 文章表：添加投稿人字段（关联 shen_users.id，存量文章为 NULL）
ALTER TABLE shen_articles ADD COLUMN IF NOT EXISTS author_id UUID;

-- 4. 添加外键约束（支持关联查询）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_articles_author'
  ) THEN
    ALTER TABLE shen_articles 
    ADD CONSTRAINT fk_articles_author 
    FOREIGN KEY (author_id) REFERENCES shen_users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- 验证迁移结果（可选）
-- ============================================================================
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name IN ('shen_users', 'shen_articles')
--   AND column_name IN ('role', 'status', 'author_id');