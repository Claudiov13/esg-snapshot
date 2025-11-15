import { ReactNode } from 'react';

export function UploadCard({ children }: { children: ReactNode }) {
  return (
    <div className="card">
      <div className="upload-zone">
        {children}
      </div>
    </div>
  );
}
