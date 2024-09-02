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
        sqliteTest() {
            if(!window.sqlitePlugin) {
                console.log('No sqlitePlugin');
                return;
            }
            this.db = Vue.prototype.$db;
            this.db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
                // tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
                // tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
            }, function(error) {
                console.log('Transaction ERROR: ' + error.message);
            }, function() {
                console.log('Populated database OK');
            });
            this.db.transaction(function(tx) {
                tx.executeSql('SELECT count(*) AS mycount FROM DemoTable', [], function(tx, rs) {
                    console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
                    console.dir(rs)
                }, function(tx, error) {
                    console.log('SELECT error: ' + error.message);
                });
            });
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
            // TO DO
            // Implementar claves foráneas
            this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS projects (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    user_id bigint NOT NULL,
                    name character varying(255) NOT NULL,
                    time timestamp(0) NOT NULL,
                    image text,
                    anchoum numeric(15,2),
                    longitudum numeric(15,2),
                    longitudcarretera numeric(15,2)
                )
            `, [], ()=>{}, (error) => { console.log('CREATE TABLE IF NOT EXISTS error: ' + error.message); });
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
                    from_km integer
                )
            `, [], ()=>{}, (error) => { console.log('CREATE TABLE IF NOT EXISTS error: ' + error.message); });
            this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS damages (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    sample_id bigint NOT NULL,
                    number integer NOT NULL,
                    time timestamp(0) NOT NULL,
                    image text,
                    amount numeric(8,1),
                    severity integer,
                    type integer
                )
            `, [], ()=>{}, (error) => { console.log('CREATE TABLE IF NOT EXISTS error: ' + error.message); })
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