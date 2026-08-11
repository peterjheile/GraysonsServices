import { useRef, useState } from "react";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = /\.(?:jpe?g|png|heic|heif)$/i;

interface PhotoUploadProps {
  photos: File[];
  disabled?: boolean;
  onChange: (photos: File[]) => void;
}

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function isAcceptedImage(file: File): boolean {
  return (
    file.size <= MAX_FILE_SIZE &&
    (file.type.startsWith("image/") || ACCEPTED_EXTENSIONS.test(file.name))
  );
}

export default function PhotoUpload({
  photos,
  disabled = false,
  onChange,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const addPhotos = (fileList: FileList | null) => {
    if (!fileList || disabled) {
      return;
    }

    const incoming = Array.from(fileList);
    const validImages = incoming.filter(isAcceptedImage);
    const existingKeys = new Set(photos.map(fileKey));
    const uniqueImages = validImages.filter(
      (file) => !existingKeys.has(fileKey(file)),
    );
    const availableSlots = Math.max(0, MAX_PHOTOS - photos.length);
    const acceptedImages = uniqueImages.slice(0, availableSlots);

    if (validImages.length !== incoming.length) {
      setError("Use JPG, PNG, or HEIC images no larger than 10 MB each.");
    } else if (uniqueImages.length !== validImages.length) {
      setError("A duplicate photo was not added.");
    } else if (uniqueImages.length > availableSlots) {
      setError(`You can attach up to ${MAX_PHOTOS} photos.`);
    } else {
      setError("");
    }

    if (acceptedImages.length > 0) {
      onChange([...photos, ...acceptedImages]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        className={`cursor-pointer rounded-sm border-2 border-dashed p-8 text-center transition-colors duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#b8975a] ${
          isDragging
            ? "border-[#b8975a] bg-[#b8975a]/5"
            : "border-[#e8e2da] hover:border-[#b8975a]/40"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepthRef.current += 1;
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

          if (dragDepthRef.current === 0) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepthRef.current = 0;
          setIsDragging(false);
          addPhotos(event.dataTransfer.files);
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="mx-auto mb-3 text-[#c5bdb5]"
          aria-hidden="true"
        >
          <path
            d="M16 4v16M8 12l8-8 8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 24h24v4H4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        <p className="text-sm font-light text-[#a39890]">
          {isDragging ? "Drop photos here" : "Drag & drop photos here, or "}
          {!isDragging && (
            <span className="text-[#b8975a] underline underline-offset-2">
              browse files
            </span>
          )}
        </p>
        <p id="photos-help" className="mt-1 text-[10px] text-[#c5bdb5]">
          JPG, PNG, HEIC up to 10MB each
        </p>

        <input
          ref={inputRef}
          id="photos"
          name="photos"
          type="file"
          accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic,image/heif"
          multiple
          disabled={disabled || photos.length >= MAX_PHOTOS}
          className="sr-only"
          aria-describedby={error ? "photos-help photos-error" : "photos-help"}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => addPhotos(event.currentTarget.files)}
        />
      </div>

      {error && (
        <p id="photos-error" role="alert" className="mt-2 text-[10px] text-red-500">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Selected project photos">
          {photos.map((photo, index) => (
            <li
              key={fileKey(photo)}
              className="flex min-w-0 items-center justify-between border border-[#e8e2da] bg-[#f5f1eb] px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-xs text-[#5c5550]">
                {photo.name}
              </span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${photo.name}`}
                className="ml-4 flex size-8 shrink-0 items-center justify-center text-[#a39890] transition-colors hover:text-[#1a1714] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#b8975a] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() =>
                  onChange(
                    photos.filter((_, photoIndex) => photoIndex !== index),
                  )
                }
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}