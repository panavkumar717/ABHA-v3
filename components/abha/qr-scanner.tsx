"use client"

import { useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void
    onScanFailure?: (error: string) => void
}

export function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    useEffect(() => {
        // delay to ensure the div is in DOM
        const timer = setTimeout(() => {
            if (!scannerRef.current) {
                scannerRef.current = new Html5QrcodeScanner(
                    "qr-reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
                )
                scannerRef.current.render(onScanSuccess, (error) => {
                    if (onScanFailure) onScanFailure(error)
                })
            }
        }, 100)

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((error) => {
                    console.error("Failed to clear html5QrcodeScanner. ", error)
                })
                scannerRef.current = null
            }
            clearTimeout(timer)
        }
    }, [onScanSuccess, onScanFailure])

    return (
        <div className="w-full">
            <div id="qr-reader" className="overflow-hidden rounded-xl border-none" />
            <style jsx global>{`
        #qr-reader {
          border: none !important;
        }
        #qr-reader img {
          display: none !important;
        }
        #qr-reader__dashboard {
            background: transparent !important;
            color: white !important;
        }
        #qr-reader__status_span {
            color: #6B8F86 !important;
            font-size: 12px !important;
        }
        #qr-reader button {
            background: #0A7764 !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            margin: 5px !important;
        }
        #qr-reader button:hover {
            background: #12B88A !important;
        }
      `}</style>
        </div>
    )
}
