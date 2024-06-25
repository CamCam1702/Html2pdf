window.onload = function () {
    document.getElementById("download")
        .addEventListener("click", () => {
            const allvoice = this.document.getElementById("allvoice");
            console.log(allvoice);
            console.log(window);
            var opt = {
                margin: 1,
                filename: 'myfile.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak: { mode: 'avoid-all', before: '#page2el' }
            };
        
            html2pdf().from(allvoice).set(opt).toPdf().get('pdf').then(function (pdf) {
                var totalPages = pdf.internal.getNumberOfPages();
                console.log('Total pages: ' + totalPages); // Log ra số trang
                for (var i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.text('Page ' + String(i) + ' of ' + String(totalPages), 10, pdf.internal.pageSize.height - 10);
                }
            }).save();
        })
}