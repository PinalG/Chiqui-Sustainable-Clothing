
import { initializeQrCodeTracking, logQrScan, parseQrCodeData } from '@/components/retail-donations/qrCodeTrackingUtils';

export const setupQrCodeTracking = () => {
  // Initialize the QR code tracking system
  initializeQrCodeTracking();
  
  // Add global event listener for QR code scans
  window.addEventListener('qr-code-scanned', (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && customEvent.detail.data) {
      logQrScan(customEvent.detail.data, customEvent.detail.user);
    }
  });
  
  console.log('QR code tracking system set up');
};

// Expose the QR code tracking utility functions
export { logQrScan, parseQrCodeData };

export default {
  setupQrCodeTracking,
  logQrScan,
  parseQrCodeData
};
