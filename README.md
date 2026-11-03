# 🏫 Hành Lang Locker & Trạm Chữa Lành • Tập Đoàn Giáo Dục Quốc Tế Á Châu (GAIE)

Một ứng dụng web nội bộ hoàn chỉnh theo phong cách **2D Cozy Adventure / Point-and-Click**, phục vụ cán bộ, giáo viên và nhân viên toàn hệ thống Tập đoàn Á Châu (**Trường Quốc tế Á Châu IPS**, **Trường Đại học Quốc tế Sài Gòn SIU**, **Viện Nghiên cứu Châu Á IAS**).

---

## 🌟 Tính Năng Nổi Bật

### 1. 🚪 Hệ Thống Tủ Locker Ẩn Danh (Zero-Login & Zero-Leak)
* **Không cần đăng nhập:** Nhân viên không cần nhập Email, SĐT hay tên thật.
* **Bảo mật thiết bị:** Tự động sinh `Device Secret Key` lưu trong trình duyệt. Người khác nhấp vào tủ của bạn sẽ thấy khóa kín.
* **Mật mã khẩn cấp 4 từ:** Tự động cấp 4 từ tiếng Việt bí mật (ví dụ: `mai-vang-nang-am`) để phục hồi quyền mở tủ nếu đổi thiết bị hoặc xóa lịch sử duyệt web.
* **Đèn thư đỏ nhấp nháy:** Khi Ban PR Nội Bộ phản hồi, trên tủ của nhân viên sẽ tự động sáng lá thư đỏ báo có tin mới.

### 2. 📬 Phân Khu "Nghe Bạn" (Feedback & Đối Thoại Hai Chiều)
* Soạn thư tay phong cách giấy da cổ điển gửi tới các phòng ban (Ban Giám Hiệu, PR Nội Bộ, Cơ sở vật chất, Học cụ...).
* Hoạt họa chim bồ câu đưa thư bay đi.
* Nhận thư hồi âm chính thức từ Ban PR và lưu trữ ngay trong hòm thư cá nhân của tủ.

### 3. 🌿 Phân Khu "Trạm Chữa Lành" (Inspired by [ngheban.com](https://ngheban.com/))
* **Hòm xả muộn phiền:** Viết ra những áp lực, mệt mỏi trong ngày rồi nhấn nút "Đốt cháy thành tro bụi" để xả stress tức thì.
* **Cây Đom Đóm:** Đọc những mẩu chuyện vui, lời chúc ấm áp từ đồng nghiệp Á Châu và gửi tặng những cái ôm 🫂 hoặc thắp nến 🕯️.
* **Radio Lofi Á Châu:** Âm thanh thư giãn tự nhiên (tiếng mưa rơi trên mái trường, giai điệu Lofi piano) tạo bằng Web Audio API, không sợ lỗi file 404.
* **Vườn cây hạnh phúc:** Mini-game tưới nước mỗi ngày để nuôi dưỡng mầm cây lớn lên qua các cấp độ.
* **Bốt tư vấn 1:1:** Đặt lịch hẹn trò chuyện kín đáo với chuyên viên tâm lý hoặc HR của trường.

### 4. 🌸 Decor Động Theo Mùa Lễ Hội
* Chuyển đổi linh hoạt giữa:
  * 🌸 **Tết Nguyên Đán:** Hoa mai vàng rơi nhẹ, đèn lồng đỏ lung linh.
  * ❄️ **Giáng Sinh:** Tuyết rơi, nhánh thông xanh, chuông vàng.
  * ☀️ **Mùa Tựu Trường:** Ánh nắng ban mai ấm áp chiếu qua khung cửa sổ.

### 5. 🛡️ Bảng Điều Phối Ban PR Nội Bộ (Operator Panel)
* Nhấn vào nút "Ban PR" trên thanh menu để mở giao diện quản trị viên:
  * Xem toàn bộ thư góp ý của nhân viên theo mã ẩn danh.
  * Soạn câu trả lời và nhấn gửi hồi âm -> Lập tức tủ của nhân viên đó nhấp nháy đèn thư đỏ!

---

## 🚀 Hướng Dẫn Chạy Thử Trên Máy (Local)

1. Mở terminal tại thư mục này và chạy:
   ```bash
   npm run dev
   ```
2. Mở trình duyệt tại đường dẫn hiển thị (thường là `http://localhost:5173/`).

---

## 🌐 Hướng Dẫn Đẩy Lên GitHub Pages (Hoàn Toàn Miễn Phí)

Trang web đã được cấu hình sẵn **100% tương thích với GitHub Pages** (đường dẫn tương đối `base: './'`, định tuyến SPA chống lỗi 404, âm thanh Web Audio nội bộ).

### Các bước thực hiện:

1. **Tạo một Repository mới trên GitHub** (ví dụ đặt tên là `Laurel-Ng`).

2. **Khởi tạo Git và liên kết với GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete GAIE locker room and healing platform"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-github-cua-ban>/Laurel-Ng.git
   git push -u origin main
   ```

3. **Cập nhật URL trong `package.json`:**
   Mở file `package.json`, thêm dòng `homepage`:
   ```json
   "homepage": "https://<tai-khoan-github-cua-ban>.github.io/Laurel-Ng"
   ```

4. **Đẩy lên GitHub Pages chỉ với 1 câu lệnh:**
   ```bash
   npm run deploy
   ```
   Lệnh này sẽ tự động build code và đẩy lên nhánh `gh-pages` của GitHub.

5. **Kích hoạt trên GitHub:**
   - Vào mục **Settings** của repository trên GitHub -> chọn **Pages**.
   - Tại mục **Build and deployment > Source**, chọn **Deploy from a branch**.
   - Chọn nhánh **`gh-pages`** và thư mục **`/(root)`** -> Nhấn **Save**.
   - Sau 1 - 2 phút, website của bạn sẽ chính thức hoạt động tại địa chỉ:
     `https://<tai-khoan-github-cua-ban>.github.io/Laurel-Ng/`

6. **Tạo mã QR:**
   Nhấn nút **"Quét QR"** trên thanh menu website để lấy mã QR in ra dán tại bảng tin trường!
