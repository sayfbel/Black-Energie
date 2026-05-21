import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a high-quality PDF from a DOM element.
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} fileName - The name of the downloaded file.
 * @returns {Promise<void>}
 */
export const generatePremiumPDF = async (elementId, fileName = 'Certificate.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID ${elementId} not found.`);
    }

    try {
        // 1. Identify the QR code and its position BEFORE capture
        const qrImg = element.querySelector('img[alt="Order QR"]');
        let qrData = null;
        let qrPosition = null;

        if (qrImg && qrImg.src.startsWith('data:')) {
            qrData = qrImg.src;
            const elementRect = element.getBoundingClientRect();
            const qrRect = qrImg.getBoundingClientRect();
            
            // Calculate relative position (%) of the QR code within the ticket
            qrPosition = {
                leftRel: (qrRect.left - elementRect.left) / elementRect.width,
                topRel: (qrRect.top - elementRect.top) / elementRect.height,
                widthRel: qrRect.width / elementRect.width,
                heightRel: qrRect.height / elementRect.height
            };
        }

        // 2. Wait for OTHER images (logos, etc.)
        const images = Array.from(element.getElementsByTagName('img')).filter(img => img !== qrImg);
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
        }));

        // 3. Capture the main ticket (QR code might be blank here, but we don't care anymore)
        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#0b0b0b',
            logging: false,
            imageTimeout: 0
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Fit the main ticket to the page
        const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;

        // 4. Add the main ticket image
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');

        // 5. MANUAL INJECTION: Stamp the QR code on top at the calculated coordinates
        if (qrData && qrPosition) {
            const finalQrX = xOffset + (qrPosition.leftRel * imgWidth);
            const finalQrY = yOffset + (qrPosition.topRel * imgHeight);
            const finalQrW = qrPosition.widthRel * imgWidth;
            const finalQrH = qrPosition.heightRel * imgHeight;

            // We use PNG because QR codes have transparency/sharp edges
            pdf.addImage(qrData, 'PNG', finalQrX, finalQrY, finalQrW, finalQrH, undefined, 'FAST');
        }

        pdf.save(fileName);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    }
};
