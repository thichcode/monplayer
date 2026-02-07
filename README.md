# MON Player - IPTV Player

Trình phát IPTV hiện đại với giao diện đẹp mắt và dễ sử dụng.

## Tính năng

- 📺 Phát video trực tiếp qua HLS stream
- 🌐 Hỗ trợ nhiều nguồn IPTV JSON
- 🎨 Giao diện hiện đại, responsive
- ⚡ Tự động tải playlist khi khởi động
- 🔧 Dễ dàng đóng gói thành exe

## Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm

### Cài đặt dependencies
```bash
npm install
```

## Sử dụng

### Chạy development server
```bash
npm start
```
Sau đó mở trình duyệt truy cập http://localhost:3000

### Đóng gói thành exe
```bash
npm run build
```
Sau khi build xong sẽ có file `monplayer.exe`

### Chạy ứng dụng đã đóng gói
1. Chạy `start.bat` để khởi động server và mở trình duyệt
2. Chạy `stop.bat` để dừng server

## Sử dụng file EXE

### Cách sử dụng đơn giản
1. **Chạy file EXE**: Nhấn đúp vào file `monplayer.exe` để khởi động ứng dụng
2. **Tự động mở trình duyệt**: Ứng dụng sẽ tự động mở trình duyệt và truy cập vào http://localhost:3000
3. **Sử dụng**: Giao diện người dùng sẽ hiển thị, bạn có thể chọn kênh và bắt đầu xem

### Cách sử dụng bằng batch file
1. **Khởi động ứng dụng**: Chạy file `start.bat` để khởi động server và mở trình duyệt
2. **Dừng ứng dụng**: Chạy file `stop.bat` để dừng server

### Cấu hình trước khi sử dụng
- **Sửa config.json**: Trước khi chạy, bạn có thể sửa file `config.json` để thay đổi các thiết lập như URL playlist mặc định, port server, tiêu đề ứng dụng, v.v.
- **Kiểm tra port**: Đảm bảo port được cấu hình (mặc định là 3000) không bị chiếm dụng bởi ứng dụng khác

### Troubleshooting khi sử dụng EXE
- **Lỗi "monplayer.exe not found"**: Đảm bảo bạn đã chạy `npm run build` để tạo file exe trước
- **Lỗi port đã được sử dụng**: Sửa file `config.json` để đổi port khác hoặc kill process đang dùng port 3000
- **Không thể mở trình duyệt**: Kiểm tra xem trình duyệt mặc định có hoạt động không, có thể mở trình duyệt và truy cập http://localhost:3000 thủ công

## Cấu hình

Sửa file `config.json` để thay đổi các thiết lập:
- `defaultUrl`: URL playlist mặc định
- `port`: Port server (mặc định 3000)
- `autoOpenBrowser`: Tự động mở trình duyệt (true/false)
- `title`: Tiêu đề ứng dụng

## Cấu trúc thư mục
```
monplayer/
├── monplayer.exe          # Server đã đóng gói (sau khi build)
├── start.bat             # Khởi động server + mở browser
├── stop.bat              # Dừng server
├── config.json           # Cấu hình ứng dụng
├── index.html            # Giao diện người dùng
├── style.css             # CSS styling
├── script.js             # JavaScript logic
├── server.js             # Node.js server
├── package.json          # Dependencies
└── README.md             # File hướng dẫn
```

## Build cho nhiều nền tảng
```bash
npm run build-all
```
Lệnh này sẽ tạo exe cho Windows, Linux và macOS.

## Troubleshooting

### Lỗi "monplayer.exe not found"
- Chạy `npm run build` để tạo file exe trước
- Kiểm tra file `monplayer.exe` có tồn tại không

### Lỗi port đã được sử dụng
- Sửa file `config.json` để đổi port khác
- Hoặc kill process đang dùng port 3000

### Không thể mở trình duyệt
- Kiểm tra xem trình duyệt mặc định có hoạt động không
- Có thể mở trình duyệt và truy cập http://localhost:3000 thủ công

## License
MIT