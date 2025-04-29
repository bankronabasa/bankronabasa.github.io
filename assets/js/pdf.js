document.addEventListener("DOMContentLoaded", function () {
    const btn2022 = document.getElementById('btn-2022');
    const btn2023 = document.getElementById('btn-2023');
    const btn2024 = document.getElementById('btn-2024');
    const pdfButtons = document.getElementById('pdf-buttons');
    const pdfViewer = document.getElementById('pdf-viewer');

    // Contoh data file PDF, bisa diisi dengan nama file sesungguhnya
    const pdfFiles2022 = ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf'];
    const pdfFiles2023 = ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf'];
    const pdfFiles2024 = ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf'];

    // Function to hide the alert and canvas initially
    function hideCanvasAndAlert() {
        pdfViewer.style.display = 'none';
    }

    // Show PDF buttons for selected year
    function showPDFButtons(year) {
        let files = [];
        switch (year) {
            case '2022': files = pdfFiles2022; break;
            case '2023': files = pdfFiles2023; break;
            case '2024': files = pdfFiles2024; break;
            default: return;
        }

        // Clear any existing buttons
        pdfButtons.innerHTML = '';

        // Create a button for each PDF file
        files.forEach(file => {
            let button = document.createElement('button');
            button.textContent = file;
            button.className = 'btn btn-outline-primary';
            button.onclick = function () { openPDF(year, file); };
            pdfButtons.appendChild(button);
        });
    }

    // Open the selected PDF
    function openPDF(year, file) {
        pdfViewer.style.display = 'block'; // Show canvas

        // Adjust the file path according to the selected year
        const filePath = `/assets/pdf/${year}/${file}`;

        // Here, you can use PDF.js or any other PDF library to render the PDF.
        // For simplicity, you could set up a PDF viewer here or show the PDF in an iframe.

        // Example using an iframe to show the PDF
        const iframe = document.createElement('iframe');
        iframe.src = filePath;
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        pdfViewer.innerHTML = ''; // Clear previous content
        pdfViewer.appendChild(iframe);
    }

    // Event listeners for year selection
    btn2022.addEventListener('click', function () {
        showPDFButtons('2022');
    });
    btn2023.addEventListener('click', function () {
        showPDFButtons('2023');
    });
    btn2024.addEventListener('click', function () {
        showPDFButtons('2024');
    });

    // Initialize with hiding elements
    hideCanvasAndAlert();
});
