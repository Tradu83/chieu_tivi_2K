# Ứng Dụng Phản Chiếu Màn Hình 2K

Ứng dụng phản chiếu màn hình điện thoại lên TV với khả năng tự động crop tỷ lệ và tăng độ phân giải.

## Tính Năng Chính

### 🎯 Crop Tỷ Lệ Tự Động
- **Từ 21:9 → 16:9**: Tự động crop màn hình điện thoại tỷ lệ 21:9 về 16:9 phù hợp với TV
- **Crop thông minh**: Giữ lại phần trung tâm của màn hình, loại bỏ các vùng thừa

### 📺 Độ Phân Giải 2K
- **Từ Full HD → 2K**: Tăng độ phân giải từ 1920x1080 lên 2560x1440
- **Chất lượng cao**: Hình ảnh sắc nét hơn trên TV 4K/2K

### ⏱️ Cập Nhật Định Kỳ
- **4 giây/lần**: Màn hình được cập nhật sau mỗi 4 giây
- **Hiệu suất tối ưu**: Giảm tải cho hệ thống

## Cấu Trúc File

```
custom-receiver/
├── index.html          # Giao diện chính
├── receiver.css        # Styling và responsive design
├── video-processor.js  # Logic xử lý video (crop, resize)
├── logo.png           # Logo ứng dụng
└── README.md          # Hướng dẫn này
```

## Cách Hoạt Động

### 1. Xử Lý Video
```javascript
// Khởi tạo VideoProcessor
const videoProcessor = new VideoProcessor();

// Bắt đầu xử lý khi video sẵn sàng
videoElement.addEventListener('loadedmetadata', () => {
  const processedStream = videoProcessor.startProcessing(videoElement);
  // Hiển thị stream đã xử lý
});
```

### 2. Crop Logic
```javascript
// Tính toán vùng crop
const targetRatio = 16 / 9;
const sourceRatio = sourceWidth / sourceHeight;

if (sourceRatio > targetRatio) {
  // Crop theo chiều rộng (21:9 → 16:9)
  cropHeight = sourceHeight;
  cropWidth = sourceHeight * targetRatio;
  cropX = (sourceWidth - cropWidth) / 2;
} else {
  // Crop theo chiều cao
  cropWidth = sourceWidth;
  cropHeight = sourceWidth / targetRatio;
  cropY = (sourceHeight - cropHeight) / 2;
}
```

### 3. Resize lên 2K
```javascript
// Vẽ frame đã crop lên canvas 2K
ctx.drawImage(
  videoElement,
  cropX, cropY, cropWidth, cropHeight,  // Source (đã crop)
  0, 0, 2560, 1440                      // Destination (2K)
);
```

## Cấu Hình

### Độ Phân Giải Đích
- **Width**: 2560px
- **Height**: 1440px
- **Tỷ lệ**: 16:9

### Tần Suất Cập Nhật
- **Interval**: 4000ms (4 giây)
- **FPS**: 30

### Hỗ Trợ Tỷ Lệ Nguồn
- ✅ 21:9 (crop về 16:9)
- ✅ 18:9 (crop về 16:9)
- ✅ 16:9 (giữ nguyên)
- ✅ 4:3 (crop về 16:9)

## Sử Dụng

1. **Kết nối điện thoại** với Chromecast
2. **Chọn ứng dụng** "Phan Chieu Man Hinh 2K"
3. **Bắt đầu phản chiếu** từ điện thoại
4. **Tự động xử lý**:
   - Crop tỷ lệ 21:9 → 16:9
   - Tăng độ phân giải lên 2K
   - Cập nhật mỗi 4 giây

## Yêu Cầu Hệ Thống

### TV/Chromecast
- Hỗ trợ độ phân giải 2K (2560x1440)
- Kết nối internet ổn định

### Điện Thoại
- Android/iOS với Google Home app
- Màn hình tỷ lệ 21:9 (hoặc khác 16:9)

## Troubleshooting

### Vấn Đề Thường Gặp

1. **Hình ảnh bị cắt quá nhiều**
   - Kiểm tra tỷ lệ màn hình điện thoại
   - Điều chỉnh logic crop trong `video-processor.js`

2. **Độ phân giải không đạt 2K**
   - Kiểm tra khả năng hỗ trợ của TV
   - Giảm độ phân giải trong cấu hình

3. **Cập nhật chậm**
   - Giảm interval trong `updateIntervalMs`
   - Tăng FPS nếu cần

### Debug
```javascript
// Xem thông tin xử lý
console.log(videoProcessor.getProcessingInfo());

// Kiểm tra kích thước nguồn
console.log('Source:', videoElement.videoWidth, 'x', videoElement.videoHeight);
```

## Tùy Chỉnh

### Thay Đổi Độ Phân Giải
```javascript
// Trong video-processor.js
this.targetWidth = 1920;  // Full HD
this.targetHeight = 1080;
```

### Thay Đổi Tần Suất Cập Nhật
```javascript
// Trong video-processor.js
this.updateIntervalMs = 2000; // 2 giây
```

### Thay Đổi Tỷ Lệ Đích
```javascript
// Trong video-processor.js
this.targetRatio = 4 / 3; // 4:3 thay vì 16:9
```

## Phiên Bản

- **v2.0**: Thêm crop 21:9 → 16:9 và tăng độ phân giải 2K
- **v1.0**: Phản chiếu cơ bản

## Tác Giả

Ứng dụng được phát triển để tối ưu hóa trải nghiệm phản chiếu màn hình từ điện thoại tỷ lệ 21:9 lên TV 16:9.
