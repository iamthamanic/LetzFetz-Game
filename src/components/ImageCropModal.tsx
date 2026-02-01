import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Save, ZoomIn, ZoomOut, Crop, Maximize2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  cardName?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AspectRatio = '4:3' | '16:9' | '1:1';
type Mode = 'crop' | 'fit';

const ASPECT_RATIOS = {
  '4:3': { ratio: 4 / 3, ideal: '1024×768px', width: 256, height: 192 },
  '16:9': { ratio: 16 / 9, ideal: '1920×1080px', width: 256, height: 144 },
  '1:1': { ratio: 1, ideal: '1000×1000px', width: 192, height: 192 },
};

export function ImageCropModal({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  cardName = 'Card'
}: ImageCropModalProps) {
  // Aspect Ratio & Mode
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:3');
  const [mode, setMode] = useState<Mode>('crop');

  // Crop Mode State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  // Fit Mode State
  const [imageSize, setImageSize] = useState(75); // 50-100%
  const [blurIntensity, setBlurIntensity] = useState(30); // 0-50px

  // Preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
      if (mode === 'crop') {
        generateCropPreview(croppedAreaPixels);
      }
    },
    [mode]
  );

  // Generate Crop Mode Preview
  const generateCropPreview = async (cropArea: CropArea) => {
    if (!cropArea) return;

    try {
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const config = ASPECT_RATIOS[aspectRatio];
      canvas.width = config.width;
      canvas.height = config.height;

      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const preview = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewUrl(preview);
    } catch (error) {
      console.error('Error generating crop preview:', error);
    }
  };

  // Generate Fit Mode Preview
  const generateFitPreview = useCallback(async () => {
    try {
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const config = ASPECT_RATIOS[aspectRatio];
      canvas.width = config.width;
      canvas.height = config.height;

      // Layer 1: Blur Background (stretched to fill)
      ctx.filter = `blur(${blurIntensity}px)`;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Layer 2: Sharp Image (centered, scaled)
      ctx.filter = 'none';
      
      const scale = imageSize / 100;
      const imgAspect = image.width / image.height;
      const canvasAspect = canvas.width / canvas.height;
      
      let drawWidth, drawHeight;
      
      // Fit image proportionally
      if (imgAspect > canvasAspect) {
        drawWidth = canvas.width * scale;
        drawHeight = (canvas.width / imgAspect) * scale;
      } else {
        drawHeight = canvas.height * scale;
        drawWidth = (canvas.height * imgAspect) * scale;
      }
      
      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;
      
      ctx.drawImage(image, x, y, drawWidth, drawHeight);

      const preview = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewUrl(preview);
    } catch (error) {
      console.error('Error generating fit preview:', error);
    }
  }, [imageUrl, aspectRatio, imageSize, blurIntensity]);

  // Update preview when fit mode params change
  React.useEffect(() => {
    if (mode === 'fit') {
      generateFitPreview();
    }
  }, [mode, imageSize, blurIntensity, aspectRatio, generateFitPreview]);

  const handleSave = async () => {
    try {
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const config = ASPECT_RATIOS[aspectRatio];

      if (mode === 'crop') {
        // Crop Mode: Use cropped area
        if (!croppedAreaPixels) return;
        
        // If zoom < 1, use blur background technique
        if (zoom < 1) {
          // Higher resolution for quality
          canvas.width = config.width * 4;
          canvas.height = config.height * 4;

          // Layer 1: Blur Background (stretched to fill)
          ctx.filter = `blur(${blurIntensity}px)`;
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          // Layer 2: Cropped Image (centered)
          ctx.filter = 'none';
          
          // Scale cropped image to fit canvas proportionally
          const cropAspect = croppedAreaPixels.width / croppedAreaPixels.height;
          const canvasAspect = canvas.width / canvas.height;
          
          let drawWidth, drawHeight;
          if (cropAspect > canvasAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / cropAspect;
          } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * cropAspect;
          }
          
          const x = (canvas.width - drawWidth) / 2;
          const y = (canvas.height - drawHeight) / 2;
          
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            x,
            y,
            drawWidth,
            drawHeight
          );
        } else {
          // Normal crop (zoom >= 1)
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;

          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
        }
      } else {
        // Fit Mode: Blur background + centered image
        canvas.width = config.width * 4; // Higher resolution
        canvas.height = config.height * 4;

        // Layer 1: Blur Background
        ctx.filter = `blur(${blurIntensity}px)`;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Layer 2: Sharp Image
        ctx.filter = 'none';
        
        const scale = imageSize / 100;
        const imgAspect = image.width / image.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight;
        
        if (imgAspect > canvasAspect) {
          drawWidth = canvas.width * scale;
          drawHeight = (canvas.width / imgAspect) * scale;
        } else {
          drawHeight = canvas.height * scale;
          drawWidth = (canvas.height * imgAspect) * scale;
        }
        
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        
        ctx.drawImage(image, x, y, drawWidth, drawHeight);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleClose = () => {
    if (confirm('Bild-Bearbeitung abbrechen? Das Bild wird nicht hochgeladen.')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentConfig = ASPECT_RATIOS[aspectRatio];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl text-white">🖼️ Bild bearbeiten</h2>
            <p className="text-gray-400 text-sm mt-1">
              Wähle Format und Modus für die perfekte Kartendarstellung
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Editor */}
            <div className="space-y-4">
              {/* Aspect Ratio Selector */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-3">📐 Seitenverhältnis</h3>
                <div className="flex gap-2">
                  {(['4:3', '16:9', '1:1'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                        aspectRatio === ratio
                          ? 'bg-purple-600 text-white border-2 border-purple-400'
                          : 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-semibold">{ratio}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {ASPECT_RATIOS[ratio].ideal}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Ideal-Auflösung: <strong>{currentConfig.ideal}</strong>
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-3">🎨 Bearbeitungs-Modus</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode('crop')}
                    className={`py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      mode === 'crop'
                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                        : 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                    }`}
                  >
                    <Crop className="w-4 h-4" />
                    <span>Crop</span>
                  </button>
                  <button
                    onClick={() => setMode('fit')}
                    className={`py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      mode === 'fit'
                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                        : 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Fit</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {mode === 'crop' 
                    ? '✂️ Crop: Bildausschnitt wählen (maximale Kontrolle)'
                    : '📱 Fit: Ganzes Bild mit Blur-Hintergrund (Instagram-Style)'}
                </p>
              </div>

              {/* Editor Area */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-4">
                  {mode === 'crop' ? '✂️ Ausschnitt wählen' : '📐 Bild anpassen'}
                </h3>
                
                {/* Cropper/Image Display */}
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  {mode === 'crop' ? (
                    <>
                      {/* Blur Background Layer (visible when zoom < 1) */}
                      {zoom < 1 && (
                        <div 
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: `blur(${blurIntensity}px)`,
                            zIndex: 0
                          }}
                        />
                      )}
                      {/* Cropper Layer */}
                      <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={currentConfig.ratio}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropAreaComplete}
                        minZoom={0.5}
                        maxZoom={3}
                        style={{
                          containerStyle: {
                            background: '#000',
                          },
                          cropAreaStyle: {
                            border: '2px solid #a855f7',
                            boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.5)',
                          },
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <ImageWithFallback
                        src={imageUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Mode-Specific Controls */}
                {mode === 'crop' ? (
                  <div className="mt-4 space-y-2">
                    <label className="text-white text-sm flex items-center gap-2">
                      <ZoomOut className="w-4 h-4" />
                      Zoom {zoom < 1 && <span className="text-purple-400 text-xs">(Blur-BG aktiv)</span>}
                      <ZoomIn className="w-4 h-4" />
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <p className="text-xs text-gray-400">
                      Verschiebe das Bild mit der Maus · Zoom &lt; 100% zeigt Blur-Hintergrund
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {/* Image Size Slider */}
                    <div className="space-y-2">
                      <label className="text-white text-sm flex items-center justify-between">
                        <span>📏 Bild-Größe</span>
                        <span className="text-purple-400">{imageSize}%</span>
                      </label>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        step={1}
                        value={imageSize}
                        onChange={(e) => setImageSize(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    {/* Blur Intensity Slider */}
                    <div className="space-y-2">
                      <label className="text-white text-sm flex items-center justify-between">
                        <span>🌫️ Blur-Stärke</span>
                        <span className="text-purple-400">{blurIntensity}px</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        step={1}
                        value={blurIntensity}
                        onChange={(e) => setBlurIntensity(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    <p className="text-xs text-gray-400">
                      Hintergrund wird automatisch mit geblurrtem Bild gefüllt
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-4">👁️ Live Preview</h3>
                
                {/* Card Preview */}
                <div className="bg-black rounded-lg p-8 flex items-center justify-center">
                  <div 
                    className="w-64 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-500 bg-gradient-to-br from-gray-600 to-gray-500 relative"
                    style={{ height: `${(currentConfig.height / currentConfig.width) * 256 + 144}px` }}
                  >
                    {/* Card Header */}
                    <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 border-b-2 border-white/20 z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎴</span>
                          <h3 className="text-white text-sm truncate">{cardName}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Card Image */}
                    <div 
                      className="absolute top-16 left-0 right-0 overflow-hidden"
                      style={{ height: `${currentConfig.height}px` }}
                    >
                      {previewUrl ? (
                        <ImageWithFallback
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/30">
                          <span className="text-4xl opacity-50">🖼️</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-3 border-t-2 border-white/20">
                      <p className="text-white/60 text-xs italic text-center">
                        {mode === 'crop' ? 'Crop Mode' : 'Fit Mode'} · {aspectRatio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-4 bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                  <p className="text-purple-200 text-sm">
                    💡 <strong>Tipp:</strong> {mode === 'crop' 
                      ? 'Wähle den wichtigsten Bildbereich. Zoom & Pan für optimale Komposition.'
                      : 'Das gesamte Bild bleibt sichtbar. Der Blur-Hintergrund füllt automatisch die Lücken.'}
                  </p>
                </div>

                {/* Mode Comparison */}
                <div className="mt-4 bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <h4 className="text-white text-sm mb-2">📊 Modus-Vergleich:</h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <Crop className="w-3 h-3 text-purple-400" />
                      <span><strong>Crop:</strong> Maximale Kontrolle, Detail-Fokus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-3 h-3 text-blue-400" />
                      <span><strong>Fit:</strong> Ganzes Bild, Instagram-Style</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/50">
          <div className="text-sm text-gray-400">
            <strong>{aspectRatio}</strong> · {mode === 'crop' ? 'Crop-Modus' : 'Fit-Modus'} · Ideal: {currentConfig.ideal}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Übernehmen & Hochladen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}