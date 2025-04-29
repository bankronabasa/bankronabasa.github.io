let selectedYear = null;
let selectedFile = null;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Tombol tahun
document.querySelectorAll('[id^=btn-20]').forEach(btn => {
    btn.addEventListener('click', () => {
        // Tandai tahun yang dipilih
        document.querySelectorAll('[id^=btn-20]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        selectedYear = btn.id.replace('btn-', '');

        // Reset pilihan file
        selectedFile = null;
        document.getElementById('pdf-buttons').innerHTML = ''; // Kosongkan dulu tombol laporan
        document.getElementById('pdf-canvas').classList.add('d-none');

        // Misalnya isi tombol file:
        const files = ['LKPK-LKP-01.pdf', 'LKPK-LKP-02.pdf', 'LKPK-LKP-03.pdf', 'LKPK-LKP-04.pdf', 'LKPK-LKP-05.pdf'];
        files.forEach(file => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-secondary';
            button.textContent = file;
            button.addEventListener('click', () => {
                // Tandai file yang dipilih
                document.querySelectorAll('#pdf-buttons button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                selectedFile = file;
                loadPDF(`assets/pdf/${selectedYear}/${selectedFile}`);
            });
            document.getElementById('pdf-buttons').appendChild(button);
        });
    });
});

function loadPDF(url) {
    const viewer = document.getElementById('pdf-viewer');
    viewer.classList.remove('d-none');

    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');

    pdfjsLib.getDocument(url).promise.then(pdf => {
        return pdf.getPage(1);
    }).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        return page.render({ canvasContext: ctx, viewport: viewport }).promise;
    }).catch(error => {
        console.error("Gagal load PDF:", error);
        alert("Gagal membuka file PDF.");
    });
}
