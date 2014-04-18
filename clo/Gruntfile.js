/**
 * Gruntfile.js
 *
 * changelog
 * 2014-04-15[21:21:21]:created
 *
 * @info yinyong,osx-x64,UTF-8,10.129.173.56,js,/Volumes/yinyong/gamesubject/anheitulong
 * @author yanni4night@gmail.com
 * @version 0.0.1
 * @since 0.0.1
 */
var fs = require('fs');
var crypto = require('crypto');

module.exports = function(grunt) {

    const STATIC_DIR = 'static/';
    const BUILD_DIR = 'build/';

    const toulun = grunt.file.readJSON('_data/index.json');

    grunt.initConfig({
        jshint: {
            check: {
                src: STATIC_DIR + 'js/**/*.js',
            }
        },
        uglify: {
            compress: {
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['**/*.js'],
                    dest: BUILD_DIR+STATIC_DIR
                }]
            }
        },
        less: {
            development: {
                options: {
                    cleancss: true
                },
                files: [{
                    expand: true,
                    cwd: STATIC_DIR,
                    src: ['**/*.less'],
                    ext: '.css',
                    dest: BUILD_DIR+STATIC_DIR
                }]
            }
        },
        cssmin: {
            merge: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR,
                    src: ['**/*.css'],
                    dest: BUILD_DIR
                }]
            }
        },
        twig_render: {
            render: {
                files: [{
                    template: 'template/index.html',
                    data: '_data/index.json',
                    dest: 'build/template/index.html'
                }]
            }
        },
        'regex-replace': {
            stamp: {
                src: [BUILD_DIR+'**/*.html'],
                actions: [{
                    name: '@',
                    search: /@([\w\-]+?)@/mg,
                    replace: function(n) {
                        return toulun[RegExp.$1] || ''
                    }
                }]
            }

        },
        copy:{
        },
        imagemin:{
            images:{
                files:[{
                                        expand: true,
                    cwd:STATIC_DIR,
                    src: '**/*.{gif,png,jpg}',
                    dest:BUILD_DIR+STATIC_DIR
                }]
            }
        },
        watch: {
            build: {
                files: ['static/js/*.js', 'static/css/*.less', 'template/*.html', '_data/*.json'],
                tasks: ['default']
            }
        },
        clean: {
            options: {
                force: true
            },
            built: ["build/**/*", "**/._*"]
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            html: {
                files: [{
                    expand: true,
                    cwd:BUILD_DIR,
                    src: '**/*.html',
                    ext: '.html',
                    dest:BUILD_DIR
                }]
            }
        },
        stamp: {
            options: {
                baseDir:BUILD_DIR,
            },
            index: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR,
                    src: ['**/*.{html,css}'],
                    dest:BUILD_DIR
                }]
            }
        },
        shell: {
            options: {
                stdout: true
            },
            upload: {
                command: 'sshpass -p "xxx" scp index.html root@ip:/search/path'
            }
        },
        express: {
            test: {
                options: {
                    script: 'app.js',
                    background: false,
                    port: 3008,
                    node_env: 'development',
                    debug: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-twig-render');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-web-stamp');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-shell');


    grunt.registerTask('default', ['jshint','clean', 'uglify', 'less','imagemin','twig_render','stamp','regex-replace','htmlmin']);
};