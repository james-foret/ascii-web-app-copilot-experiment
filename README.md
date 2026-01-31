# ASCII Art Converter Web App

A modern, responsive web application that converts images to ASCII art with full support for animated GIFs.

*This web app was programmed entirely by AI, and was written as an experiment for a university assignment. Beyond prompting and ideation of software features, this is completely AI generated*

## Features

### Image Processing
- **Multiple Format Support**: JPG, PNG, GIF, BMP, WebP
- **Drag & Drop Upload**: Easy image uploading with drag-and-drop interface
- **Animated GIF Support**: Converts each frame of a GIF and plays as ASCII animation
- **Adjustable Settings**:
  - Width control (40-200 characters)
  - Contrast adjustment (0.5-2.0)
  - Color inversion option

### CRUD Operations
- **Create**: Upload and convert images to ASCII art
- **Read**: View full ASCII art in a modal viewer
- **Update**: Edit conversion settings and regenerate
- **Delete**: Remove individual items or clear all

### User Interface
- **Modern Design**: Clean, card-based layout with gradient colors
- **Pleasant Color Scheme**: Purple/indigo gradient theme
- **Dark Mode**: Automatic dark mode support based on system preferences
- **Mobile Responsive**: Optimized for all screen sizes (320px to desktop)
- **Smooth Animations**: Polished transitions and loading states

### Data Persistence
- **localStorage**: All converted images persist between browser sessions
- **Original Image Storage**: Keeps original images for re-processing
- **Settings Memory**: Stores conversion settings for each image

### Additional Features
- **Live Animation Preview**: Animated ASCII art in both gallery and modal
- **Copy to Clipboard**: Copy ASCII art with one click
- **Download**: Export ASCII art as text file (all frames for GIFs)
- **Toast Notifications**: User-friendly feedback messages
- **Error Handling**: Graceful handling of failed image loads

## Usage

1. **Start the Application**:
   ```bash
   python -m http.server 8000
   ```
   Then open http://localhost:8000 in your browser

2. **Upload an Image**:
   - Click the upload area or drag and drop an image
   - Supports: JPG, PNG, GIF, BMP, WebP

3. **Adjust Settings** (optional):
   - Use sliders to adjust width and contrast
   - Toggle color inversion if needed

4. **View ASCII Art**:
   - Click any gallery item to view full ASCII art
   - Animated GIFs will play automatically
   - Use copy/download buttons to save

5. **Edit or Delete**:
   - Click edit icon to adjust settings and regenerate
   - Click delete icon to remove an item

## Technical Details

### Image to ASCII Conversion Algorithm
- Converts images to grayscale using luminosity method
- Maps pixel brightness to ASCII character density
- Character ramp: ` .'^\`^\",:;Il!i><~+_-?][}{1)(|\\\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`
- Adjusts for character aspect ratio (0.5 multiplier)

### GIF Animation Support
- Uses `gifuct-js` library for frame extraction
- Preserves frame delays for accurate playback
- Converts each frame independently
- Renders animations in both gallery and modal views

### Storage
- Uses browser localStorage for persistence
- Stores images as base64 data URLs
- Maximum storage ~5-10MB depending on browser

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Full support

## Files

- `index.html` - Main HTML structure
- `styles.css` - Responsive CSS with modern design
- `script.js` - Application logic and ASCII conversion

## Credits

- GIF parsing: [gifuct-js](https://github.com/matt-way/gifuct-js)
- Icons: Feather Icons (inline SVG)
