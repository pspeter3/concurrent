module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        expr: true
      },
      all: ['Gruntfile.js', 'index.js', 'lib/*.js', 'test/*.js']
    },
    'gh-pages': {
      options: {
        base: 'doc'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-gh-pages');
};