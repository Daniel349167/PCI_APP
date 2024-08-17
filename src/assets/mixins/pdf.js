import Moment from 'moment';

export const pdfmixin = {
    methods: {
        async downloadPDFList(samples) {
            for(var sample of samples) {
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_Fallas_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var template = this.damageListTemplate(sample);
                await pdf.fromData(template, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        var foldername = 'Fallas';
                        console.log(opts.fileName);
                        this.savebase64AsPDF(foldername, opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
            }
        },
        async downloadPDFMetering(samples) {
            for(var sample of samples) {
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_Metrado_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var template = this.MeteringSummaryTemplate(sample.summary);
                await pdf.fromData(template, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        var foldername = 'Metrado';
                        console.log(opts.fileName);
                        this.savebase64AsPDF(foldername, opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
            }
        },
        async downloadPDFDeduct(samples) {
            for(var sample of samples) {
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_VD_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var template = this.DeductSummaryTemplate(sample.summary);
                await pdf.fromData(template, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        var foldername = 'ValoresDeducidos';
                        console.log(opts.fileName);
                        this.savebase64AsPDF(foldername, opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
            }
        },
        b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
        },
        savebase64AsPDF(foldername,filename,content,contentType){
            // Convert the base64 string in a Blob
            var DataBlob = this.b64toBlob(content,contentType);
            console.log("Starting to write the file :3");
            var folderpath = cordova.file.externalRootDirectory + "Download/";
            window.resolveLocalFileSystemURL(folderpath, function(dir) {
                console.log("Access to the directory granted succesfully");
                dir.getDirectory('PCI', { create: true }, function(dir2) {
                    dir2.getDirectory(foldername, {create: true}, function(dir3) {
                        dir3.getFile(filename, {create: true}, function(file) {
                            console.log("File created succesfully.");
                            file.createWriter(function(fileWriter) {
                                console.log("Writing content to file");
                                fileWriter.write(DataBlob);
                            }, function(){
                                alert('Unable to save file in path '+ folderpath);
                            });
                        })
                    });
                })
            });
        },
        damageListTemplate(sample) {
            var content = '<body style="font-size: 60px">'
            for (var damage of sample.damages) {
                content += `
                    <div style="height: 1000px; padding: 50px">
                        <img style="width: 100%; min-height: 100px; max-height: 600px" src="${damage.image}">
                        <div style="margin-top: 20px">
                            <span style="font-weight: bold">
                                Tipo:
                            </span>
                            <span>
                                ${damage.type ? damage.type : ''}
                            </span>
                        </div>
                        <div>
                            <span style="font-weight: bold">
                                Severidad:
                            </span>
                            <span>
                                ${damage.severity ? ['', 'L', 'M', 'H'][damage.severity] : ''}
                            </span>
                        </div>
                        <div>
                            <span style="font-weight: bold">
                                Cantidad:
                            </span>
                            <span>
                                ${damage.amount ? damage.amount : ''}
                            </span>
                        </div>
                    </div>
                `
            }
            content += '</body>'
            return content;
        },
        MeteringSummaryTemplate(summary) {
            // var content = '<head><link rel="stylesheet" href="file:///android_asset/www/"></head>'; 
            var content = '<body style="font-size: 60px">';
            var data = [
                { label: 'N°', key: 'id' },
                { label: 'Tipo falla', key: 'tipo_falla' },
                { label: 'Unidad', key: 'unidad' },
                { label: 'Severidad', key: 'severidad' },
                { label: 'Metrado', key: 'metrado' },
            ]
            var table = document.createElement('table');
            var head = document.createElement('tr');
            
            for(var elem of data) {
                var th = document.createElement('th');
                th.appendChild(document.createTextNode(elem.label));
                head.appendChild(th);
            }
            table.appendChild(head);

            for(var row of summary) {
                var tr = document.createElement('tr');
                for(var elem of data) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(row[elem.key]));
                tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            content += table.outerHTML;
            content += '</body>';
            return content;
        },
        DeductSummaryTemplate(summary) {
            var content = '<body style="font-size: 60px">'
            var data = [
                { label: 'Daño', key: 'Daño' },
                { label: 'Severidad', key: 'Severidad' },
                { label: 'Total', key: 'Total' },
                { label: 'Densidad', key: 'Densidad' },
                { label: 'VD', key: 'VD' },
            ]
            var table = document.createElement('table');
            var head = document.createElement('tr');
            
            for(var elem of data) {
                var th = document.createElement('th');
                th.appendChild(document.createTextNode(elem.label));
                head.appendChild(th);
            }
            table.appendChild(head);

            for(var row of summary) {
                var tr = document.createElement('tr');
                console.log('row')
                console.log(row)
                for(var elem of data) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(row[elem.key]));
                tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            content += table.outerHTML;
            content += '</body>';
            return content;
        }
    }
}