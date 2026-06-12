-- ============================================================
-- 沈氏文化家园 - 初始数据库迁移
-- Migration: 001_initial_schema
-- Database: PostgreSQL 14+
-- 所有表使用 shen_ 前缀
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. 用户表 (自定义认证)
-- ------------------------------------------------------------
CREATE TABLE shen_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  hometown TEXT,
  generation_verse TEXT,
  tanghao TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE shen_users IS '用户表 - 自定义认证，不使用 Supabase auth.users';
CREATE INDEX idx_shen_users_email ON shen_users(email);

-- ------------------------------------------------------------
-- 2. 文章表 (名人/族谱/新闻/家训)
-- ------------------------------------------------------------
CREATE TABLE shen_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('celebrity', 'genealogy', 'news', 'family_rules')) NOT NULL,
  dynasty TEXT,
  field TEXT,
  cover_image TEXT,
  view_count INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE shen_articles IS '文章表 - 包含名人、族谱、新闻、家训等内容';
CREATE INDEX idx_shen_articles_category ON shen_articles(category);
CREATE INDEX idx_shen_articles_created ON shen_articles(created_at DESC);

-- ------------------------------------------------------------
-- 3. 文章评论表
-- ------------------------------------------------------------
CREATE TABLE shen_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES shen_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES shen_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shen_comments_article ON shen_comments(article_id);

-- ------------------------------------------------------------
-- 4. 留言墙帖子表
-- ------------------------------------------------------------
CREATE TABLE shen_forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES shen_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shen_forum_posts_created ON shen_forum_posts(created_at DESC);

-- ------------------------------------------------------------
-- 5. 留言墙回复表
-- ------------------------------------------------------------
CREATE TABLE shen_forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES shen_forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES shen_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shen_forum_replies_post ON shen_forum_replies(post_id);

-- ------------------------------------------------------------
-- 6. 影像馆图片表
-- ------------------------------------------------------------
CREATE TABLE shen_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES shen_users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  description TEXT,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shen_gallery_created ON shen_gallery_images(created_at DESC);

-- ------------------------------------------------------------
-- 7. 字辈库表
-- ------------------------------------------------------------
CREATE TABLE shen_generation_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name TEXT NOT NULL,
  verses TEXT NOT NULL,
  region TEXT,
  description TEXT
);

-- ============================================================
-- 种子数据
-- ============================================================

-- 字辈数据
INSERT INTO shen_generation_verses (branch_name, verses, region, description) VALUES
('吴兴沈氏', '克明峻德，允升于天，维皇作极，用锡尔福', '浙江湖州', '吴兴郡沈氏，为沈氏正统支系'),
('三善堂沈氏', '仁义礼智信，忠孝廉节勇', '江西', '宋代沈度后裔'),
('梦溪堂沈氏', '学贯天人，道通古今', '江苏镇江', '沈括后裔支系'),
('清音堂沈氏', '文采风流，声韵清越', '浙江', '沈约后裔支系'),
('九如堂沈氏', '如山如阜，如冈如陵，如川之方至', '安徽', '取诗经九如之意'),
('承志堂沈氏', '承先启后，志在千里', '湖南', '湖南沈氏支系');

-- 名人文章
INSERT INTO shen_articles (title, content, category, dynasty, field, cover_image) VALUES
('沈约', '沈约（441年－513年），字休文，吴兴武康（今浙江湖州德清）人，南朝史学家、文学家、声律学家。历仕宋、齐、梁三朝，官至尚书令。他是"永明体"诗歌的创始人之一，提出"四声八病"之说，对中国诗歌格律化有重大贡献。著有《宋书》一百卷，为"二十四史"之一。', 'celebrity', '南朝', '文学/史学', NULL),
('沈括', '沈括（1031年－1095年），字存中，号梦溪丈人，杭州钱塘（今浙江杭州）人，北宋科学家、政治家。他博学多才，在天文、数学、物理、地理、医药等方面都有卓越成就。其代表作《梦溪笔谈》是一部涉及自然科学和人文科学的综合性巨著，被誉为"中国科学史上的里程碑"。', 'celebrity', '北宋', '科学', NULL),
('沈周', '沈周（1427年－1509年），字启南，号石田，晚号白石翁，长洲（今江苏苏州）人，明代杰出画家，"吴门画派"创始人，与文徵明、唐寅、仇英并称"明四家"。他一生不仕，专事诗文书画，在绘画上成就极高，尤擅山水画。', 'celebrity', '明代', '绘画', NULL),
('沈家本', '沈家本（1840年－1913年），字子惇，号寄簃，浙江吴兴（今湖州）人，清末著名法学家。他主持修订法律，引进西方法律制度，是中国近代法学的奠基人之一。主持修订了《大清新刑律》等重要法律文件。', 'celebrity', '清代', '法学', NULL),
('沈从文', '沈从文（1902年－1988年），原名沈岳焕，字崇文，湖南凤凰人，现代著名作家、历史文物研究者。代表作有《边城》《长河》等，是中国现代文学史上的重要作家。后半生致力于中国古代服饰研究，著有《中国古代服饰研究》。', 'celebrity', '近现代', '文学', NULL);

-- 家训文章
INSERT INTO shen_articles (title, content, category, dynasty, field, cover_image) VALUES
('沈氏家训·吴兴堂', '一、孝父母：父母之恩，昊天罔极。为人子者，当竭力以报亲恩。二、敬长上：长幼有序，尊卑有别。晚辈当敬重长辈，不可有失礼之举。三、睦宗族：宗族之人，同气连枝。当和睦相处，守望相助。四、勤耕读：耕读传家，乃长久之计。勤则不匮，读则明理。五、慎交友：交友须择善者而从之，不善者而远之。', 'family_rules', NULL, NULL, NULL),
('沈氏家训·三善堂', '善心、善行、善德，谓之三善。吾族子孙，当以善为本，以善待人，以善处世。心存善念，则邪不侵；行有善举，则福自来；德修善行，则家族昌。', 'family_rules', NULL, NULL, NULL),
('沈氏家训·承志堂', '立志高远，承先启后。吾族后学，当以先祖为榜样，修身齐家，报效家国。勿以恶小而为之，勿以善小而不为。勤俭持家，忠孝传世。', 'family_rules', NULL, NULL, NULL);

-- 新闻动态
INSERT INTO shen_articles (title, content, category, dynasty, field, cover_image) VALUES
('2024年全球沈氏宗亲联谊会圆满举行', '2024年10月15日，第十二届全球沈氏宗亲联谊会在浙江湖州吴兴区隆重举行。来自海内外各地的500余位沈氏宗亲齐聚一堂，共叙亲情、共谋发展。大会期间，各地宗亲代表分享了近年来在家族文化传承、慈善公益、青年交流等方面的经验和成果。', 'news', NULL, NULL, NULL),
('《沈氏家谱》数字化工程正式启动', '由吴兴沈氏宗亲会发起的《沈氏家谱》数字化工程于2024年8月正式启动。该项目旨在将散落在各地的传统纸质家谱进行数字化整理，建立统一的在线族谱数据库，方便全球宗亲查阅和续修。', 'news', NULL, NULL, NULL);

COMMIT;
