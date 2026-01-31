// ASCII Art Converter Application
class AsciiArtConverter {
    constructor() {
        // ASCII character sets for different styles
        this.asciiStyles = {
            standard: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
            detailed: " .'`^\",:;-_+<>i!lI?/\\|()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*WMB8&%$#@",
            simple: " .:-=+*#%@",
            blocks: " ░▒▓█",
            binary: " 01",
            minimal: " .·:∴",
            retro: " .:!*oe&#%@",
            matrix: " .:-=+*#ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ",
            emoji: " 🌑🌘🌗🌖🌕",
            custom: ""
        };
        
        this.asciiChars = this.asciiStyles.standard;
        this.images = [];
        this.currentSettings = {
            width: 80,
            contrast: 1.0,
            brightness: 1.0,
            saturation: 1.0,
            sharpness: 0,
            bitDepth: 8,
            invert: false,
            asciiStyle: 'standard',
            customChars: '',
            colorMode: 'monochrome',
            customColor: '#00ff00',
            backgroundColor: '#000000',
            edgeDetect: false,
            dithering: false,
            removeBackground: false,
            targetBackgroundColor: '#ffffff',
            backgroundTolerance: 30
        };        this.idCounter = Date.now();
        this.galleryAnimations = [];
        this.animationInterval = null;
        this.previewData = null; // Stores current preview image data
        this.previewAnimationInterval = null;
        this.isPanning = false;
        this.panStartX = 0;
        this.panStartY = 0;
        
        this.init();
    }

    init() {
        this.loadImages();
        this.setupEventListeners();
        this.renderGallery();
    }

    // ============= Helper Methods =============
    addEventListenerToAll(selector, event, callback) {
        document.querySelectorAll(selector).forEach((element) => {
            element.addEventListener(event, () => callback(element));
        });
    }

    getElement(id) {
        return document.getElementById(id);
    }

    setupUploadArea() {
        const uploadArea = this.getElement('uploadArea');
        const imageInput = this.getElement('imageInput');

        uploadArea.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => {
            if (e.target.files[0]) this.processImage(e.target.files[0]);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('drag-over');
        }, false);

        uploadArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('drag-over');
        }, false);

        uploadArea.addEventListener('dragleave', (e) => {
            if (e.target === uploadArea) uploadArea.classList.remove('drag-over');
        }, false);

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('drag-over');

            let file = null;
            if (e.dataTransfer.items?.[0]?.kind === 'file') {
                file = e.dataTransfer.items[0].getAsFile();
            } else if (e.dataTransfer.files?.[0]) {
                file = e.dataTransfer.files[0];
            }

            if (file) {
                const validExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
                if (file.type.startsWith('image/') || validExtensions.test(file.name)) {
                    this.processImage(file);
                } else {
                    this.showToast('Please upload an image file', 'error');
                }
            }
        }, false);
    }

    setupSliderListeners() {
        const sliders = [
            { id: 'widthSlider', key: 'width', parser: parseInt, display: 'widthValue', format: v => v },
            { id: 'contrastSlider', key: 'contrast', parser: parseFloat, display: 'contrastValue', format: v => v.toFixed(1) },
            { id: 'brightnessSlider', key: 'brightness', parser: parseFloat, display: 'brightnessValue', format: v => v.toFixed(1) },
            { id: 'saturationSlider', key: 'saturation', parser: parseFloat, display: 'saturationValue', format: v => v.toFixed(1) },
            { id: 'sharpnessSlider', key: 'sharpness', parser: parseFloat, display: 'sharpnessValue', format: v => v.toFixed(1) },
            { id: 'bitDepthSlider', key: 'bitDepth', parser: parseInt, display: 'bitDepthValue', format: v => v },
        ];

        sliders.forEach(({ id, key, parser, display, format }) => {
            const slider = this.getElement(id);
            const displayEl = this.getElement(display);
            slider.addEventListener('input', (e) => {
                this.currentSettings[key] = parser(e.target.value);
                displayEl.textContent = format(this.currentSettings[key]);
                this.updatePreview();
            });
        });

        // Checkboxes
        this.setupCheckboxListener('invertCheckbox', 'invert');
        this.setupCheckboxListener('edgeDetectCheckbox', 'edgeDetect');
        this.setupCheckboxListener('ditheringCheckbox', 'dithering');
        this.setupCheckboxListener('removeBackgroundCheckbox', 'removeBackground');

        // Select inputs
        this.setupSelectListener('asciiStyle', 'asciiStyle', () => {
            const val = this.currentSettings.asciiStyle;
            this.getElement('customCharsGroup').style.display = val === 'custom' ? 'block' : 'none';
            if (val !== 'custom') this.asciiChars = this.asciiStyles[val];
            this.updatePreview();
        });

        this.setupSelectListener('colorMode', 'colorMode', () => {
            const val = this.currentSettings.colorMode;
            this.getElement('customColorGroup').style.display = val === 'custom' ? 'block' : 'none';
            this.updatePreview();
        });

        // Color and custom inputs
        this.getElement('customChars').addEventListener('input', (e) => {
            if (this.currentSettings.asciiStyle === 'custom') {
                this.currentSettings.customChars = e.target.value;
                this.asciiChars = e.target.value || this.asciiStyles.standard;
                this.updatePreview();
            }
        });

        this.getElement('customColor').addEventListener('input', (e) => {
            this.currentSettings.customColor = e.target.value;
            this.updatePreview();
        });

        this.getElement('backgroundColor').addEventListener('input', (e) => {
            this.currentSettings.backgroundColor = e.target.value;
            this.updatePreview();
        });

        // Preview actions
        this.getElement('saveToGalleryBtn').addEventListener('click', () => this.savePreviewToGallery());
        this.getElement('exportHtmlBtn').addEventListener('click', () => this.exportAsHtml());
        this.getElement('cancelPreviewBtn').addEventListener('click', () => this.cancelPreview());

        // Zoom and pan
        this.getElement('asciiZoomIn').addEventListener('click', () => this.zoomPreviewAscii(1.1));
        this.getElement('asciiZoomOut').addEventListener('click', () => this.zoomPreviewAscii(0.9));
        this.setupPanningControls();

        // Gallery actions
        this.getElement('clearAllBtn').addEventListener('click', () => this.clearAll());

        // Modal
        const modal = this.getElement('modal');
        this.getElement('closeModal').addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        this.getElement('copyBtn').addEventListener('click', () => this.copyToClipboard());
        this.getElement('downloadBtn').addEventListener('click', (e) => this.showDownloadMenu(e));
    }

    setupCheckboxListener(id, key) {
        this.getElement(id).addEventListener('change', (e) => {
            this.currentSettings[key] = e.target.checked;
            this.updatePreview();
        });
    }

    setupSelectListener(id, key, callback) {
        this.getElement(id).addEventListener('change', (e) => {
            this.currentSettings[key] = e.target.value;
            callback();
        });
    }

    closeModal() {
        this.stopModalAnimation();
        this.getElement('modal').classList.remove('active');
    }

    setupEventListeners() {
        // Tab navigation
        this.addEventListenerToAll('.tab-btn', 'click', (button) => {
            this.setActiveTab(button.dataset.tab);
        });

        // Prevent default drag and drop behavior on the entire page
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        // Upload area setup
        this.setupUploadArea();

        // Slider and input listeners
        this.setupSliderListeners();
    }

    stopModalAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    processImage(file, skipGifCheck = false) {
        // Check if it's a GIF for animation handling
        if (!skipGifCheck && file.type === 'image/gif') {
            this.processGif(file);
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                try {
                    // Store preview data instead of immediately adding to gallery
                    this.previewData = {
                        fileName: file.name,
                        fileSize: file.size,
                        originalImage: e.target.result,
                        imageElement: img,
                        isAnimated: false
                    };
                    
                    this.showPreview();
                } catch (error) {
                    console.error('Error loading image:', error);
                    this.showToast('Failed to load image. Please try a different image.', 'error');
                }
            };

            img.onerror = () => {
                console.error('Failed to load image');
                this.showToast('Failed to load image. The file may be corrupted.', 'error');
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            console.error('Failed to read file');
            this.showToast('Failed to read file. Please try again.', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    async processGif(file) {
        try {
            this.showToast('Processing GIF animation...', 'success');
            
            const arrayBuffer = await file.arrayBuffer();
            const frames = await this.parseGif(arrayBuffer);
            
            if (!frames || frames.length === 0) {
                throw new Error('No frames found in GIF');
            }

            // Create a data URL for the original GIF
            const reader = new FileReader();
            reader.onload = (e) => {
                // Store preview data for animated GIF
                this.previewData = {
                    fileName: file.name,
                    fileSize: file.size,
                    originalImage: e.target.result,
                    frames: frames,
                    isAnimated: true,
                    frameCount: frames.length
                };
                
                this.showPreview();
                this.showToast(`GIF loaded with ${frames.length} frames!`, 'success');
            };
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Error processing GIF:', error);
            this.showToast('Failed to process GIF animation. Processing as static image...', 'error');
            // Fallback to static processing - skip GIF check to avoid infinite loop
            this.processImage(file, true);
        }
    }

    async parseGif(arrayBuffer) {
        try {
            // Use gifuct-js library to parse GIF
            const gif = window.gifuct.parseGIF(arrayBuffer);
            const frames = window.gifuct.decompressFrames(gif, true);
            
            if (!frames || frames.length === 0) {
                throw new Error('No frames in GIF');
            }

            // Convert frame data to Image objects
            const imageFrames = [];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            for (let i = 0; i < frames.length; i++) {
                const frame = frames[i];
                canvas.width = frame.dims.width;
                canvas.height = frame.dims.height;

                // Create ImageData from the frame patch
                const imageData = new ImageData(
                    new Uint8ClampedArray(frame.patch),
                    frame.dims.width,
                    frame.dims.height
                );

                ctx.putImageData(imageData, 0, 0);

                // Convert canvas to Image
                const img = new Image();
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.src = canvas.toDataURL();
                });

                imageFrames.push({
                    image: img,
                    delay: frame.delay || 100 // delay in centiseconds (100 = 1 second)
                });
            }

            return imageFrames;
        } catch (error) {
            console.error('GIF parsing error:', error);
            throw error;
        }
    }

    async loadGifFrames(arrayBuffer) {
        return this.parseGif(arrayBuffer);
    }

    showPreview() {
        if (!this.previewData) return;

        // Show preview section and switch to editor tab
        document.getElementById('previewSection').style.display = 'block';
        const uploadSection = document.getElementById('uploadSection');
        const editorTab = document.getElementById('editorTab');
        if (uploadSection) {
            uploadSection.style.display = 'none';
        }
        if (editorTab) {
            editorTab.classList.add('editing');
        }
        this.setActiveTab('editorTab');

        // Generate and show ASCII preview
        this.updatePreview();

        // Scroll to preview
        document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updatePreview() {
        if (!this.previewData) return;

        if (this.previewData.isAnimated) {
            // Convert all frames with current settings
            const asciiFrames = [];
            for (let i = 0; i < this.previewData.frames.length; i++) {
                const result = this.convertToAscii(this.previewData.frames[i].image);
                asciiFrames.push({
                    ascii: result.text,
                    colors: result.colors,
                    delay: this.previewData.frames[i].delay
                });
            }

            this.previewData.asciiFrames = asciiFrames;

            // Start animation in preview
            this.startPreviewAnimation();

            // Update dimensions display
            const height = Math.floor(this.currentSettings.width * 0.5);
            document.getElementById('previewDimensions').textContent = 
                `(${this.currentSettings.width}x${height} chars, ${this.previewData.frameCount} frames)`;
        } else {
            // Stop any existing preview animation
            if (this.previewAnimationInterval) {
                clearInterval(this.previewAnimationInterval);
                this.previewAnimationInterval = null;
            }

            // Convert single image
            const result = this.convertToAscii(this.previewData.imageElement);
            
            // Store color data in previewData
            this.previewData.coloredOutput = result;
            
            this.applyColorToPreview(result.text, result.colors);

            // Update dimensions display
            const height = Math.floor(this.currentSettings.width * 0.5);
            document.getElementById('previewDimensions').textContent = 
                `(${this.currentSettings.width}x${height} chars)`;
        }
    }

    applyColorToPreview(text, colors) {
        const previewElement = document.getElementById('previewAsciiArt');
        
        // Apply background color
        previewElement.parentElement.style.background = this.currentSettings.backgroundColor;
        
        if (this.currentSettings.colorMode === 'monochrome') {
            previewElement.style.color = '#ffffff';
            previewElement.textContent = text;
        } else if (this.currentSettings.colorMode === 'green') {
            previewElement.style.color = '#0f0';
            previewElement.textContent = text;
        } else if (this.currentSettings.colorMode === 'custom') {
            previewElement.style.color = this.currentSettings.customColor;
            previewElement.textContent = text;
        } else if (this.currentSettings.colorMode === 'rgb' || this.currentSettings.colorMode === 'ansi') {
            // Apply full color using HTML spans
            previewElement.innerHTML = this.colorizeAscii(text, colors, this.currentSettings.colorMode);
        } else {
            previewElement.textContent = text;
        }
    }

    colorizeAscii(text, colors, mode) {
        const lines = text.split('\n');
        let html = '';
        
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                let color = colors[y] && colors[y][x] ? colors[y][x] : 'rgb(255,255,255)';
                
                if (mode === 'ansi') {
                    color = this.rgbToAnsi(color);
                }
                
                html += `<span style="color:${color}">${this.escapeHtml(char)}</span>`;
            }
            if (y < lines.length - 1) html += '\n';
        }
        
        return html;
    }

    rgbToAnsi(rgbString) {
        const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return rgbString;
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        // Convert to 16-color ANSI palette
        const colors = [
            'rgb(0,0,0)', 'rgb(128,0,0)', 'rgb(0,128,0)', 'rgb(128,128,0)',
            'rgb(0,0,128)', 'rgb(128,0,128)', 'rgb(0,128,128)', 'rgb(192,192,192)',
            'rgb(128,128,128)', 'rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(255,255,0)',
            'rgb(0,0,255)', 'rgb(255,0,255)', 'rgb(0,255,255)', 'rgb(255,255,255)'
        ];
        
        let minDist = Infinity;
        let closest = colors[0];
        
        colors.forEach(ansiColor => {
            const match2 = ansiColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            const ar = parseInt(match2[1]);
            const ag = parseInt(match2[2]);
            const ab = parseInt(match2[3]);
            
            const dist = Math.sqrt(Math.pow(r - ar, 2) + Math.pow(g - ag, 2) + Math.pow(b - ab, 2));
            if (dist < minDist) {
                minDist = dist;
                closest = ansiColor;
            }
        });
        
        return closest;
    }

    startPreviewAnimation() {
        // Stop existing animation
        if (this.previewAnimationInterval) {
            clearInterval(this.previewAnimationInterval);
        }

        if (!this.previewData.asciiFrames || this.previewData.asciiFrames.length === 0) return;

        const previewElement = document.getElementById('previewAsciiArt');
        let currentFrame = 0;
        previewElement.textContent = this.previewData.asciiFrames[0].ascii;

        this.previewAnimationInterval = setInterval(() => {
            currentFrame = (currentFrame + 1) % this.previewData.asciiFrames.length;
            previewElement.textContent = this.previewData.asciiFrames[currentFrame].ascii;
        }, this.previewData.asciiFrames[0].delay * 10);
    }

    getGalleryPreviewStyle(image) {
        let style = '';
        const mode = image.colorMode || 'monochrome';
        
        // Apply background color
        const bgColor = image.backgroundColor || '#000000';
        style += `background-color: ${bgColor};`;
        
        // Apply text color based on mode
        if (mode === 'monochrome') {
            style += 'color: #ffffff;';
        } else if (mode === 'green') {
            style += 'color: #00ff00;';
        } else if (mode === 'custom') {
            const customColor = image.customColor || '#00ff00';
            style += `color: ${customColor};`;
        } else if (mode === 'rgb' || mode === 'ansi') {
            // For RGB/ANSI modes, color will be applied per-character via HTML
            style += 'color: #ffffff;'; // default fallback
        }
        
        return style;
    }

    getGalleryAsciiHtml(image) {
        const mode = image.colorMode || 'monochrome';
        
        // For RGB and ANSI modes with color data, apply per-character colors
        if ((mode === 'rgb' || mode === 'ansi') && image.colorData && image.colorData.colors) {
            let html = '';
            const lines = image.asciiArt.split('\n');
            const colors = image.colorData.colors;
            
            for (let y = 0; y < lines.length; y++) {
                const line = lines[y];
                for (let x = 0; x < line.length; x++) {
                    const char = line[x];
                    let color = colors[y] && colors[y][x] ? colors[y][x] : 'rgb(255,255,255)';
                    
                    if (mode === 'ansi') {
                        color = this.rgbToAnsi(color);
                    }
                    
                    html += `<span style="color:${color}">${this.escapeHtml(char)}</span>`;
                }
                if (y < lines.length - 1) html += '\n';
            }
            
            return html;
        }
        
        // For all other modes (monochrome, green, custom), just return plain text
        // Color will be applied via the container's inline style
        return this.escapeHtml(image.asciiArt);
    }

    savePreviewToGallery() {
        if (!this.previewData) return;

        // Validate custom name if provided
        const customName = document.getElementById('customName').value.trim();
        if (customName && customName.length > 100) {
            this.showToast('Name must be 100 characters or less', 'error');
            return;
        }

        const displayName = customName || this.previewData.fileName;

        const imageData = {
            id: ++this.idCounter,
            name: displayName,
            originalImage: this.previewData.originalImage,
            width: this.currentSettings.width,
            contrast: this.currentSettings.contrast,
            brightness: this.currentSettings.brightness,
            saturation: this.currentSettings.saturation,
            sharpness: this.currentSettings.sharpness,
            bitDepth: this.currentSettings.bitDepth,
            invert: this.currentSettings.invert,
            asciiStyle: this.currentSettings.asciiStyle,
            colorMode: this.currentSettings.colorMode,
            customColor: this.currentSettings.customColor,
            backgroundColor: this.currentSettings.backgroundColor,
            edgeDetect: this.currentSettings.edgeDetect,
            dithering: this.currentSettings.dithering,
            removeBackground: this.currentSettings.removeBackground,
            targetBackgroundColor: this.currentSettings.targetBackgroundColor,
            backgroundTolerance: this.currentSettings.backgroundTolerance,
            timestamp: new Date().toISOString(),
            size: this.previewData.fileSize,
            isAnimated: this.previewData.isAnimated
        };

        if (this.previewData.isAnimated) {
            imageData.asciiArt = this.previewData.asciiFrames[0].ascii;
            imageData.asciiFrames = this.previewData.asciiFrames;
            imageData.frameCount = this.previewData.frameCount;
        } else {
            const previewElement = document.getElementById('previewAsciiArt');
            imageData.asciiArt = previewElement.textContent || previewElement.innerText;
            
            // Store color data if using a color mode - save the current coloredOutput
            if (this.currentSettings.colorMode !== 'monochrome' && this.previewData && this.previewData.coloredOutput) {
                imageData.colorData = {
                    colors: this.previewData.coloredOutput.colors || []
                };
            }
        }

        this.addImage(imageData);
        this.showToast('✓ Saved to gallery!', 'success');
        
        // Clear custom name for next upload
        document.getElementById('customName').value = '';
        
        this.cancelPreview();
    }

    exportAsHtml() {
        if (!this.previewData) return;

        const previewElement = document.getElementById('previewAsciiArt');
        const asciiContent = previewElement.innerHTML || previewElement.textContent;
        const customName = document.getElementById('customName').value.trim() || this.previewData.fileName;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Art - ${this.escapeHtml(customName)}</title>
    <style>
        body {
            background: ${this.currentSettings.backgroundColor};
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        pre {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            line-height: 8px;
            white-space: pre;
            margin: 0;
            color: ${this.currentSettings.colorMode === 'custom' ? this.currentSettings.customColor : '#0f0'};
        }
    </style>
</head>
<body>
    <pre>${asciiContent}</pre>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${customName.replace(/\.[^/.]+$/, '')}_ascii.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Exported as HTML!', 'success');
    }

    cancelPreview() {
        // Stop preview animation
        if (this.previewAnimationInterval) {
            clearInterval(this.previewAnimationInterval);
            this.previewAnimationInterval = null;
        }

        // Clear preview data
        this.previewData = null;

        // Hide preview section
        document.getElementById('previewSection').style.display = 'none';

        // Re-enable upload section
        const uploadSection = document.getElementById('uploadSection');
        const editorTab = document.getElementById('editorTab');
        if (uploadSection) {
            uploadSection.style.display = '';
        }
        if (editorTab) {
            editorTab.classList.remove('editing');
        }

        // Reset file input and custom name
        document.getElementById('imageInput').value = '';
        document.getElementById('customName').value = '';

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setActiveTab(tabId) {
        const panels = document.querySelectorAll('.tab-panel');
        const buttons = document.querySelectorAll('.tab-btn');

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === tabId);
        });

        buttons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });
    }

    zoomPreviewAscii(factor) {
        const ascii = document.getElementById('previewAsciiArt');
        const currentScale = parseFloat(ascii.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
        const newScale = Math.max(0.5, Math.min(3, currentScale * factor));
        ascii.style.transform = `scale(${newScale})`;
        ascii.style.transformOrigin = 'top left';
        document.getElementById('asciiZoomLevel').textContent = Math.round(newScale * 100) + '%';
    }

    zoomGalleryItem(id, factor) {
        const preview = document.querySelector(`.ascii-preview[data-image-id="${id}"]`);
        if (preview) {
            const currentScale = parseFloat(preview.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
            const newScale = Math.max(0.5, Math.min(3, currentScale * factor));
            preview.style.transform = `scale(${newScale})`;
            preview.style.transformOrigin = 'top left';
        }
    }

    setupPanningControls() {
        const asciiContainer = document.getElementById('previewAsciiContainer');
        if (asciiContainer) {
            this.setupContainerPanning(asciiContainer);
        }
    }

    setupContainerPanning(container) {
        let isMouseDown = false;
        let startX, startY, scrollLeft, scrollTop;

        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - container.offsetLeft;
            startY = e.pageY - container.offsetTop;
            scrollLeft = container.scrollLeft;
            scrollTop = container.scrollTop;
            container.classList.add('panning');
        });

        container.addEventListener('mouseleave', () => {
            isMouseDown = false;
            container.classList.remove('panning');
        });

        container.addEventListener('mouseup', () => {
            isMouseDown = false;
            container.classList.remove('panning');
        });

        container.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            
            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;
            const walkX = (x - startX) * 1;
            const walkY = (y - startY) * 1;
            
            container.scrollLeft = scrollLeft - walkX;
            container.scrollTop = scrollTop - walkY;
        });
    }

    convertToAscii(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate dimensions
        const targetWidth = this.currentSettings.width;
        const aspectRatio = image.height / image.width;
        const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5); // 0.5 for character aspect ratio

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw and get image data
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        let imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const pixels = imageData.data;

        // Apply background removal if enabled
        if (this.currentSettings.removeBackground) {
            imageData = this.removeBackground(imageData);
        }

        // Apply sharpness filter if needed
        if (this.currentSettings.sharpness > 0) {
            imageData = this.applySharpness(imageData, this.currentSettings.sharpness);
        }

        // Apply edge detection if enabled
        if (this.currentSettings.edgeDetect) {
            imageData = this.applyEdgeDetection(imageData);
        }

        let asciiArt = '';
        let colorData = []; // Store color information for colored modes
        
        for (let y = 0; y < targetHeight; y++) {
            let row = '';
            let rowColors = [];
            
            for (let x = 0; x < targetWidth; x++) {
                const offset = (y * targetWidth + x) * 4;
                let r = imageData.data[offset];
                let g = imageData.data[offset + 1];
                let b = imageData.data[offset + 2];

                // Apply brightness
                r = Math.min(255, r * this.currentSettings.brightness);
                g = Math.min(255, g * this.currentSettings.brightness);
                b = Math.min(255, b * this.currentSettings.brightness);

                // Apply saturation
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                r = gray + this.currentSettings.saturation * (r - gray);
                g = gray + this.currentSettings.saturation * (g - gray);
                b = gray + this.currentSettings.saturation * (b - gray);
                r = Math.max(0, Math.min(255, r));
                g = Math.max(0, Math.min(255, g));
                b = Math.max(0, Math.min(255, b));

                // Apply bit depth/posterization
                const levels = Math.pow(2, this.currentSettings.bitDepth);
                r = Math.floor(r / 256 * levels) * (256 / levels);
                g = Math.floor(g / 256 * levels) * (256 / levels);
                b = Math.floor(b / 256 * levels) * (256 / levels);

                // Apply dithering if enabled
                if (this.currentSettings.dithering && x < targetWidth - 1 && y < targetHeight - 1) {
                    const oldR = r, oldG = g, oldB = b;
                    const newR = Math.floor(r / 256 * levels) * (256 / levels);
                    const newG = Math.floor(g / 256 * levels) * (256 / levels);
                    const newB = Math.floor(b / 256 * levels) * (256 / levels);
                    const errR = oldR - newR;
                    const errG = oldG - newG;
                    const errB = oldB - newB;
                    
                    // Distribute error to neighboring pixels (Floyd-Steinberg)
                    this.distributeError(imageData.data, offset, targetWidth, errR, errG, errB);
                }

                // Store original RGB for colored modes
                const originalColor = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
                rowColors.push(originalColor);

                // Convert to grayscale for character selection
                let grayValue = 0.299 * r + 0.587 * g + 0.114 * b;

                // Apply contrast
                grayValue = ((grayValue / 255 - 0.5) * this.currentSettings.contrast + 0.5) * 255;
                grayValue = Math.max(0, Math.min(255, grayValue));

                // Invert if needed
                if (this.currentSettings.invert) {
                    grayValue = 255 - grayValue;
                }

                // Map to ASCII character
                const charIndex = Math.floor((grayValue / 255) * (this.asciiChars.length - 1));
                row += this.asciiChars[charIndex];
            }
            asciiArt += row + '\n';
            colorData.push(rowColors);
        }

        // Return both ASCII and color data
        return { text: asciiArt, colors: colorData };
    }

    applySharpness(imageData, amount) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const output = new ImageData(width, height);
        
        const kernel = [
            0, -amount, 0,
            -amount, 1 + 4 * amount, -amount,
            0, -amount, 0
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
                    const idx = (y * width + x) * 4 + c;
                    output.data[idx] = Math.max(0, Math.min(255, sum));
                }
                output.data[(y * width + x) * 4 + 3] = 255; // Alpha
            }
        }
        return output;
    }

    removeBackground(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Parse target background color
        const targetColor = this.hexToRgb(this.currentSettings.targetBackgroundColor);
        const replacementColor = this.hexToRgb(this.currentSettings.backgroundColor);
        const tolerance = this.currentSettings.backgroundTolerance;
        
        // Process each pixel
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate color distance
            const dist = Math.sqrt(
                Math.pow(r - targetColor.r, 2) +
                Math.pow(g - targetColor.g, 2) +
                Math.pow(b - targetColor.b, 2)
            );
            
            // If within tolerance, replace with background color
            if (dist <= (tolerance * 2.55)) { // tolerance is 0-100, convert to 0-255 scale
                data[i] = replacementColor.r;
                data[i + 1] = replacementColor.g;
                data[i + 2] = replacementColor.b;
                data[i + 3] = 255;
            }
        }
        
        return imageData;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    applyEdgeDetection(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const output = new ImageData(width, height);
        
        // Sobel operator
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;
                
                for (let c = 0; c < 3; c++) {
                    const tl = data[((y - 1) * width + (x - 1)) * 4 + c];
                    const tm = data[((y - 1) * width + x) * 4 + c];
                    const tr = data[((y - 1) * width + (x + 1)) * 4 + c];
                    const ml = data[(y * width + (x - 1)) * 4 + c];
                    const mr = data[(y * width + (x + 1)) * 4 + c];
                    const bl = data[((y + 1) * width + (x - 1)) * 4 + c];
                    const bm = data[((y + 1) * width + x) * 4 + c];
                    const br = data[((y + 1) * width + (x + 1)) * 4 + c];
                    
                    gx += (-tl + tr - 2 * ml + 2 * mr - bl + br) / 3;
                    gy += (-tl - 2 * tm - tr + bl + 2 * bm + br) / 3;
                }
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                const idx = (y * width + x) * 4;
                output.data[idx] = output.data[idx + 1] = output.data[idx + 2] = Math.min(255, magnitude);
                output.data[idx + 3] = 255;
            }
        }
        return output;
    }

    distributeError(data, offset, width, errR, errG, errB) {
        // Floyd-Steinberg dithering
        const positions = [
            { dx: 1, dy: 0, weight: 7 / 16 },
            { dx: -1, dy: 1, weight: 3 / 16 },
            { dx: 0, dy: 1, weight: 5 / 16 },
            { dx: 1, dy: 1, weight: 1 / 16 }
        ];
        
        positions.forEach(pos => {
            const newOffset = offset + (pos.dy * width + pos.dx) * 4;
            if (newOffset >= 0 && newOffset < data.length) {
                data[newOffset] += errR * pos.weight;
                data[newOffset + 1] += errG * pos.weight;
                data[newOffset + 2] += errB * pos.weight;
            }
        });
    }

    addImage(imageData) {
        this.images.unshift(imageData); // Add to beginning
        this.saveImages();
        this.renderGallery();
    }

    deleteImage(id) {
        this.showConfirmDialog('Delete ASCII Art', 'Are you sure you want to delete this ASCII art? This action cannot be undone.', () => {
            // Stop all gallery animations before modifying the gallery
            this.stopGalleryAnimations();
            
            this.images = this.images.filter(img => img.id !== id);
            this.saveImages();
            this.renderGallery();
            this.showToast('ASCII art deleted', 'success');
        });
    }

    clearAll() {
        if (this.images.length === 0) {
            this.showToast('Gallery is already empty', 'error');
            return;
        }
        
        this.showConfirmDialog(
            'Clear Gallery', 
            `Are you sure you want to delete all ${this.images.length} ASCII art pieces? This action cannot be undone.`, 
            () => {
                // Stop all animations before clearing
                this.stopGalleryAnimations();
                
                this.images = [];
                this.saveImages();
                this.renderGallery();
                this.showToast('All ASCII art cleared', 'success');
            }
        );
    }

    viewImage(id) {
        const image = this.images.find(img => img.id === id);
        if (image) {
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modalTitle');
            const modalAsciiArt = document.getElementById('modalAsciiArt');

            modalTitle.textContent = image.name + (image.isAnimated ? ` (${image.frameCount} frames)` : '');
            
            // Stop any existing animation
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }

            if (image.isAnimated && image.asciiFrames) {
                // Animate the ASCII art
                let currentFrame = 0;
                modalAsciiArt.textContent = image.asciiFrames[0].ascii;
                
                this.animationInterval = setInterval(() => {
                    currentFrame = (currentFrame + 1) % image.asciiFrames.length;
                    modalAsciiArt.textContent = image.asciiFrames[currentFrame].ascii;
                }, image.asciiFrames[currentFrame].delay * 10); // Convert centiseconds to milliseconds
            } else {
                // Apply colors if available
                if (image.colorMode && image.colorMode !== 'monochrome' && image.colorData && image.colorData.colors) {
                    modalAsciiArt.innerHTML = this.getGalleryAsciiHtml(image);
                    if (image.backgroundColor) {
                        modalAsciiArt.style.backgroundColor = image.backgroundColor;
                    }
                } else {
                    modalAsciiArt.textContent = image.asciiArt;
                    modalAsciiArt.innerHTML = '';
                    modalAsciiArt.style.backgroundColor = '';
                }
            }
            
            modal.classList.add('active');

            // Store current image for copy/download
            this.currentViewImage = image;
        }
    }

    editImage(id) {
        const image = this.images.find(img => img.id === id);
        if (image) {
            // Load it into preview mode
            if (image.isAnimated) {
                // Recreate frames from the original image
                fetch(image.originalImage)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], image.name, { type: 'image/gif' });
                        this.processGif(file);
                    });
            } else {
                // Load static image into preview
                const img = new Image();
                img.onload = () => {
                    this.previewData = {
                        fileName: image.name,
                        fileSize: image.size,
                        originalImage: image.originalImage,
                        imageElement: img,
                        isAnimated: false
                    };

                    // Set the previous settings - RESTORE ALL 14 SETTINGS
                    document.getElementById('widthSlider').value = image.width;
                    document.getElementById('widthValue').textContent = image.width;
                    document.getElementById('contrastSlider').value = image.contrast;
                    document.getElementById('contrastValue').textContent = image.contrast.toFixed(1);
                    document.getElementById('brightnessSlider').value = image.brightness;
                    document.getElementById('brightnessValue').textContent = image.brightness.toFixed(2);
                    document.getElementById('saturationSlider').value = image.saturation;
                    document.getElementById('saturationValue').textContent = image.saturation.toFixed(2);
                    document.getElementById('sharpnessSlider').value = image.sharpness;
                    document.getElementById('sharpnessValue').textContent = image.sharpness;
                    document.getElementById('bitDepthSlider').value = image.bitDepth;
                    document.getElementById('bitDepthValue').textContent = image.bitDepth;
                    document.getElementById('invertCheckbox').checked = image.invert;
                    document.getElementById('edgeDetectCheckbox').checked = image.edgeDetect || false;
                    document.getElementById('ditheringCheckbox').checked = image.dithering || false;
                    document.getElementById('asciiStyleSelect').value = image.asciiStyle || 'standard';
                    document.getElementById('colorModeSelect').value = image.colorMode || 'monochrome';
                    document.getElementById('customColorPicker').value = image.customColor || '#00ff00';
                    document.getElementById('backgroundColorPicker').value = image.backgroundColor || '#000000';

                    // Set all current settings
                    this.currentSettings.width = image.width;
                    this.currentSettings.contrast = image.contrast;
                    this.currentSettings.brightness = image.brightness;
                    this.currentSettings.saturation = image.saturation;
                    this.currentSettings.sharpness = image.sharpness;
                    this.currentSettings.bitDepth = image.bitDepth;
                    this.currentSettings.invert = image.invert;
                    this.currentSettings.asciiStyle = image.asciiStyle || 'standard';
                    this.currentSettings.colorMode = image.colorMode || 'monochrome';
                    this.currentSettings.customColor = image.customColor || '#00ff00';
                    this.currentSettings.backgroundColor = image.backgroundColor || '#000000';
                    this.currentSettings.edgeDetect = image.edgeDetect || false;
                    this.currentSettings.dithering = image.dithering || false;
                    this.currentSettings.removeBackground = image.removeBackground || false;
                    this.currentSettings.targetBackgroundColor = image.targetBackgroundColor || '#ffffff';
                    this.currentSettings.backgroundTolerance = image.backgroundTolerance || 30;

                    // Update UI for background removal
                    document.getElementById('removeBackgroundCheckbox').checked = this.currentSettings.removeBackground;

                    this.showPreview();
                };
                img.src = image.originalImage;
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    renderGallery() {
        const gallery = document.getElementById('gallery');
        const emptyState = document.getElementById('emptyState');

        if (this.images.length === 0) {
            gallery.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        gallery.innerHTML = this.images.map(image => `
            <div class="gallery-item">
                <div class="gallery-item-header">
                    <div class="gallery-item-title" title="${this.escapeHtml(image.name)}">
                        ${this.escapeHtml(image.name)}
                    </div>
                    <div class="gallery-item-actions">
                        <button class="btn btn-secondary btn-small" onclick="app.editImage(${image.id})" title="Edit settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-danger btn-small" onclick="app.deleteImage(${image.id})" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="gallery-item-preview" onclick="app.viewImage(${image.id})" style="cursor: pointer; position: relative;">
                    <div class="gallery-zoom-controls">
                        <button class="gallery-zoom-btn" onclick="event.stopPropagation(); app.zoomGalleryItem(${image.id}, 0.9)" title="Zoom out">−</button>
                        <button class="gallery-zoom-btn" onclick="event.stopPropagation(); app.zoomGalleryItem(${image.id}, 1.1)" title="Zoom in">+</button>
                    </div>
                    <div class="original-preview">
                        <img src="${image.originalImage}" alt="${this.escapeHtml(image.name)}">
                        ${image.isAnimated ? `
                            <div class="animation-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                GIF
                            </div>
                        ` : ''}
                    </div>
                    <div class="ascii-preview ${image.isAnimated ? 'animated-preview' : ''}" data-image-id="${image.id}" style="${this.getGalleryPreviewStyle(image)}">${this.getGalleryAsciiHtml(image)}</div>
                </div>
                <div class="gallery-item-info">
                    ${new Date(image.timestamp).toLocaleDateString()} • 
                    ${image.width}x${Math.floor(image.width * 0.5)} chars${image.isAnimated ? ` • ${image.frameCount} frames` : ''} • 
                    ${this.formatFileSize(image.size)}
                </div>
            </div>
        `).join('');

        // Start animations for animated previews
        this.startGalleryAnimations();
    }

    stopGalleryAnimations() {
        // Stop all existing animations
        if (this.galleryAnimations && this.galleryAnimations.length > 0) {
            this.galleryAnimations.forEach(interval => clearInterval(interval));
            this.galleryAnimations = [];
        }
    }

    startGalleryAnimations() {
        // Stop existing animations first
        this.stopGalleryAnimations();

        // Start new animations for each animated preview
        const animatedPreviews = document.querySelectorAll('.ascii-preview.animated-preview');
        animatedPreviews.forEach(preview => {
            const imageId = parseInt(preview.dataset.imageId);
            const image = this.images.find(img => img.id === imageId);
            
            if (image && image.isAnimated && image.asciiFrames && image.asciiFrames.length > 0) {
                let currentFrame = 0;
                const interval = setInterval(() => {
                    // Check if the preview element still exists in the DOM
                    if (!document.body.contains(preview)) {
                        clearInterval(interval);
                        return;
                    }
                    currentFrame = (currentFrame + 1) % image.asciiFrames.length;
                    preview.textContent = image.asciiFrames[currentFrame].ascii;
                }, image.asciiFrames[0].delay * 10); // Use first frame's delay
                
                this.galleryAnimations.push(interval);
            }
        });
    }

    saveImages() {
        try {
            localStorage.setItem('asciiArtImages', JSON.stringify(this.images));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            this.showToast('Failed to save data. Storage might be full.', 'error');
        }
    }

    loadImages() {
        try {
            const saved = localStorage.getItem('asciiArtImages');
            if (saved) {
                this.images = JSON.parse(saved);
                // Update idCounter to be higher than any existing ID
                if (this.images.length > 0) {
                    const maxId = Math.max(...this.images.map(img => img.id));
                    this.idCounter = Math.max(this.idCounter, maxId);
                }
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            this.images = [];
        }
    }

    copyToClipboard() {
        if (this.currentViewImage) {
            let textToCopy = this.currentViewImage.asciiArt;
            
            if (this.currentViewImage.isAnimated && this.currentViewImage.asciiFrames) {
                // Copy all frames
                let allFrames = '';
                this.currentViewImage.asciiFrames.forEach((frame, index) => {
                    allFrames += `=== Frame ${index + 1} ===\n`;
                    allFrames += frame.ascii;
                    allFrames += '\n\n';
                });
                textToCopy = allFrames;
            }
            
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.showToast('Copied to clipboard!', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    this.showToast('Failed to copy to clipboard', 'error');
                });
        }
    }

    showDownloadMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.currentViewImage) return;
        
        // Remove any existing menu
        const existingMenu = document.querySelector('.download-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }
        
        const menu = document.createElement('div');
        menu.className = 'download-menu';
        menu.innerHTML = `
            <button class="download-option" data-format="txt">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Download as TXT
            </button>
            <button class="download-option" data-format="png">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Download as PNG
            </button>
            <button class="download-option" data-format="jpg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Download as JPG
            </button>
        `;
        
        // Get button position
        const button = e.currentTarget;
        const buttonRect = button.getBoundingClientRect();
        const modalContent = button.closest('.modal-content');
        const modalRect = modalContent ? modalContent.getBoundingClientRect() : null;
        
        // Position menu
        menu.style.position = 'fixed';
        menu.style.top = (buttonRect.bottom + 8) + 'px';
        menu.style.left = (buttonRect.left) + 'px';
        
        document.body.appendChild(menu);
        
        // Add click handlers
        menu.querySelectorAll('.download-option').forEach(option => {
            option.addEventListener('click', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                const format = option.dataset.format;
                if (format === 'txt') this.downloadAsciiArt();
                else if (format === 'png') this.downloadAsPng();
                else if (format === 'jpg') this.downloadAsJpg();
                menu.remove();
            });
        });
        
        // Close menu when clicking outside
        setTimeout(() => {
            const closeMenuHandler = (evt) => {
                if (!menu.contains(evt.target) && evt.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenuHandler);
                }
            };
            document.addEventListener('click', closeMenuHandler);
        }, 100);
    }

    downloadAsciiArt() {
        if (!this.currentViewImage) return;

        const name = this.currentViewImage.name.replace(/\.[^/.]+$/, '');
        if (this.currentViewImage.isAnimated && this.currentViewImage.asciiFrames) {
            this.downloadAsText(name + '_ascii_animation.txt', this.formatAnimatedFrames());
        } else {
            this.downloadAsText(name + '_ascii.txt', this.currentViewImage.asciiArt);
        }
    }

    downloadAsPng() {
        if (!this.currentViewImage) return;
        this.downloadAsImage('png');
    }

    downloadAsJpg() {
        if (!this.currentViewImage) return;
        this.downloadAsImage('jpeg');
    }

    downloadAsImage(format = 'png') {
        if (!this.currentViewImage) return;

        const name = this.currentViewImage.name.replace(/\.[^/.]+$/, '');
        const ascii = this.currentViewImage.asciiArt;
        const lines = ascii.split('\n');
        
        const charWidth = 7;
        const charHeight = 14;
        const padding = 20;
        const fontSize = 12;
        
        const maxLineLength = Math.max(...lines.map(l => l.length));
        const canvas = document.createElement('canvas');
        canvas.width = maxLineLength * charWidth + padding * 2;
        canvas.height = lines.length * charHeight + padding * 2;
        
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = this.currentViewImage.backgroundColor || '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set font
        ctx.font = `${fontSize}px "Courier New", monospace`;
        ctx.textBaseline = 'top';
        
        const mode = this.currentViewImage.colorMode || 'monochrome';
        
        // Render with colors if available
        if ((mode === 'rgb' || mode === 'ansi') && this.currentViewImage.colorData && this.currentViewImage.colorData.colors) {
            // Render with per-character colors
            const colors = this.currentViewImage.colorData.colors;
            for (let y = 0; y < lines.length; y++) {
                const line = lines[y];
                for (let x = 0; x < line.length; x++) {
                    const char = line[x];
                    let color = colors[y] && colors[y][x] ? colors[y][x] : 'rgb(255,255,255)';
                    
                    if (mode === 'ansi') {
                        color = this.rgbToAnsi(color);
                    }
                    
                    ctx.fillStyle = color;
                    ctx.fillText(char, padding + x * charWidth, padding + y * charHeight);
                }
            }
        } else {
            // Render with single color
            if (mode === 'green') {
                ctx.fillStyle = '#00ff00';
            } else if (mode === 'custom') {
                ctx.fillStyle = this.currentViewImage.customColor || '#00ff00';
            } else {
                ctx.fillStyle = '#ffffff';
            }
            
            lines.forEach((line, i) => {
                ctx.fillText(line, padding, padding + i * charHeight);
            });
        }
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}_ascii.${format === 'jpeg' ? 'jpg' : 'png'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast(`Exported as ${format.toUpperCase()}!`, 'success');
        }, `image/${format}`, format === 'jpeg' ? 0.95 : undefined);
    }

    downloadAsText(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast(`Downloaded as .txt!`, 'success');
    }

    formatAnimatedFrames() {
        let allFrames = '';
        this.currentViewImage.asciiFrames.forEach((frame, index) => {
            allFrames += `=== Frame ${index + 1} (delay: ${frame.delay * 10}ms) ===\n`;
            allFrames += frame.ascii;
            allFrames += '\n\n';
        });
        return allFrames;
    }

    showConfirmDialog(title, message, onConfirm, onCancel = null) {
        const backdrop = document.createElement('div');
        backdrop.className = 'confirm-backdrop';
        
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <h3>${this.escapeHtml(title)}</h3>
            <p>${this.escapeHtml(message)}</p>
            <div class="confirm-actions">
                <button class="btn btn-secondary confirm-cancel">Cancel</button>
                <button class="btn btn-danger confirm-ok">Confirm</button>
            </div>
        `;
        
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);
        
        const cancelBtn = dialog.querySelector('.confirm-cancel');
        const okBtn = dialog.querySelector('.confirm-ok');
        
        const cleanup = () => {
            backdrop.remove();
        };
        
        cancelBtn.addEventListener('click', () => {
            cleanup();
            if (onCancel) onCancel();
        });
        
        okBtn.addEventListener('click', () => {
            cleanup();
            if (onConfirm) onConfirm();
        });
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                cleanup();
                if (onCancel) onCancel();
            }
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' 
                    ? '<polyline points="20 6 9 17 4 12"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                }
            </svg>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

// Initialize the application
const app = new AsciiArtConverter();
