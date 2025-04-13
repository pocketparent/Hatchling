// src/types.ts

// Common interfaces for the application
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  images: (string | File)[];
}

// Component prop interfaces
export interface JournalViewProps {
  onOpenEntryModal: (entry?: JournalEntry | null) => void;
}

export interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
}

export interface EntryImageHandlerProps {
  open: boolean;
  onClose: () => void;
  onUpload: (images: File[]) => void;
}

export interface AccountCreationProps {
  // Add any props if needed
}
// Add to src/types.ts

export interface ImageEditorProps {
  imageUrl: string;
  onSave: (result: ImageEditResult | null) => void;
}

export interface ImageEditResult {
  filter: string;
  quality: number;
  imageUrl: string;
}

export interface SettingsProps {
  // Add any props if needed
}
