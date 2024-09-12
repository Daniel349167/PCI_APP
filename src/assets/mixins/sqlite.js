import Vue from "vue";

export const sqlite = {
    data() {
        return {
            db: null
        };
    },
    mounted() {
        this.db = Vue.prototype.$db;
    },
    methods: {
        sqliteInit() {
            document.addEventListener('deviceready', () => {
                this.db = window.sqlitePlugin.openDatabase({
                    name: 'local_db',
                    location: 'default',
                });
                console.log('sqliteInit');
                console.dir(this.db);
                Vue.prototype.$db = this.db;
                this.sqliteCreateTables(); // Crea las tablas si no existen
            });
        },
        sqliteListTables() {
            this.sqliteInit()
            if (!window.sqlitePlugin) {
                console.log('No sqlitePlugin');
                return;
            }
        
            this.db = Vue.prototype.$db;
            
            // Consulta para obtener los nombres de todas las tablas
            this.db.transaction((tx) => {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], (tx, result) => {
                    let tables = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        const tableName = result.rows.item(i).name;
                        tables.push(tableName);
                    }
                    // Llama a una función para obtener las filas de cada tabla
                    this.sqliteGetTableData(tables);
                }, (error) => {
                    console.log("Error al obtener nombres de tablas: " + error.message);
                });
            });
        },
        
        sqliteGetTableData(tables) {
            let allTablesData = {}; // Objeto para almacenar todas las tablas y sus filas
        
            tables.forEach((table) => {
                this.db.transaction((tx) => {
                    // Consulta para obtener las filas de cada tabla
                    tx.executeSql(`SELECT * FROM ${table}`, [], (tx, result) => {
                        let rows = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            rows.push(result.rows.item(i));
                        }
                        allTablesData[table] = rows; // Almacena las filas en el objeto
                    }, (error) => {
                        console.log(`Error al obtener filas de la tabla ${table}: ` + error.message);
                    });
                });
            });
        
            // Muestra los datos en la consola en formato JSON
            setTimeout(() => {
                console.log("Datos de todas las tablas: ", JSON.stringify(allTablesData, null, 2));
            }, 1000); // Retraso para asegurarse de que todas las transacciones terminen
        },
        

        sqliteCreateProject(data) {
            // Recordar añadir user_id al form
            var values = [
                data.user_id,
                data.name,
                data.time,
                data.anchoum,
                data.longitudum,
                data.longitudcarretera
            ]
            this.db.executeSql(
                'INSERT INTO projects(user_id, name, time, anchoum, longitudum, longitudcarretera) VALUES (?,?,?,?,?,?)',
                values,
                () => { console.log('INSERT success'); },
                (error) => { console.log('INSERT error: ' + error.message); }
            );
            // TO DO
            // Crear unidades de muestra
        },
        async sqliteGetProjects(user_id) {
            var projects = [];
            await new Promise((resolve) => {
                this.db.executeSql('SELECT * FROM projects WHERE user_id=?', [user_id], function(data) {
                    for(var i=0; i<data.rows.length; i++)
                        projects.push(data.rows.item(i));
                    resolve();
                }, function(error) {
                    console.log('SELECT error: ' + error.message);
                    resolve();
                });
            });
            return projects;
        },
        sqliteDeleteProject(project_id) {
            // TO DO
            // Obtener daños y muestras del proyecto y eliminarlos
            this.db.executeSql(
                'DELETE FROM projects WHERE id=?',
                [project_id],
                () => { console.log('DELETE success'); },
                (error) => { console.log('DELETE error: ' + error.message); }
            );
        },
        sqliteCreateSample(data) {
            var values = [
                data.project_id,
                data.number,
                data.time,
                data.from_km,
                data.from_m,
                data.to_km,
                data.to_m
            ]
            this.db.executeSql(
                'INSERT INTO projects(project_id, number, time, from_km, from_m, to_km, to_m) VALUES (?,?,?,?,?,?,?)',
                values,
                () => { console.log('INSERT success'); },
                (error) => { console.log('INSERT error: ' + error.message); }
            );
        },
        sqliteGetSamples(project_id) {
            var samples = [];
            this.db.executeSql('SELECT * FROM samples WHERE project_id=?', [project_id], function(tx, data) {
                for(var i=0; i>data.rows.length; i++)
                    samples.push(data.rows.item(i));
            }, function(tx, error) {
                console.log('SELECT error: ' + error.message);
            });
            return samples;
        },
        sqliteCreateDamage(data) {
            var values = [
                data.sample_id,
                data.number,
                data.time,
                data.amount,
                data.severity,
                data.type
            ]
            this.db.executeSql('INSERT INTO projects(sample_id, number, time, amount, severity, type) VALUES (?,?,?,?,?,?)', values);
        },
        sqliteGetDamages(sample_id) {
            var damages = [];
            this.db.executeSql('SELECT * FROM damages WHERE sample_id=?', [sample_id], function(tx, data) {
                for(var i=0; i>data.rows.length; i++)
                    damages.push(data.rows.item(i));
            }, function(tx, error) {
                console.log('SELECT error: ' + error.message);
            });
            return damages;
        },
        sqliteUpdateDamage(damage_id, data) {
            var values = [
                data.amount,
                data.severity,
                data.type,
                damage_id
            ]
            this.db.executeSql(`
                UPDATE damages
                SET amount=?, severity=?, type=?
                WHERE id=?
            `, values);
        },
        sqliteDeleteDamage(damage_id) {
            this.db.executeSql(
                'DELETE FROM damages WHERE id=?',
                [damage_id],
                () => { console.log('DELETE success'); },
                (error) => { console.log('DELETE error: ' + error.message); }
            );
        },
        sqliteCreateTables() {
            if(!window.sqlitePlugin) {
                console.log('No sqlitePlugin');
                return;
            }
            
            // Crear tabla projects con campo deleted_at
            this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS projects (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    user_id bigint NOT NULL,
                    name character varying(255) NOT NULL,
                    time timestamp(0) NOT NULL,
                    image text,
                    anchoum numeric(15,2),
                    longitudum numeric(15,2),
                    longitudcarretera numeric(15,2),
                    deleted_at timestamp NULL
                )
            `, [], ()=>{ 
                console.log('Tabla projects creada'); 
                // Inserción de datos de ejemplo
                this.db.executeSql(`
                    INSERT INTO projects (user_id, name, time, anchoum, longitudum, longitudcarretera)
                    VALUES (1, 'Proyecto 1', datetime('now'), 5.5, 10.5, 15.5)
                `, [], ()=>{ console.log('Proyecto insertado'); }, (error) => { console.log('INSERT INTO projects error: ' + error.message); });
            }, (error) => { console.log('CREATE TABLE projects error: ' + error.message); });
            
            // Crear tabla samples con campo deleted_at
            this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS samples (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    project_id bigint NOT NULL,
                    number integer NOT NULL,
                    time timestamp(0) NOT NULL,
                    image text,
                    to_m integer,
                    to_km integer,
                    from_m integer,
                    from_km integer,
                    deleted_at timestamp NULL
                )
            `, [], ()=>{ 
                console.log('Tabla samples creada'); 
                // Inserción de datos de ejemplo
                this.db.executeSql(`
                    INSERT INTO samples (project_id, number, time, from_km, from_m, to_km, to_m)
                    VALUES (1, 1, datetime('now'), 0, 0, 1, 50)
                `, [], ()=>{ console.log('Muestra insertada'); }, (error) => { console.log('INSERT INTO samples error: ' + error.message); });
            }, (error) => { console.log('CREATE TABLE samples error: ' + error.message); });
            
            // Crear tabla damages con campo deleted_at
            this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS damages (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    sample_id bigint NOT NULL,
                    number integer NOT NULL,
                    time timestamp(0) NOT NULL,
                    image text,
                    amount numeric(8,1),
                    severity integer,
                    type integer,
                    deleted_at timestamp NULL
                )
            `, [], ()=>{ 
                console.log('Tabla damages creada'); 
                // Inserción de datos de ejemplo
                this.db.executeSql(`
                    INSERT INTO damages (sample_id, number, time, amount, severity, type)
                    VALUES (1, 1, datetime('now'), 100.0, 2, 1)
                `, [], ()=>{ console.log('Daño insertado'); }, (error) => { console.log('INSERT INTO damages error: ' + error.message); });
            }, (error) => { console.log('CREATE TABLE damages error: ' + error.message); });
        },
        
        sqliteTruncateTables() {
            if(!window.sqlitePlugin) {
                console.log('No sqlitePlugin');
                return;
            }
            this.db.executeSql('DELETE FROM damages');
            this.db.executeSql('DELETE FROM samples');
            this.db.executeSql('DELETE FROM projects');
        },
        sqliteDeleteTables() {
            if(!window.sqlitePlugin) {
                console.log('No sqlitePlugin');
                return;
            }
            this.db.executeSql('DROP TABLE IF EXISTS damages');
            this.db.executeSql('DROP TABLE IF EXISTS samples');
            this.db.executeSql('DROP TABLE IF EXISTS projects');
        }
    }
}