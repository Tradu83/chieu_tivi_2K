/**
 * Cấu hình cho ứng dụng phản chiếu màn hình
 * Có thể tùy chỉnh các thông số tại đây
 */

const APP_CONFIG = {
  // Cấu hình độ phân giải đích
  resolution: {
    width: 2560,    // Độ rộng đích (2K)
    height: 1440,   // Độ cao đích (2K)
    ratio: 16/9     // Tỷ lệ khung hình đích
  },

  // Cấu hình xử lý video
  video: {
    fps: 30,                    // Frames per second
    updateInterval: 4000,       // Thời gian cập nhật (ms) - 4 giây
    quality: 'high',            // Chất lượng xử lý: 'low', 'medium', 'high'
    enableSmoothing: true       // Bật làm mượt hình ảnh
  },

  // Cấu hình crop
  crop: {
    enabled: true,              // Bật/tắt tính năng crop
    centerCrop: true,           // Crop từ trung tâm
    smartCrop: true,            // Crop thông minh (giữ nội dung quan trọng)
    padding: 0                  // Padding xung quanh vùng crop (px)
  },

  // Cấu hình hiển thị
  display: {
    showInfo: true,             // Hiển thị thông tin kỹ thuật
    showFPS: false,             // Hiển thị FPS
    showResolution: true,       // Hiển thị độ phân giải
    theme: 'dark'               // Giao diện: 'dark', 'light'
  },

  // Cấu hình hiệu suất
  performance: {
    enableHardwareAcceleration: true,  // Bật tăng tốc phần cứng
    maxMemoryUsage: 512,               // Giới hạn RAM sử dụng (MB)
    enableCaching: true,               // Bật cache
    cacheSize: 100                     // Kích thước cache (MB)
  },

  // Cấu hình debug
  debug: {
    enabled: false,             // Bật/tắt debug mode
    logLevel: 'info',           // Mức độ log: 'error', 'warn', 'info', 'debug'
    showConsole: false,         // Hiển thị console debug
    saveLogs: false             // Lưu logs
  },

  // Cấu hình tương thích
  compatibility: {
    minChromeVersion: '70',     // Phiên bản Chrome tối thiểu
    minCastVersion: '3',        // Phiên bản Cast tối thiểu
    supportedRatios: [          // Tỷ lệ màn hình được hỗ trợ
      '21:9', '18:9', '16:9', '4:3', '3:2'
    ],
    fallbackResolution: {       // Độ phân giải dự phòng
      width: 1920,
      height: 1080
    }
  }
};

// Hàm lấy cấu hình
function getConfig(key = null) {
  if (key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], APP_CONFIG);
  }
  return APP_CONFIG;
}

// Hàm cập nhật cấu hình
function updateConfig(key, value) {
  const keys = key.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, k) => obj[k], APP_CONFIG);
  target[lastKey] = value;
}

// Hàm kiểm tra tương thích
function checkCompatibility() {
  const userAgent = navigator.userAgent;
  const chromeVersion = userAgent.match(/Chrome\/(\d+)/);
  
  if (chromeVersion) {
    const version = parseInt(chromeVersion[1]);
    const minVersion = parseInt(APP_CONFIG.compatibility.minChromeVersion);
    return version >= minVersion;
  }
  
  return false;
}

// Hàm tối ưu cấu hình theo thiết bị
function optimizeForDevice() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  
  // Tự động điều chỉnh độ phân giải theo màn hình
  if (screenWidth < 1920) {
    APP_CONFIG.resolution.width = 1920;
    APP_CONFIG.resolution.height = 1080;
  }
  
  // Giảm FPS cho thiết bị yếu
  if (navigator.hardwareConcurrency < 4) {
    APP_CONFIG.video.fps = 24;
    APP_CONFIG.video.updateInterval = 5000; // 5 giây
  }
  
  // Tắt một số tính năng cho thiết bị cũ
  if (!checkCompatibility()) {
    APP_CONFIG.performance.enableHardwareAcceleration = false;
    APP_CONFIG.video.enableSmoothing = false;
  }
}

// Export cho sử dụng global
window.APP_CONFIG = APP_CONFIG;
window.getConfig = getConfig;
window.updateConfig = updateConfig;
window.checkCompatibility = checkCompatibility;
window.optimizeForDevice = optimizeForDevice;

// Tự động tối ưu khi load
document.addEventListener('DOMContentLoaded', () => {
  optimizeForDevice();
  console.log('App config loaded:', APP_CONFIG);
});
