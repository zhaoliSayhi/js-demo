/**
 * 参考 qrcode github: https://github.com/nuintun/qrcode
 * 第三方库 jsqr
 */

const TEST_NUMERIC = /^\d+$/;
const TEST_ALPHANUMERIC = /^[0-9A-Z$%*+-./: ]+$/;

export default class Decode {
  constructor() {
    this.canvas = document.getElementById('decode-canvas');
    this.context = this.canvas.getContext('2d');
    this.hasImage = false;
    this.imageData = null;
  }

  // 重置
  restDecoder() {
    this.hasImage = false;
    this.imageData = null;
  }

  // 绘制 canvas
  drawImage(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const actualWidth = Math.min(960, width);
      const actualHeight = height * (actualWidth / width);

      this.hasImage = true;
      this.canvas.width = actualWidth;
      this.canvas.height = actualHeight;

      this.context.drawImage(img, 0, 0, width, height, 0, 0, actualWidth, actualHeight);
      this.imageData = this.context.getImageData(0, 0, actualWidth, actualHeight);
    };

    img.src = src;
  }

  // 上传图片
  inputChange(e) {
    const file = e.target.files[0];

    if (file) {
      this.restDecoder();

      const reader = new FileReader();
      reader.onload = (e) => {
        this.drawImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  // 获取 canvas imageData
  getImageData() {
    this.imageData && this.context.putImageData(this.imageData, 0, 0);
    return this.imageData || this.context.getImageData(0,0, this.canvas.width, this.canvas.height);
  }

  // 解码
  decode() {
    if (!this.hasImage) return alert('请选择二维码图片');

    const imageData = this.getImageData();

    const result = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });

    if (result) {
      alert(result.data, '---result.data')

      // this.markQRCodeArea(result.location, result.version);
      // alert('二维码解析成功');
    } else {
      alert('二维码解析失败');
    }
  }
}
