import Moment from 'moment';

export const pdfmixin = {
    methods: {
        async downloadPDFList(samples) {
            await this.removeFolder('PCI');
            for(var sample of samples) {
                if(sample.damages.length == 0)
                    continue;
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_Fallas_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var template = this.damageListTemplate(sample);
                await pdf.fromData(template, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        console.log(opts.fileName);
                        this.savebase64AsPDF('PCI', opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
            }
        },
        async downloadPDFMetering(samples) {
            await this.removeFolder('PCI');
            for(var sample of samples) {
                if(sample.summary.length == 0)
                    continue;
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_Metrado_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var template = this.MeteringSummaryTemplate(sample.summary);
                await pdf.fromData(template, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        console.log(opts.fileName);
                        this.savebase64AsPDF('PCI', opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
            }
        },
        async downloadPDFDeduct(samples) {
            await this.removeFolder('PCI');
            for(var sample of samples) {
                if(sample.summary.length == 0)
                    continue;
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_VD_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var template = this.DeductSummaryTemplate(sample.summary);
                await pdf.fromData(template, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        console.log(opts.fileName);
                        this.savebase64AsPDF('PCI', opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
            }
        },
        async downloadPDFPCI(summary, project_name) {
            await this.removeFolder('PCI');
            var opts = {
                documentSize: 'A4',
                fileName: `PCI_${Moment().format("YYYY_MM_DD_hh_mm_ss")}.pdf`,
                type: 'base64'
            }
            var template = this.PCISummaryTemplate(summary, project_name);
            await pdf.fromData(template, opts)
                .then((base64) => {
                    var contentType = "application/pdf";
                    console.log(opts.fileName);
                    this.savebase64AsPDF('PCI', opts.fileName, base64, contentType);  
                })
                .catch((error) => console.log(error));
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
            window.resolveLocalFileSystemURL(folderpath, async function(dir) {
                console.log("Access to the directory granted succesfully");
                dir.getDirectory(foldername, { create: true }, function(entry) {
                    entry.getFile(filename, { create: true }, function(file) {
                        console.log("File created succesfully.");
                        file.createWriter(function(fileWriter) {
                            console.log("Writing content to file");
                            fileWriter.write(DataBlob);
                        }, function(){
                            alert('Unable to save file in path '+ folderpath);
                        });
                    });
                })
            });
        },
        async removeFolder(foldername) {
            return new Promise(function(resolve) {
                var folderpath = cordova.file.externalRootDirectory + "Download/";
                window.resolveLocalFileSystemURL(folderpath, async function(dir) {
                    dir.getDirectory(foldername, { create: true }, function(entry) {
                        console.log("Removing folder");
                        entry.removeRecursively(function (dir2) {
                            console.log("Folder removed!");
                            resolve();
                        }, function (error) {
                            console.log("error remove folder");
                            console.dir(error);
                            resolve();
                        }, function () {
                            console.log("PCI does not exist");
                            resolve();
                        });
                    });
                });
            })
        },
        damageListTemplate(sample) {
            var content = this.tableStyle() + '<body style="font-size: 60px">';
            for (var damage of sample.damages) {
                content += `
                    <div style="height: 1000px; padding: 50px">
                        <img style="width: 100%; min-height: 100px; max-height: 600px" src="${damage.image}">
                        <table>
                            <tr>
                                <th>Tipo</th>
                                <th>Severidad</th>
                                <th>Cantidad</th>
                            </tr>
                            <tr style="background-color: #FFFFFF;">
                                <td>${damage.type ? damage.type : ''}</td>
                                <td>${damage.severity ? ['', 'L', 'M', 'H'][damage.severity] : ''}</td>
                                <td>${damage.amount ? damage.amount : ''}</td>
                            </tr>
                        </table>
                    </div>
                `
            }

            content += '</body>'
            return content;
        },
        MeteringSummaryTemplate(summary) {
            var content = this.tableStyle() + '<body style="font-size: 60px">';
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
            var content = this.tableStyle() + '<body style="font-size: 60px">';
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
        },
        PCISummaryTemplate(summary, project_name) {
            var content = this.tableStyle() + '<body style="font-size: 60px">';
            content += `<h4 style="margin: 20px; text-align: center">${ project_name }</h4>`;
            var data = [
                { label: 'UM', key: 'UM'},
                { label: 'Del', key: 'Del'},
                { label: 'Al', key: 'Al'},
                { label: 'PCI', key: 'PCI'},
                { label: 'Condición', key: 'Condición'},
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
                // if(!row.n_daños)
                //   continue;
                var tr = document.createElement('tr');
                for(var elem of data) {
                    var td = document.createElement('td');
                    td.appendChild(document.createTextNode(row[elem.key]));
                    if(elem.key=='Condición')
                        td.style.backgroundColor = {
                            'Excelente': '#28B45E',
                            'Muy bueno': '#79C142',
                            'Bueno': '#EBE723',
                            'Regular': '#EE2E2E',
                            'Pobre': '#C22026',
                            'Muy pobre': '#7A1315',
                            'Fallado': '#D9D9D9'
                        }[row['Condición']];
                    tr.appendChild(td);
                }
                tr.style.backgroundColor = '#2C39A982'
                table.appendChild(tr);
            }
            content += table.outerHTML;
            content += '</body>';
            return content;
        },
        tableStyle() {
            return `
                <head>
                    <style>
                        table { padding: 10px 0px; width: 100%; border-spacing: 0 4px; text-align: center; }
                        table tr:nth-child(1) { background-color: #D9D9D9; }
                        table tr { height: 36px; background-color: #2ECC74; }
                    </style>
                </head>
            `
        }
    }
}