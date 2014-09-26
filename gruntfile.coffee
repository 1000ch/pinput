module.exports = (grunt) ->
  
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    'html-inspector':
      all:
        src: ['src/html/*.html']
    jshint:
      all: ['src/js/*.js']
    jsvalidate:
      options:
        globals: {}
        esprimaOptions: {}
        verbose: false
      all:
        files:
          src: ['<%=jshint.all%>']
    htmlmin:
      all:
        options:
          removeComments: true
          collapseWhitespace: true
        files:
          'dist/html/background.html': 'src/html/background.html'
          'dist/html/options.html': 'src/html/options.html'
          'dist/html/popup.html': 'src/html/popup.html'
    cssmin:
      all:
        options:
          keepSpecialComments: 1
        files:
          'dist/css/bootstrap.min.css': ['src/css/bootstrap.min.css']
          'dist/css/jquery-ui.custom.css': ['src/css/jquery-ui.custom.css']
    uglify:
      all:
        files:
          'dist/js/background.js': ['src/js/background.js']
          'dist/js/options.js': ['src/js/options.js']
          'dist/js/popup.js': ['src/js/popup.js']
          'dist/js/common.js': ['src/js/common.js']
    copy:
      fonts:
        files: [{
          expand: true,
          flatten: true,
          cwd: 'bower_components/',
          src: ['bootstrap/dist/fonts/*'],
          dest: 'src/fonts'
        }]
      css:
        files: [{
          expand: true,
          flatten: true,
          cwd: 'bower_components/',
          src: ['bootstrap/dist/css/bootstrap.min.css'],
          dest: 'src/css/lib'
        }, {
          expand: true,
          flatten: true,
          cwd: 'bower_components/',
          src: ['bootstrap/dist/css/bootstrap.min.css'],
          dest: 'dist/css/lib'
        }]
      js:
        files: [{
          expand: true,
          flatten: true,
          cwd: 'bower_components/',
          src: ['jquery/dist/jquery.min.js', 'bootstrap/dist/js/bootstrap.min.js'],
          dest: 'src/js/lib'
        }, {
          expand: true,
          flatten: true,
          cwd: 'bower_components/',
          src: ['jquery/dist/jquery.min.js', 'bootstrap/dist/js/bootstrap.min.js'],
          dest: 'dist/js/lib'
        }, {
          expand: true,
          flatten: true,
          src: ['src/js/lib/jquery-ui.custom.min.js'],
          dest: 'dist/js/lib'
        }]

  grunt.loadNpmTasks 'grunt-html-inspector'
  grunt.loadNpmTasks 'grunt-jsvalidate'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  
  grunt.registerTask 'default', 'watch'
  grunt.registerTask 'test', ['jshint', 'jsvalidate', 'html-inspector']
  grunt.registerTask 'build', ['htmlmin', 'cssmin', 'uglify', 'copy']