function exportPDF() {
    html2pdf()
        .from(document.getElementById('cv-preview'))
        .save('CV.pdf');
}