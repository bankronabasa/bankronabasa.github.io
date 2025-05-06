const categorySelect = document.getElementById('categorySelect');
const yearOrTriwulanSelect = document.getElementById('yearOrTriwulanSelect');
const fileSelect = document.getElementById('fileSelect');
const pdfViewer = document.getElementById('pdfViewer');
const pdfCanvas = document.getElementById('pdfCanvas');
const ctx = pdfCanvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pdfControls = document.getElementById('pdfControls');
const pageInfo = document.getElementById('pageInfo');
let pdfDoc = null;
let currentPage = 1;
let totalPages = 1;

const data = [
    {
        "kategori": "Laporan Keuangan Publikasi",
        "laporan": [
            {
                "tahun": 2022,
                "triwulan": "IV",
                "file": ["LKPK-LKP-01.pdf", "LKPK-LKP-02.pdf", "LKPK-LKP-03.pdf", "LKPK-LKP-04.pdf", "LKPK-LKP-05.pdf"]
            },
            {
                "tahun": 2023,
                "triwulan": "IV",
                "file": ["LKPK-LKP-01.pdf", "LKPK-LKP-02.pdf", "LKPK-LKP-03.pdf", "LKPK-LKP-04.pdf", "LKPK-LKP-05.pdf"]
            },
            {
                "tahun": 2024,
                "triwulan": "IV",
                "file": ["LKPK-LKP-01.pdf", "LKPK-LKP-02.pdf", "LKPK-LKP-03.pdf", "LKPK-LKP-04.pdf", "LKPK-LKP-05.pdf"]
            }
        ]
    },
    {
        "kategori": "Laporan Keuangan Tahunan",
        "laporan": [
            {
                "tahun": 2024,
                "file": ["Laporan Tahunan 2024.pdf"]
            }
        ]
    }
];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

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

function renderPDF(filePath) {
    if (!filePath) return;
    pdfjsLib.getDocument(filePath).promise.then(function (loadedPdf) {
        pdfDoc = loadedPdf;
        totalPages = pdfDoc.numPages;
        currentPage = 1;
        pdfViewer.style.display = 'block';
        pdfControls.style.display = totalPages > 1 ? 'block' : 'none';
        renderPage(1);
    }).catch(error => {
        console.error("Gagal memuat PDF:", error);
        alert("File PDF tidak dapat dimuat.");
        pdfViewer.style.display = 'none';
        pdfControls.style.display = 'none';
    });
}

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

// Populate kategori
document.addEventListener('DOMContentLoaded', function () {
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.kategori;
        option.textContent = item.kategori;
        categorySelect.appendChild(option);
    });

    yearOrTriwulanSelect.innerHTML = '<option value="">Pilih Tahun/Triwulan</option>';
    fileSelect.innerHTML = '<option value="">Pilih File</option>';
    pdfViewer.style.display = 'none';
});

// Saat kategori dipilih
categorySelect.addEventListener('change', function () {
    const selectedCategory = this.value;
    const selectedData = data.find(item => item.kategori === selectedCategory);

    yearOrTriwulanSelect.innerHTML = '<option value="">Pilih Tahun/Triwulan</option>';
    fileSelect.innerHTML = '<option value="">Pilih File</option>';
    pdfViewer.style.display = 'none';
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    if (selectedData) {
        selectedData.laporan.forEach(lap => {
            const option = document.createElement('option');
            option.value = `${lap.tahun}${lap.triwulan ? '-' + lap.triwulan : ''}`;
            option.textContent = lap.triwulan ? `Triwulan ${lap.triwulan} ${lap.tahun}` : `${lap.tahun}`;
            yearOrTriwulanSelect.appendChild(option);
        });
    }
});

// Saat tahun/triwulan dipilih
yearOrTriwulanSelect.addEventListener('change', function () {
    const selectedCategory = categorySelect.value;
    const selectedKey = this.value;
    const [year, triwulan] = selectedKey.split('-');
    const selectedData = data.find(item => item.kategori === selectedCategory);
    const laporan = selectedData?.laporan?.find(l =>
        l.tahun == year && (triwulan ? l.triwulan === triwulan : true)
    );

    fileSelect.innerHTML = '<option value="">Pilih File</option>';
    pdfViewer.style.display = 'none';
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    if (laporan) {
        laporan.file.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });
    }
});

// Saat file dipilih
fileSelect.addEventListener('change', function () {
    const selectedCategory = categorySelect.value;
    const selectedKey = yearOrTriwulanSelect.value;
    const fileName = this.value;

    const [year] = selectedKey.split('-');
    const categorySlug = selectedCategory.replace(/\s+/g, '-');

    const filePath = fileName ? `assets/pdf/${categorySlug}/${year}/${fileName}` : '';
    console.log(filePath);
    pdfViewer.style.display = 'none';
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    if (filePath) {
        renderPDF(filePath);
    }
});
