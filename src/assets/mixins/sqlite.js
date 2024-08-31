import Vue from "vue";

export const sqlite = {
    data() {
        return {
            db: null
        };
    },
    methods: {
        sqliteInit() {
            document.addEventListener('deviceready', () => {
                this.db = window.sqlitePlugin.openDatabase({
                    name: 'local_db',
                    location: 'default',
                });
                console.log('sqliteInit');
                console.log(this.db);
                Vue.prototype.$db = this.db;
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
            var values = [
                data.user_id,
                data.name,
                data.time,
                data.anchoum,
                data.longitudum,
                data.longitudcarretera
            ]
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO projects(user_id, name, time, anchoum, longitudum, longitudcarretera) VALUES (?,?,?,?,?,?)', values);
            });
        },
        sqliteGetProjects(user_id) {
            var projects = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM projects WHERE user_id=?', [user_id], function(tx, data) {
                    for(var i=0; i>data.rows.length; i++)
                        projects.push(data.rows.item(i));
                }, function(tx, error) {
                  console.log('SELECT error: ' + error.message);
                });
            });
            return projects;
        },
        sqliteDeleteProject(project_id) {
            this.db.transaction(function(tx) {
                tx.executeSql('DELETE FROM projects WHERE id=?', [project_id]);
            });
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
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO projects(project_id, number, time, from_km, from_m, to_km, to_m) VALUES (?,?,?,?,?,?,?)', values);
            });
        },
        sqliteGetSamples(project_id) {
            var samples = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM samples WHERE project_id=?', [project_id], function(tx, data) {
                    for(var i=0; i>data.rows.length; i++)
                        samples.push(data.rows.item(i));
                }, function(tx, error) {
                  console.log('SELECT error: ' + error.message);
                });
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
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO projects(sample_id, number, time, amount, severity, type) VALUES (?,?,?,?,?,?)', values);
            });
        },
        sqliteGetDamage(sample_id) {
            var damages = [];
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM damages WHERE sample_id=?', [sample_id], function(tx, data) {
                    for(var i=0; i>data.rows.length; i++)
                        damages.push(data.rows.item(i));
                }, function(tx, error) {
                  console.log('SELECT error: ' + error.message);
                });
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
            this.db.transaction(function(tx) {
                tx.executeSql(`
                    UPDATE damages
                    SET amount=?, severity=?, type=?
                    WHERE id=?
                `, values);
            });
        },
        sqliteDeleteDamage(damage_id) {
            this.db.transaction(function(tx) {
                tx.executeSql('DELETE FROM damages WHERE id=?', [damage_id]);
            });
        },
        sqliteCreateTables() {
            if(!window.sqlitePlugin) {
                console.log('No sqlitePlugin');
                return;
            }
            this.db.transaction(function(tx) {
                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS projects (
                        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                        user_id bigint(20) unsigned NOT NULL,
                        name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                        time datetime NOT NULL,
                        image longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        created_at timestamp NULL DEFAULT NULL,
                        updated_at timestamp NULL DEFAULT NULL,
                        anchoum decimal(15,2) DEFAULT NULL,
                        longitudum decimal(15,2) DEFAULT NULL,
                        longitudcarretera decimal(15,2) DEFAULT NULL,
                        PRIMARY KEY (id),
                        KEY projects_user_id_foreign (user_id),
                        CONSTRAINT projects_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id)
                )`);
                tx.executeSql(`
                    CREATE TABLE  IF NOT EXISTS samples (
                        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                        project_id bigint(20) unsigned NOT NULL,
                        number int(11) NOT NULL,
                        time datetime NOT NULL,
                        image longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        from_km int(11) DEFAULT NULL,
                        from_m int(11) DEFAULT NULL,
                        to_km int(11) DEFAULT NULL,
                        to_m int(11) DEFAULT NULL,
                        created_at timestamp NULL DEFAULT NULL,
                        updated_at timestamp NULL DEFAULT NULL,
                        PRIMARY KEY (id),
                        KEY samples_project_id_foreign (project_id),
                        CONSTRAINT samples_project_id_foreign FOREIGN KEY (project_id) REFERENCES projects (id)
                )`);
                tx.executeSql(`
                    CREATE TABLE damages (
                        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                        sample_id bigint(20) unsigned NOT NULL,
                        number int(11) NOT NULL,
                        time datetime NOT NULL,
                        image longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        type int(11) DEFAULT NULL,
                        severity int(11) DEFAULT NULL,
                        amount decimal(8,1) DEFAULT NULL,
                        created_at timestamp NULL DEFAULT NULL,
                        updated_at timestamp NULL DEFAULT NULL,
                        PRIMARY KEY (id),
                        KEY surveys_sample_id_foreign (sample_id),
                        CONSTRAINT surveys_sample_id_foreign FOREIGN KEY (sample_id) REFERENCES samples (id)
                )`)
            });
        }
    }
}