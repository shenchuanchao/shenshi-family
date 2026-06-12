-- 文章点赞记录表（用户+文章唯一约束，防止重复点赞）
CREATE TABLE IF NOT EXISTS shen_article_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES shen_articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES shen_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(article_id, user_id)
);

-- 索引：快速查询某篇文章被谁点赞、某用户点了哪些文章
CREATE INDEX IF NOT EXISTS idx_article_likes_article ON shen_article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user ON shen_article_likes(user_id);
