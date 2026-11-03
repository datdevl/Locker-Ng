-- =========================================================================
-- GAIE LOCKER & HEALING PLATFORM - SUPABASE DATABASE SCHEMA
-- Bảng cơ sở dữ liệu dùng chung kết nối đa thiết bị cho Tập đoàn Á Châu
-- =========================================================================

-- 1. BẢNG QUẢN LÝ DÃY TỦ LOCKER
CREATE TABLE IF NOT EXISTS lockers (
    id INT PRIMARY KEY,
    number VARCHAR(20) NOT NULL,
    campus VARCHAR(50) NOT NULL,
    alias VARCHAR(100) NOT NULL,
    is_vacant BOOLEAN DEFAULT TRUE,
    device_key TEXT,
    recovery_words TEXT,
    has_unread_reply BOOLEAN DEFAULT FALSE,
    last_reply_snippet TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG QUẢN LÝ THƯ GÓP Ý & HỒI ÂM ("NGHE BẠN")
CREATE TABLE IF NOT EXISTS feedback_letters (
    id VARCHAR(50) PRIMARY KEY,
    locker_id INT REFERENCES lockers(id) ON DELETE CASCADE,
    locker_number VARCHAR(20) NOT NULL,
    alias VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    urgency VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Đã gửi',
    pr_reply_date VARCHAR(50),
    pr_reply_responder TEXT,
    pr_reply_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG CÂY ĐOM ĐÓM CHIA SẺ & GỬI CÁI ÔM ("TRẠM CHỮA LÀNH")
CREATE TABLE IF NOT EXISTS healing_wishes (
    id VARCHAR(50) PRIMARY KEY,
    author_alias VARCHAR(100) NOT NULL,
    campus VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    hugs INT DEFAULT 1,
    candles INT DEFAULT 1,
    tags TEXT[] DEFAULT ARRAY['Năng lượng tích cực'],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- BẬT ROW LEVEL SECURITY (RLS) & CẤP QUYỀN TRUY CẬP ẨN DANH (ANON)
-- =========================================================================

ALTER TABLE lockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE healing_wishes ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả nhân viên (anon) đọc và tương tác với tủ locker
CREATE POLICY "Public read lockers" ON lockers FOR SELECT USING (true);
CREATE POLICY "Public update lockers" ON lockers FOR UPDATE USING (true);
CREATE POLICY "Public insert lockers" ON lockers FOR INSERT WITH CHECK (true);

-- Cho phép gửi thư và đọc thư hồi âm
CREATE POLICY "Public read letters" ON feedback_letters FOR SELECT USING (true);
CREATE POLICY "Public insert letters" ON feedback_letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update letters" ON feedback_letters FOR UPDATE USING (true);

-- Cho phép đọc và treo lời nhắn lên cây đom đóm
CREATE POLICY "Public read wishes" ON healing_wishes FOR SELECT USING (true);
CREATE POLICY "Public insert wishes" ON healing_wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update wishes" ON healing_wishes FOR UPDATE USING (true);

-- =========================================================================
-- BẬT TÍNH NĂNG REALTIME (THÔNG BÁO TỨC THÌ GIỮA CÁC THIẾT BỊ)
-- =========================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE lockers;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback_letters;
ALTER PUBLICATION supabase_realtime ADD TABLE healing_wishes;

-- =========================================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA CHO CÁC CƠ SỞ Á CHÂU)
-- =========================================================================
INSERT INTO lockers (id, number, campus, alias, is_vacant, has_unread_reply)
VALUES
    (101, 'IPS-101', 'IPS Á Châu', 'Cánh Én Vàng', false, false),
    (102, 'IPS-102', 'IPS Á Châu', 'Chưa có chủ', true, false),
    (103, 'SIU-201', 'SIU Đại học', 'Mầm Cây Nhỏ', false, false),
    (104, 'SIU-202', 'SIU Đại học', 'Ngọn Gió Mát', false, false),
    (105, 'AIE-301', 'Khối Văn Phòng', 'Chưa có chủ', true, false),
    (106, 'AIE-302', 'Khối Văn Phòng', 'Đom Đóm Đêm', false, false),
    (107, 'IPS-103', 'IPS Á Châu', 'Chưa có chủ', true, false),
    (108, 'SIU-203', 'SIU Đại học', 'Họa Mi Buổi Sáng', false, false),
    (109, 'IAS-401', 'IAS Viện', 'Sách Cổ Nâu', false, false),
    (110, 'IPS-104', 'IPS Á Châu', 'Chưa có chủ', true, false),
    (111, 'SIU-204', 'SIU Đại học', 'Chưa có chủ', true, false),
    (112, 'AIE-303', 'Khối Văn Phòng', 'Ngọn Nến Ấm', false, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO healing_wishes (id, author_alias, campus, content, hugs, candles, tags)
VALUES
    ('w-1', 'Cô Giáo Lớp 3 (IPS Thăng Long)', 'IPS Á Châu', 'Hôm nay trời mưa to nhưng các bạn nhỏ vẫn ngoan ngoãn vào lớp đúng giờ. Nụ cười của học trò là liều thuốc chữa lành mọi mệt mỏi trong tuần!', 28, 14, ARRAY['Năng lượng tích cực', 'Học trò']),
    ('w-2', 'Trợ Giảng Thầm Lặng (SIU Lewis Campus)', 'SIU Đại học', 'Tuần bảo vệ đề án tốt nghiệp thật căng thẳng, nhưng nhìn thấy sinh viên hoàn thành bài thuyết trình tự tin, mình thấy công sức hướng dẫn bấy lâu thật xứng đáng.', 42, 21, ARRAY['Sinh viên SIU', 'Tận tâm']),
    ('w-3', 'Nhân Viên Hành Chính Bận Rộn', 'Khối Văn Phòng', 'Nhắc nhở bản thân và mọi người: Uống đủ 2 lít nước mỗi ngày và đứng dậy vươn vai sau 45 phút nhìn màn hình nhé đồng nghiệp ơi!', 50, 30, ARRAY['Chăm sóc sức khỏe', 'Đồng nghiệp'])
ON CONFLICT (id) DO NOTHING;
