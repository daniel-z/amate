module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: 35729,
      },
      scripts: {
        files: 'scripts/**/*.js',
        tasks: ['jshint'],
        options: {
          interrupt: true,
          reload: true
        },
      },
      less: {
        files: 'styles/less/**/*.less',
        tasks: ['less'],
        options: {
          livereload: true,
        }
      },
      html: {
        files: '**/*.html',
        tasks: [],
        options: {
          livereload: true,
        }
      }
    },

    connect: {
      options: {
        port: 8000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: ['./']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['scripts/**/*.js']
    },

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
          reload: true
        },
        files: {
          "styles/css/styles.css": "styles/less/**/*.less"
        }
      }
    }
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('ds', [
    'jshint',
    'less',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [
    'ds'
  ]);

};