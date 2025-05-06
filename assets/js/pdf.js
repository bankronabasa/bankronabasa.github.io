const categorySelect = document.getElementById('categorySelect');
const yearOrTriwulanSelect = document.getElementById('yearOrTriwulanSelect');
const fileSelect = document.getElementById('fileSelect');
const pdfViewer = document.getElementById('pdfViewer');
const pdfCanvas = document.getElementById('pdfCanvas');
const ctx = pdfCanvas.getContext('2d');
const pdfControls = document.querySelectorAll('.pdf-controls');
const prevPageBtns = document.querySelectorAll('.prevPage');
const nextPageBtns = document.querySelectorAll('.nextPage');
const pageInfos = document.querySelectorAll('.pageInfo');
const loadingSpinner = document.getElementById('pdfLoading');

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

const pageSelectTop = document.getElementById('pageSelectTop');
const pageSelectBottom = document.getElementById('pageSelectBottom');
const totalPageTop = document.getElementById('totalPageTop');
const totalPageBottom = document.getElementById('totalPageBottom');

function resetPageSelectors() {
    pageSelectTop.innerHTML = '';
    pageSelectBottom.innerHTML = '';
    totalPageTop.inertHTML = '';
    totalPageBottom.inertHTML = '';
}

function updatePageSelectors() {
    [pageSelectTop, pageSelectBottom].forEach(select => {
        select.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === currentPage) option.selected = true;
            select.appendChild(option);
        }
    });

    [totalPageTop, totalPageBottom].forEach(totalPage => {
        totalPage.innerHTML = `dari ${totalPages}`;
    });
}

pageSelectTop.addEventListener('change', () => {
    currentPage = parseInt(pageSelectTop.value);
    renderPage(currentPage);
});

pageSelectBottom.addEventListener('change', () => {
    currentPage = parseInt(pageSelectBottom.value);
    renderPage(currentPage);
});

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
            updatePageSelectors(); // update dropdown selection
            prevPageBtns.forEach(btn => btn.disabled = currentPage <= 1);
            nextPageBtns.forEach(btn => btn.disabled = currentPage >= totalPages);
        });
    }).catch(err => {
        console.error("Gagal merender halaman:", err);
        pdfViewer.style.display = 'none';
    });
}


function renderPDF(filePath) {
    if (!filePath) return;

    loadingSpinner.style.display = 'block';
    pdfViewer.style.display = 'block';
    pdfControls.forEach(ctrl => ctrl.style.display = 'none');
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    pdfjsLib.getDocument(filePath).promise.then(function (loadedPdf) {
        resetPageSelectors();

        pdfDoc = loadedPdf;
        totalPages = pdfDoc.numPages;
        currentPage = 1;

        updatePageSelectors();
        renderPage(1);

        loadingSpinner.style.display = 'none';
        pdfControls.forEach(ctrl => {
            ctrl.style.display = totalPages > 1 ? 'flex' : 'none';
        });
    }).catch(error => {
        console.error("Gagal memuat PDF:", error);
        alert("File PDF tidak dapat dimuat.");
        pdfViewer.style.display = 'none';
        loadingSpinner.style.display = 'none';
    });
}


prevPageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });
});

nextPageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });
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
    resetPageSelectors();
    pdfViewer.style.display = 'none';
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    if (filePath) {
        renderPDF(filePath);
    }
});