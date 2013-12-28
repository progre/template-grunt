module.exports = function(grunt) {
  var tsdExec = 'node node_modules/tsd/build/cli.js ';
  var jadeFiles = grunt.file.expandMapping(
    ['src/public/**/*.jade'], 'public/', {
      rename: function(destBase, destPath) {
        return destBase + destPath.replace(/^src\/public\//, '').replace(/\.jade$/, ".html");
      }
    }
  );
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      'tsd-install': {
        cmd: function(name) {
          return tsdExec + 'query ' + name + ' -r -o -s -a install';
        }
      },
      'tsd-reinstall': {
        cmd: tsdExec + 'reinstall'
      },
      'tsd-reinstall-overwrite': {
        cmd: tsdExec + 'reinstall -o'
      }
    },
    jade: {
      release: {
        files: jadeFiles
      },
      debug: {
        files: jadeFiles,
        options: {
          data: {
            debug: true
          }
        }
      }
    },
    stylus: {
      compile: {
        options: {
          urlfunc: 'embedurl'
        },
        files: {
          'public/css/style.css': 'src/public/css/style.styl'
        }
      }
    },
    typescript: {
      base: {
        src: ['src/public/**/*.ts'],
        dest: './',
        options: {
          module: 'amd',
          base_path: 'src',
          sourcemap: true
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          name: 'main',
          baseUrl: 'public/javascript',
          mainConfigFile: 'public/javascript/config.js',
          out: 'public/js/main.js'
        }
      }
    },
    connect: {
      server: {
        options: {
          base: 'public'
        }
      },
      keepalive: {
        options: {
          base: 'public',
          keepalive: true
        }
      }
    },
    watch: {
      jade: {
        files: ['src/public/**/*.jade'],
        tasks: ['jade:debug']
      },
      stylus: {
        files: ['src/public/**/*.styl'],
        tasks: ['stylus'],
      },
      typescript: {
        files: ['src/public/**/*.ts'],
        tasks: ['typescript']
      },
      public: {
        files: ['public/**/*.*'],
        options: {
          livereload: true
        }
      }
    },
    copy: {
      deploy: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: [
            '**',
            '!**/*.map', '!javascript/**'
          ],
          dest: 'dist/',
          filter: 'isFile'
        }]
      }
    }
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', [
    'debug-build',
    'serve'
  ]);
  grunt.registerTask('serve', [
    'connect:server',
    'watch'
  ]);
  grunt.registerTask('release-serve', [
    'release-build',
    'connect:keepalive',
  ]);
  grunt.registerTask('deploy', [
    'release-build',
    'copy'
  ]);
  grunt.registerTask('tsd-reinstall-o', [
    'exec:tsd-reinstall-overwrite'
  ]);
  grunt.registerTask('debug-build', [
    'jade:debug',
    'stylus',
    'exec:tsd-reinstall',
    'typescript'
  ]);
  grunt.registerTask('release-build', [
    'jade:release',
    'stylus',
    'typescript',
    'exec:tsd-reinstall',
    'requirejs'
  ]);
};