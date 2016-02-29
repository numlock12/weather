module.exports = function (grunt) {
    var sources = 'app/src/app.js';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            unit: {
                options: {
                    configFile: 'karma.conf.js'
                }
            }
        },
        'http-server': {
            'dev': {
                // the server root directory
                root: '',
                // the server port
                port: 8000,

                // the host ip address
                host: "0.0.0.0",

                cache: 1,
                showDir: true,
                autoIndex: true,

                // server default file extension
                ext: "html",

                // run in parallel with other tasks
                runInBackground: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-http-server');

    // Default task(s).
    grunt.registerTask('default', ['http-server:dev']);

};