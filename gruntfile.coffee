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
        files:
          'dist/css/bootstrap.min.css': ['src/css/bootstrap.min.css']
          'dist/css/jquery-ui.custom.css': ['src/css/jquery-ui.custom.css']
    uncss:
      dist:
        files:
          'dist/css/bootstrap.min.css': ['src/html/popup.html', 'src/html/options.html']
          'dist/css/jquery-ui.custom.css': ['src/html/popup.html']
        options:
          compress: true
    uglify:
      all:
        files:
          'dist/js/background.js': ['src/js/background.js']
          'dist/js/options.js': ['src/js/options.js']
          'dist/js/popup.js': ['src/js/popup.js']
      lib:
        files:
          'dist/js/lib/jquery.min.js': ['src/js/lib/jquery.min.js']
          'dist/js/lib/jquery-ui.custom.min.js': ['src/js/lib/jquery-ui.custom.min.js']
    watch:
      html:
        files: ['src/html/*.html']
        tasks: ['html-inspector']
      js:
        files: ['src/js/*.js']
        tasks: ['jshint', 'jsvalidate']
    exec:
      rake:
        command: 'rake'

  grunt.loadNpmTasks 'grunt-html-inspector'
  grunt.loadNpmTasks 'grunt-jsvalidate'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-uncss'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-exec'
  
  grunt.registerTask 'default', 'watch'
  grunt.registerTask 'test', ['jshint', 'jsvalidate', 'html-inspector']
  grunt.registerTask 'optimize', ['htmlmin', 'cssmin', 'uncss', 'uglify']
  grunt.registerTask 'build', ['optimize', 'exec']