var modRewrite = require('connect-modrewrite');

var projectConfig = {
  root: '/'
};

function rewriteMiddleware(connect, options) {
  return [
    modRewrite(['^' + projectConfig.root + '(?!html/).*\\.html$ /index.html [L]']),
    projectConfig.root === '/' ? connect.static(options.base)
      : function(req, res, next) {
        req.url = req.url.replace(new RegExp('^' + projectConfig.root), '/');
        return connect.static(options.base)(req, res, next);
      }
  ];
}

module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      release: {
        options: {
          data: {
            root: projectConfig.root
          }
        }
      },
      debug: {
        options: {
          data: {
            root: projectConfig.root,
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
    tsd: {
      reinstall: {
        options: {
          command: 'reinstall',
          config: 'tsd.json'
        }
      },
      refresh: {
        options: {
          command: 'reinstall',
          config: 'tsd.json',
          latest: true
        }
      }
    },
    typescript: {
      base: {
        src: ['src/public/**/*.ts'],
        dest: 'src/public/',
        options: {
          module: 'amd',
          basePath: 'src/public',
          sourceMap: true
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
          base: 'public',
          middleware: rewriteMiddleware
        }
      },
      keepalive: {
        options: {
          base: 'public',
          middleware: rewriteMiddleware,
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
    },
    clean: {
      dist: ['dist/*'],
      options: {
        force: true
      }
    }
  });

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
    'clean:dist',
    'copy:deploy'
  ]);
  grunt.registerTask('debug-build', [
    'configure-jade',
    'jade:debug',
    'stylus',
    'tsd:refresh',
    'build-typescript'
  ]);
  grunt.registerTask('release-build', [
    'configure-jade',
    'jade:release',
    'stylus',
    'tsd:refresh',
    'build-typescript',
    'requirejs'
  ]);
  grunt.registerTask('build-typescript', [
    'typescript',
    'configure-rename',
    'rename',
    'copy:typescript'
  ]);
  grunt.registerTask('configure-rename', function() {
    var files = grunt.file.expandMapping(
      ['src/public/**/*.js', 'src/public/**/*.js.map'], 'public/', {
        rename: function(destBase, destPath) {
          return destBase + destPath.replace(/^src\/public\//, '');
        }
      }
    );
    grunt.config('rename', toObject(files));
  });
  grunt.registerTask('configure-jade', function() {
    var files = grunt.file.expandMapping(
      ['src/public/**/*.jade'], 'public/', {
        rename: function(destBase, destPath) {
          return destBase + destPath.replace(/^src\/public\//, '').replace(/\.jade$/, ".html");
        }
      }
    );
    grunt.config('jade.release.files', files);
    grunt.config('jade.debug.files', files);
  });
};

function toObject(array) {
  var obj = {};
  array.forEach(function(item, i) {
    obj[i] = item;
  });
  return obj;
}