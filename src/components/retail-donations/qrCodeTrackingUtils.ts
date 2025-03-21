
// Utility functions for QR code tracking system
import { UserData } from "@/types/AuthTypes";

// Initialize event listener for tab switching
export const initializeQrCodeTracking = () => {
  // Listen for switch-tab events
  document.addEventListener('switch-tab', (event: Event) => {
    const customEvent = event as CustomEvent;
    
    if (customEvent.detail && customEvent.detail.tab) {
      // Find the tab trigger element
      const tabTrigger = document.querySelector(`[data-value="${customEvent.detail.tab}"]`);
      if (tabTrigger && tabTrigger instanceof HTMLElement) {
        // Click the tab to switch to it
        tabTrigger.click();
        
        // If itemId and itemName are provided (for QR generation)
        if (customEvent.detail.tab === 'qrcode' && 
            customEvent.detail.itemId && 
            customEvent.detail.itemName) {
          // Find the inventory dropdown and set its value
          setTimeout(() => {
            // Select the inventory item dropdown
            const inventoryDropdown = document.querySelector('select[name="inventoryId"]');
            if (inventoryDropdown && inventoryDropdown instanceof HTMLSelectElement) {
              inventoryDropdown.value = customEvent.detail.itemId;
              // Trigger change event
              const event = new Event('change', { bubbles: true });
              inventoryDropdown.dispatchEvent(event);
            }
            
            // Set batch name input value
            const batchNameInput = document.querySelector('input[name="batchName"]');
            if (batchNameInput && batchNameInput instanceof HTMLInputElement) {
              batchNameInput.value = customEvent.detail.itemName;
              // Trigger change event
              const event = new Event('change', { bubbles: true });
              batchNameInput.dispatchEvent(event);
            }
          }, 100);
        }
      }
    }
  });
  
  console.log('QR Code tracking system initialized');
};

// Log QR code scan to tracking system (with location)
export const logQrScan = async (qrData: any, userData?: UserData | null) => {
  try {
    // Get location (if available and permitted)
    let locationStr = "Unknown Location";
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        locationStr = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.log('Location permission denied or error:', error);
    }
    
    // In a real app, this would make an API call to log the scan
    console.log("Logging scan to tracking system:", {
      itemId: qrData.id,
      itemName: qrData.name,
      itemType: qrData.type,
      scannedBy: userData?.displayName || "Unknown User", // Fixed: use displayName instead of name
      scannedAt: new Date().toISOString(),
      location: locationStr,
    });
    
    // Update local storage with scan history for demo purposes
    const scanHistory = JSON.parse(localStorage.getItem("qrScanHistory") || "[]");
    scanHistory.push({
      itemId: qrData.id,
      itemName: qrData.name,
      itemType: qrData.type,
      scannedBy: userData?.displayName || "Unknown User", // Fixed: use displayName instead of name
      scannedAt: new Date().toISOString(),
      location: locationStr,
    });
    localStorage.setItem("qrScanHistory", JSON.stringify(scanHistory));
    
    return true;
  } catch (error) {
    console.error("Error logging scan:", error);
    return false;
  }
};

// Parse QR code data from string
export const parseQrCodeData = (qrCodeString: string): any => {
  try {
    return JSON.parse(qrCodeString);
  } catch (error) {
    console.error("Error parsing QR code data:", error);
    return null;
  }
};
