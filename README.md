# PixConvert

PixConvert is a web-based image conversion and compression application built with Python, Flask, Pillow, HTML, CSS, and JavaScript.

The application allows users to upload one or multiple images, convert them between supported image formats, adjust output quality, preview selected files, and download the converted results.

## Features

- Convert images between multiple formats
- Support for single and multiple image uploads
- Drag-and-drop file uploading
- Image preview before conversion
- Remove individual files before conversion
- Clear all selected files
- Adjustable output quality
- Batch image conversion
- Automatic ZIP generation for multiple converted images
- Client-side upload interface with conversion progress feedback
- Responsive user interface
- Server-side image processing using Pillow

## Supported Formats

| Format | Extension | Supported |
|--------|-----------|-----------|
| JPEG | `.jpg` / `.jpeg` | Yes |
| PNG | `.png` | Yes |
| WebP | `.webp` | Yes |
| BMP | `.bmp` | Yes |
| GIF | `.gif` | Yes |
| TIFF | `.tiff` | Yes |

Examples:

```text
JPEG → PNG
PNG → JPEG
JPEG → WebP
WebP → JPEG
PNG → WebP
JPEG → JPEG
PNG → PNG
BMP → JPEG
TIFF → PNG
```

The application can also reduce JPEG and WebP file sizes through the quality control.

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- FileReader API
- Fetch API
- Drag and Drop API

### Backend

- Python
- Flask
- Pillow

### Development Tools

- Visual Studio Code
- Git
- GitHub
- GitHub Desktop

## Application Architecture

```text
User
 |
 v
Web Interface
(HTML / CSS / JavaScript)
 |
 | HTTP Request
 v
Flask Backend
 |
 v
Pillow Image Processing
 |
 +----------------------+
 |                      |
 v                      v
Single Image         Multiple Images
 |                      |
 v                      v
Direct Download      ZIP Archive
```

## Project Structure

```text
PixConvert/
|
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
|
├── templates/
│   └── index.html
|
├── static/
│   ├── style.css
│   └── app.js
|
├── converted/
|
└── venv/
```

The `venv/` directory contains the local Python virtual environment and is excluded from version control.

The `converted/` directory is used for generated conversion files and is also excluded from version control.

## How It Works

### 1. File Selection

Users can select images through the file picker or drag and drop them into the upload area.

### 2. File Preview

Selected images are displayed in the interface before conversion. Users can remove individual images or clear the entire selection.

### 3. Conversion Settings

Users select the desired output format and adjust the image quality.

### 4. Backend Processing

The frontend sends the selected files and conversion settings to the Flask `/convert` endpoint.

Flask receives the files and uses Pillow to process the images.

### 5. Output Generation

For a single image, the converted file is returned directly to the browser.

For multiple images, the converted files are packaged into a ZIP archive before being downloaded.

## Installation

### Prerequisites

- Python 3.x
- Git

### Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/PixConvert.git
cd PixConvert
```

### Create a Virtual Environment

Windows:

```bash
python -m venv venv
```

### Activate the Virtual Environment

Windows PowerShell:

```bash
venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

Start the Flask development server:

```bash
python app.py
```

The application will be available at:

```text
http://127.0.0.1:5000
```

## API Endpoint

### `GET /`

Returns the main application interface.

### `POST /convert`

Processes uploaded images and returns the converted output.

#### Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `images` | File | One or more image files |
| `format` | String | Desired output format |
| `quality` | Integer | Output quality value |

Supported format values:

```text
JPEG
PNG
WEBP
BMP
GIF
TIFF
```

## Image Processing

PixConvert uses the Pillow library for image processing.

JPEG does not support transparency, so images containing transparency are converted to RGB before being saved as JPEG.

JPEG and WebP output quality can be controlled using the quality setting provided by the user.

## File Handling

Each conversion request is assigned a unique identifier.

Converted files are stored in:

```text
converted/<conversion-id>/
```

When multiple images are converted, the application creates:

```text
converted/<conversion-id>.zip
```

Generated files are excluded from Git version control.

## Privacy

When running the application locally, image processing takes place on the local machine running the Flask application.

When deployed to a remote server, image processing takes place on that server.

The project does not require an external third-party image conversion API.

## Security Considerations

The application includes basic file validation and filename sanitization.

Uploaded filenames are sanitized before being used to create output files.

Supported output formats are restricted to a predefined list.

For a production deployment, additional protections should be considered, including:

- Maximum upload size
- Request rate limiting
- Automatic cleanup of temporary files
- Production WSGI server
- Secure deployment configuration
- Additional validation of uploaded image content

## Current Limitations

- Temporary converted files are not automatically cleaned up.
- Large images may require significant memory during processing.
- The application does not currently provide user authentication.
- Image editing features such as cropping, resizing, and rotation are not currently implemented.
- Conversion progress shown in the frontend is a visual progress indicator rather than a real-time server-side processing percentage.

## Future Improvements

- Image resizing
- Image cropping
- Image rotation
- Image compression statistics
- Before-and-after file size comparison
- Compression percentage calculation
- Automatic temporary file cleanup
- Maximum upload size configuration
- Improved error handling
- Additional image formats
- Production deployment
- User accounts and conversion history
- Progressive Web App support

## Development

To contribute to development:

1. Fork the repository.
2. Create a new branch.
3. Make the required changes.
4. Test the application locally.
5. Commit the changes.
6. Open a pull request.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new image processing feature"
git push origin feature/new-feature
```

## License

This project is currently intended for educational and personal use.

A formal open-source license can be added if the project is later distributed publicly.

## Author

Developed as a full-stack web development project using Python, Flask, Pillow, HTML, CSS, and JavaScript.
