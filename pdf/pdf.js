window.onload = function () {
    document.getElementById("download").addEventListener("click", () => {
        const allvoice = document.getElementById("allvoice");

        var opt = {
            margin : [20,0],
            filename: 'myfile.pdf',
            image: { type: 'png', quality: 0.98 }, 
            html2canvas: {
                scale: 2,
                logging: true,
                dpi: 192,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'landscape',
            },
            pagebreak: {  mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().from(allvoice).set(opt).toPdf().get('pdf').then(function(pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            for (i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.setTextColor(100);
                pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() / 2.3), (pdf.internal.pageSize.getHeight() - 0.8));
            }
        }).save();
    });
}
