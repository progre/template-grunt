module.exports = function(grunt) {
  var tsdExec = 'node node_modules/tsd/build/cli.js ';
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
      release: {},
      debug: {
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
        dest: 'src/public/',
        options: {
          module: 'amd',
          base_path: 'src/public',
          sourcemap: true
        }
      }
    },
    copy: {
      typescript: {
        files: [{
          expand: true,
          cwd: 'src/public/',
          src: ['**/*.ts'],
          dest: 'public/',
          filter: 'isFile'
        }]
      },
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
        tasks: ['configure-jade', 'jade:debug']
      },
      stylus: {
        files: ['src/public/**/*.styl'],
        tasks: ['stylus'],
      },
      typescript: {
        files: ['src/public/**/*.ts'],
        tasks: ['build-typescript']
      },
      public: {
        files: ['public/**/*.*'],
        options: {
          livereload: true
        }
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
    'copy:deploy'
  ]);
  grunt.registerTask('tsd-reinstall-o', [
    'exec:tsd-reinstall-overwrite'
  ]);
  grunt.registerTask('debug-build', [
    'configure-jade',
    'jade:debug',
    'stylus',
    'exec:tsd-reinstall',
    'build-typescript'
  ]);
  grunt.registerTask('release-build', [
    'configure-jade',
    'jade:release',
    'stylus',
    'build-typescript',
    'exec:tsd-reinstall',
    'requirejs'
  ]);
  grunt.registerTask('build-typescript', [
    'typescript',
    'configure-rename',
    'rename',
    'copy:typescript'
  ]);
  grunt.registerTask('configure-rename', function() {
    grunt.config('rename', toObject(grunt.file.expandMapping(
      ['src/public/**/*.js', 'src/public/**/*.js.map'], 'public/', {
        rename: function(destBase, destPath) {
          return destBase + destPath.replace(/^src\/public\//, '');
        }
      }
    )));
  });
  grunt.registerTask('configure-jade', function() {
    var jadeFiles = grunt.file.expandMapping(
      ['src/public/**/*.jade'], 'public/', {
        rename: function(destBase, destPath) {
          return destBase + destPath.replace(/^src\/public\//, '').replace(/\.jade$/, ".html");
        }
      }
    );
    grunt.config('jade.release.files', jadeFiles);
    grunt.config('jade.debug.files', jadeFiles);
  });
};

function toObject(array) {
  var obj = {};
  array.forEach(function(item, i) {
    obj[i] = item;
  });
  return obj;
}