import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2, ExternalLink } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props {
  url: string;
  title?: string;
}

const PdfViewer = ({ url, title }: Props) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setContainerWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const goPrev = () => setPageNumber(p => Math.max(1, p - 1));
  const goNext = () => setPageNumber(p => Math.min(numPages, p + 1));
  const zoomIn = () => setScale(s => Math.min(3, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2)));
  const fitWidth = () => setScale(1);

  if (loadError) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground space-y-3">
        <p>Tidak dapat menampilkan PDF di viewer.</p>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline">
          Buka PDF di tab baru <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-card">
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={goPrev} disabled={pageNumber <= 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums px-1">
            {pageNumber} / {numPages || '—'}
          </span>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={goNext} disabled={pageNumber >= numPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums px-1 w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} disabled={scale >= 3}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={fitWidth} title="Fit width">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="overflow-auto max-h-[70vh] flex items-start justify-center p-3">
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) => { setNumPages(n); setLoadError(false); }}
          onLoadError={() => setLoadError(true)}
          loading={
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
              <Loader2 className="w-4 h-4 animate-spin" /> Memuat PDF…
            </div>
          }
        >
          {containerWidth > 0 && (
            <Page
              pageNumber={pageNumber}
              width={Math.max(200, containerWidth - 24) * scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="shadow-md"
            />
          )}
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
