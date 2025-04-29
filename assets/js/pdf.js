const yearSelect = document.getElementById('yearSelect');
const fileSelect = document.getElementById('fileSelect');
const pdfViewer = document.getElementById('pdfViewer');
const pdfCanvas = document.getElementById('pdfCanvas');
const ctx = pdfCanvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pdfControls = document.getElementById('pdfControls');
let pdfDoc = null;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

let currentPage = 1;
let totalPages = 1;

// Fungsi untuk render halaman pertama dari PDF
function renderPage(pageNumber) {
    pdfDoc.getPage(pageNumber).then(function (page) {
        const viewport = page.getViewport({ scale: 1.5 });
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
            prevPageBtn.disabled = currentPage <= 1;
            nextPageBtn.disabled = currentPage >= totalPages;
        });
    }).catch(err => {
        console.error("Gagal merender halaman:", err);
        pdfViewer.style.display = 'none';
    });
}

// Fungsi untuk menampilkan PDF viewer
function renderPDF(filePath) {
    if (!filePath) return;

    pdfjsLib.getDocument(filePath).promise.then(function (loadedPdf) {
        pdfDoc = loadedPdf;
        totalPages = pdfDoc.numPages;
        currentPage = 1;

        pdfViewer.style.display = 'block';
        pdfControls.style.display = totalPages > 1 ? 'block' : 'none';

        renderPage(1); // Render halaman pertama
    }).catch(error => {
        console.error("Gagal memuat PDF:", error);
        alert("File PDF tidak dapat dimuat. Pastikan file tersedia dan tidak corrupt.");
        pdfViewer.style.display = 'none';
        pdfControls.style.display = 'none';
    });
}

// Tombol navigasi halaman
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});

// Update pilihan file berdasarkan tahun yang dipilih
yearSelect.addEventListener('change', function () {
    const year = yearSelect.value;
    fileSelect.innerHTML = '<option value="">Pilih File</option>';

    if (year) {
        const files = getFilesForYear(year);
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });
    }

    // Sembunyikan viewer & reset canvas
    pdfViewer.style.display = 'none';
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
});

// Pilih file untuk merender PDF
fileSelect.addEventListener('change', function () {
    const year = yearSelect.value;
    const file = fileSelect.value;
    const filePath = (year && file) ? `assets/pdf/${year}/${file}` : '';

    // Sembunyikan viewer & reset canvas sebelum load baru
    pdfViewer.style.display = 'none';
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    if (filePath) {
        renderPDF(filePath);
    }
});

// Fungsi untuk mendapatkan file berdasarkan tahun
function getFilesForYear(year) {
    const fileMapping = {
        '2022': ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf'],
        '2023': ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf'],
        '2024': ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf']
    };
    return fileMapping[year] || [];
}

// Saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function () {
    yearSelect.value = '';
    fileSelect.innerHTML = '<option value="">Pilih File</option>';
    pdfViewer.style.display = 'none';
});
