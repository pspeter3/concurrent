module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        expr: true
      },
      all: ['Gruntfile.js', 'index.js', 'lib/*.js', 'test/*.js']
    },
    concat: {
      options: {
        banner: grunt.file.read('./browser/banner.jst'),
        footer: grunt.file.read('./browser/footer.jst'),
        process: function(src) {
          var noModules = src.replace('= module.exports =', '=')
          return noModules.replace(/var .+? = require\(.+?\);/g, '');
        }
      },
      dist: {
        src: [
          './lib/state.js',
          './lib/promise.js',
          './lib/future.js',
          './lib/collections.js'
        ],
        dest: './browser/concurrent.js'
      }
    },
    shell: {
      docs: {
        command: 'docker -i lib -o doc'
      }
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
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-gh-pages');
};