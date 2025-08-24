/**
 * Video Processor cho ứng dụng phản chiếu màn hình
 * Xử lý crop từ tỷ lệ 21:9 về 16:9 và tăng độ phân giải lên 2K
 */

class VideoProcessor {
  constructor() {
    this.canvas = document.getElementById('processing-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.mediaStream = null;
    this.updateInterval = null;
    this.isProcessing = false;
    
    // Lấy cấu hình từ config
    const config = getConfig();
    
    // Thiết lập canvas với độ phân giải từ config
    this.canvas.width = config.resolution.width;
    this.canvas.height = config.resolution.height;
    
    // Cấu hình xử lý từ config
    this.targetWidth = config.resolution.width;
    this.targetHeight = config.resolution.height;
    this.targetRatio = config.resolution.ratio;
    this.updateIntervalMs = config.video.updateInterval;
    this.fps = config.video.fps;
    
    // Cấu hình bổ sung
    this.enableSmoothing = config.video.enableSmoothing;
    this.cropEnabled = config.crop.enabled;
    this.centerCrop = config.crop.centerCrop;
    
    // Thiết lập smoothing nếu được bật
    if (this.enableSmoothing) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
  }

  /**
   * Tính toán vùng crop để chuyển từ tỷ lệ nguồn về tỷ lệ đích
   */
  calculateCropArea(sourceWidth, sourceHeight) {
    // Nếu crop bị tắt, trả về toàn bộ frame
    if (!this.cropEnabled) {
      return { cropX: 0, cropY: 0, cropWidth: sourceWidth, cropHeight: sourceHeight };
    }
    
    const sourceRatio = sourceWidth / sourceHeight;
    
    let cropWidth, cropHeight, cropX, cropY;
    
    if (sourceRatio > this.targetRatio) {
      // Nguồn rộng hơn mục tiêu (21:9) - crop theo chiều rộng
      cropHeight = sourceHeight;
      cropWidth = sourceHeight * this.targetRatio;
      cropX = this.centerCrop ? (sourceWidth - cropWidth) / 2 : 0;
      cropY = 0;
    } else {
      // Nguồn cao hơn mục tiêu - crop theo chiều cao
      cropWidth = sourceWidth;
      cropHeight = sourceWidth / this.targetRatio;
      cropX = 0;
      cropY = this.centerCrop ? (sourceHeight - cropHeight) / 2 : 0;
    }
    
    return { cropX, cropY, cropWidth, cropHeight };
  }

  /**
   * Xử lý một frame video
   */
  processFrame(videoElement) {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return false;
    }

    try {
      const sourceWidth = videoElement.videoWidth;
      const sourceHeight = videoElement.videoHeight;
      
      // Tính toán vùng crop
      const { cropX, cropY, cropWidth, cropHeight } = this.calculateCropArea(sourceWidth, sourceHeight);
      
      // Xóa canvas
      this.ctx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      
      // Vẽ frame đã crop lên canvas với độ phân giải 2K
      this.ctx.drawImage(
        videoElement,
        cropX, cropY, cropWidth, cropHeight,  // Source rectangle
        0, 0, this.targetWidth, this.targetHeight  // Destination rectangle (2K)
      );
      
      return true;
    } catch (error) {
      console.error('Lỗi khi xử lý frame:', error);
      return false;
    }
  }

  /**
   * Bắt đầu xử lý video
   */
  startProcessing(videoElement) {
    if (this.isProcessing) {
      this.stopProcessing();
    }

    console.log('Bắt đầu xử lý video...');
    console.log('Kích thước nguồn:', videoElement.videoWidth, 'x', videoElement.videoHeight);
    console.log('Kích thước đích:', this.targetWidth, 'x', this.targetHeight);

    this.isProcessing = true;

    // Tạo stream từ canvas
    this.mediaStream = this.canvas.captureStream(this.fps);
    
    // Bắt đầu cập nhật frame
    this.updateInterval = setInterval(() => {
      if (this.isProcessing) {
        this.processFrame(videoElement);
      }
    }, this.updateIntervalMs);

    return this.mediaStream;
  }

  /**
   * Dừng xử lý video
   */
  stopProcessing() {
    console.log('Dừng xử lý video...');
    
    this.isProcessing = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  /**
   * Lấy thông tin về quá trình xử lý
   */
  getProcessingInfo() {
    const config = getConfig();
    return {
      targetResolution: `${this.targetWidth}x${this.targetHeight}`,
      targetRatio: `${Math.round(this.targetRatio * 100) / 100}:1`,
      updateInterval: `${this.updateIntervalMs / 1000}s`,
      fps: this.fps,
      isProcessing: this.isProcessing,
      cropEnabled: this.cropEnabled,
      smoothingEnabled: this.enableSmoothing,
      config: config
    };
  }
}

// Export cho sử dụng global
window.VideoProcessor = VideoProcessor;
