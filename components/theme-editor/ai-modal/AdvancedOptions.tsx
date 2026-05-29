'use client';

import { useState, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Upload } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

type ThemeMode = 'auto' | 'light' | 'dark';

interface BrandColour {
  id: string;
  hex: string;
}

interface ImageFile {
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  name: string;
  sizeKb: number;
}

export interface AdvancedOptionsValue {
  themeMode: ThemeMode;
  brandColours: BrandColour[];
  darkVersionMode: boolean;
  image: ImageFile | null;
}

interface AdvancedOptionsProps {
  onChange: (value: AdvancedOptionsValue) => void;
}

const MAX_COLOURS = 3;
const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES: Record<string, ImageFile['mediaType']> = {
  'image/jpeg': 'image/jpeg',
  'image/jpg': 'image/jpeg',
  'image/png': 'image/png',
  'image/gif': 'image/gif',
  'image/webp': 'image/webp',
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export function AdvancedOptions({ onChange }: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [brandColours, setBrandColours] = useState<BrandColour[]>([]);
  const [darkVersionMode, setDarkVersionMode] = useState(false);
  const [image, setImage] = useState<ImageFile | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notify = useCallback(
    (tm: ThemeMode, bc: BrandColour[], dvm: boolean, img: ImageFile | null) => {
      onChange({ themeMode: tm, brandColours: bc, darkVersionMode: dvm, image: img });
    },
    [onChange]
  );

  function handleThemeMode(mode: ThemeMode) {
    setThemeMode(mode);
    const newDvm = mode !== 'dark' ? false : darkVersionMode;
    setDarkVersionMode(newDvm);
    notify(mode, brandColours, newDvm, image);
  }

  function addColour() {
    if (brandColours.length >= MAX_COLOURS) return;
    const newColour: BrandColour = { id: generateId(), hex: '#2563EB' };
    const next = [...brandColours, newColour];
    setBrandColours(next);
    setOpenPickerId(newColour.id);
    setImage(null);
    setImageError(null);
    notify(themeMode, next, darkVersionMode, null);
  }

  function updateColour(id: string, hex: string) {
    const next = brandColours.map((c) => (c.id === id ? { ...c, hex } : c));
    setBrandColours(next);
    notify(themeMode, next, darkVersionMode, image);
  }

  function removeColour(id: string) {
    const next = brandColours.filter((c) => c.id !== id);
    setBrandColours(next);
    const newDvm = next.length === 0 ? false : darkVersionMode;
    setDarkVersionMode(newDvm);
    if (openPickerId === id) setOpenPickerId(null);
    notify(themeMode, next, newDvm, image);
  }

  function togglePicker(id: string) {
    setOpenPickerId((prev) => (prev === id ? null : id));
  }

  function handleDarkVersionMode(checked: boolean) {
    setDarkVersionMode(checked);
    if (checked && themeMode !== 'dark') {
      setThemeMode('dark');
      notify('dark', brandColours, checked, image);
    } else {
      notify(themeMode, brandColours, checked, image);
    }
  }

  async function handleImageFile(file: File) {
    setImageError(null);

    const mediaType = ACCEPTED_IMAGE_TYPES[file.type];
    if (!mediaType) {
      setImageError('Unsupported file type. Use JPEG, PNG, GIF, or WebP.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(`Image is too large. Maximum size is ${MAX_IMAGE_MB}MB.`);
      return;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    const imageFile: ImageFile = {
      base64,
      mediaType,
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
    };

    setImage(imageFile);
    notify(themeMode, brandColours, darkVersionMode, imageFile);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleImageFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleImageFile(file);
  }

  function removeImage() {
    setImage(null);
    setImageError(null);
    notify(themeMode, brandColours, darkVersionMode, null);
  }

  const showImageSection = brandColours.length === 0;
  const showDarkVersionBox = brandColours.length > 0;
  const canAddColour = brandColours.length < MAX_COLOURS;

  return (
    <div style={{ borderTop: '1px solid #F1F5F9' }}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
          }}
        >
          Advanced options
        </span>
        {isOpen ? (
          <ChevronUp size={16} color="#9CA3AF" />
        ) : (
          <ChevronDown size={16} color="#9CA3AF" />
        )}
      </button>

      {isOpen && (
        <div
          style={{
            padding: '0 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#9CA3AF',
                margin: '0 0 8px 0',
              }}
            >
              Theme mode
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['auto', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleThemeMode(mode)}
                  style={{
                    flex: 1,
                    height: 34,
                    border:
                      themeMode === mode ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                    borderRadius: 8,
                    background: themeMode === mode ? '#EFF6FF' : '#FFFFFF',
                    color: themeMode === mode ? '#2563EB' : '#374151',
                    fontSize: 13,
                    fontWeight: themeMode === mode ? 500 : 400,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                  }}
                >
                  {mode === 'auto' && '✦ Auto'}
                  {mode === 'light' && '☀ Light'}
                  {mode === 'dark' && '☾ Dark'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#9CA3AF',
                  margin: 0,
                }}
              >
                Brand colours
                <span
                  style={{
                    fontSize: 10,
                    color: '#C4C9D4',
                    marginLeft: 4,
                    fontWeight: 400,
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  optional — up to {MAX_COLOURS}
                </span>
              </p>
              {canAddColour && (
                <button
                  type="button"
                  onClick={addColour}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    border: '1px solid #E2E8F0',
                    borderRadius: 6,
                    background: '#FFFFFF',
                    color: '#374151',
                    fontSize: 12,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <Plus size={12} />
                  Add colour
                </button>
              )}
            </div>

            {brandColours.length === 0 && (
              <p
                style={{
                  fontSize: 12,
                  color: '#9CA3AF',
                  margin: 0,
                }}
              >
                Add your brand colours to lock them in. Claude will build everything else
                around them.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {brandColours.map((colour, index) => (
                <div key={colour.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => togglePicker(colour.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: colour.hex,
                        border:
                          openPickerId === colour.id
                            ? '2px solid #2563EB'
                            : '2px solid #E2E8F0',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'border-color 0.15s',
                      }}
                    />

                    <span
                      style={{
                        fontSize: 11,
                        color: '#9CA3AF',
                        flexShrink: 0,
                        width: 80,
                      }}
                    >
                      {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Accent'}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #E2E8F0',
                        borderRadius: 6,
                        padding: '0 8px',
                        height: 32,
                        flex: 1,
                        background: '#FAFAFA',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: '#9CA3AF',
                          marginRight: 2,
                        }}
                      >
                        #
                      </span>
                      <input
                        type="text"
                        value={colour.hex.replace('#', '')}
                        onChange={(e) => {
                          const val = '#' + e.target.value.replace('#', '');
                          if (isValidHex(val)) updateColour(colour.id, val);
                        }}
                        maxLength={6}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: 13,
                          color: '#374151',
                          fontFamily: 'monospace',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeColour(colour.id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {openPickerId === colour.id && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        background: '#F9FAFB',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                      }}
                    >
                      <HexColorPicker
                        color={colour.hex}
                        onChange={(hex) => updateColour(colour.id, hex)}
                        style={{ width: '100%', height: 160 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showDarkVersionBox && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleDarkVersionMode(!darkVersionMode)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDarkVersionMode(!darkVersionMode);
                  }
                }}
                style={{
                  marginTop: 12,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 12px',
                  background: darkVersionMode ? '#EFF6FF' : '#F9FAFB',
                  border: `1px solid ${darkVersionMode ? '#BFDBFE' : '#E2E8F0'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `1.5px solid ${darkVersionMode ? '#2563EB' : '#D1D5DB'}`,
                    background: darkVersionMode ? '#2563EB' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {darkVersionMode && (
                    <span style={{ color: '#FFFFFF', fontSize: 11 }}>✓</span>
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#374151',
                      margin: '0 0 2px 0',
                    }}
                  >
                    Create dark version
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#6B7280',
                      margin: 0,
                    }}
                  >
                    Uses your brand colours as the foundation and adapts them for a dark
                    background
                  </p>
                </div>
              </div>
            )}
          </div>

          {showImageSection && (
            <div>
              <p
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#9CA3AF',
                  margin: '0 0 8px 0',
                }}
              >
                Reference image
                <span
                  style={{
                    fontSize: 10,
                    color: '#C4C9D4',
                    marginLeft: 4,
                    fontWeight: 400,
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  optional — logo, brand guide, mood board
                </span>
              </p>

              {!image ? (
                <div
                  role="button"
                  tabIndex={0}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  style={{
                    border: '1.5px dashed #D1D5DB',
                    borderRadius: 10,
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    background: '#FAFAFA',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#93C5FD';
                    (e.currentTarget as HTMLDivElement).style.background = '#F0F9FF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#D1D5DB';
                    (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA';
                  }}
                >
                  <Upload size={20} color="#9CA3AF" />
                  <p
                    style={{
                      fontSize: 13,
                      color: '#6B7280',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Drop an image or click to upload
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      margin: 0,
                    }}
                  >
                    JPEG, PNG, GIF, WebP — max {MAX_IMAGE_MB}MB
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: '#D1FAE5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Upload size={16} color="#16A34A" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#374151',
                        margin: '0 0 2px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {image.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: '#6B7280',
                        margin: 0,
                      }}
                    >
                      {image.sizeKb}KB — Claude will extract brand colours
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#9CA3AF',
                      padding: 4,
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {imageError && (
                <p
                  style={{
                    fontSize: 12,
                    color: '#DC2626',
                    margin: '6px 0 0 0',
                  }}
                >
                  {imageError}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
