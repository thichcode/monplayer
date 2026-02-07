# MON Player - IPTV Player

A modern IPTV player with beautiful and easy-to-use interface.

## Features

- 📺 Live video streaming via HLS
- 🌐 Support for multiple IPTV JSON sources
- 🎨 Modern, responsive interface
- ⚡ Automatic playlist loading on startup
- 🔧 Easy to package as exe

## Installation

### System Requirements
- Node.js 18+
- npm

### Install dependencies
```bash
npm install
```

## Usage

### Run development server
```bash
npm start
```
Then open your browser and visit http://localhost:3000

### Package as exe
```bash
npm run build
```
After build completion, you will have a `monplayer.exe` file

### Run packaged application
1. Run `start.bat` to start server and open browser
2. Run `stop.bat` to stop server

## Using the EXE File

### Simple usage method
1. **Run the EXE file**: Double-click on `monplayer.exe` to start the application
2. **Automatic browser opening**: The application will automatically open your browser and access http://localhost:3000
3. **Use the application**: The user interface will display, you can select channels and start watching

### Using with batch files
1. **Start application**: Run `start.bat` to start server and open browser
2. **Stop application**: Run `stop.bat` to stop server

### Configuration before use
- **Edit config.json**: Before running, you can edit the `config.json` file to change settings such as default playlist URL, server port, application title, etc.
- **Check port**: Make sure the configured port (default is 3000) is not occupied by other applications

### Troubleshooting when using EXE
- **"monplayer.exe not found" error**: Make sure you have run `npm run build` to create the exe file first
- **Port already in use error**: Edit the `config.json` file to change to a different port or kill the process using port 3000
- **Cannot open browser**: Check if your default browser is working, you can manually open browser and visit http://localhost:3000

## Configuration

Edit the `config.json` file to change settings:
- `defaultUrl`: Default playlist URL
- `port`: Server port (default 3000)
- `autoOpenBrowser`: Automatically open browser (true/false)
- `title`: Application title

## Directory Structure
```
monplayer/
├── monplayer.exe          # Packaged server (after build)
├── start.bat             # Start server + open browser
├── stop.bat              # Stop server
├── config.json           # Application configuration
├── index.html            # User interface
├── style.css             # CSS styling
├── script.js             # JavaScript logic
├── server.js             # Node.js server
├── package.json          # Dependencies
└── README.md             # Instructions file
```

## Build for multiple platforms
```bash
npm run build-all
```
This command will create exe files for Windows, Linux, and macOS.

## Troubleshooting

### "monplayer.exe not found" error
- Run `npm run build` to create the exe file first
- Check if the `monplayer.exe` file exists

### Port already in use error
- Edit the `config.json` file to change to a different port
- Or kill the process using port 3000

### Cannot open browser
- Check if your default browser is working
- You can manually open browser and visit http://localhost:3000

## License
MIT