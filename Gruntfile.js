module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt); // Load all grunt-* packages from package.json
  require('time-grunt')(grunt);       // Display the elapsed execution time of grunt tasks

  grunt.initConfig({

    less: {
      style: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2,
          sourceMap: true,
          sourceMapFilename: "build/css/style.css.map",
          sourceMapURL: 'style.css.map',
          sourceMapRootpath: '../../',
        },
        files: {
          'build/css/style.css': ['src/less/style.less']
        }
      }
    },


    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9'],
        map: true,
      },
      style: {
        src: 'build/css/style.css'
      }
    },


    cmq: {
      style: {
        files: {
          'build/css/style.min.css': ['build/css/style.min.css']
        }
      }
    },


    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'build/css/style.min.css': ['build/css/style.min.css']
        }
      }
    },


    concat: {
      start: {
        src: [
          // 'src/js/plugin.js',
          'src/js/script.js'
        ],
        dest: 'build/js/script.min.js'
      }
    },


    uglify: {
      start: {
        files: {
          'build/js/script.min.js': ['build/js/script.min.js']
        }
      }
    },


    sprite: {
      sprite_large: {
        src: 'src/img/sprite-2x/*.png',
        dest: 'build/img/sprite-2x.png',
        padding: 8,
        imgPath: '../img/sprite-2x.png',
        destCss: 'src/less/components/sprite-2x.less',
        'cssVarMap': function (sprite) {
          sprite.name = sprite.name + '-2x';
        },
      },
      sprite: {
        src: 'src/img/sprite/*.png',
        dest: 'build/img/sprite-1x.png',
        padding: 4,
        imgPath: '../img/sprite-1x.png',
        destCss: 'src/less/components/sprite-1x.less',
      }
    },


    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['build/img/*.{png,jpg,gif,svg}']
        }]
      }
    },

    less_colors: {
      start: {
        options: {
          funcName: 'cless'
        },
        files: {
          'src/less/variables.less': ['src/less/variables.less']
        }
      }
    },


    // потребует в package.json:  "grunt-replace": "^0.8.0",
    // replace: {
    //   dist: {
    //     options: {
    //       patterns: [
    //         {
    //           match: /<script src=\"js\/plugins.js/g,
    //           replacement: '<script src="js/plugins.min.js'
    //         },
    //         {
    //           match: /<script src=\"js\/script.js/g,
    //           replacement: '<script src="js/script.min.js'
    //         }
    //       ]
    //     },
    //     files: [
    //       {
    //         expand: true,
    //         src: ['src/*.html']
    //       }
    //     ]
    //   }
    // },


    clean: {
      build: [
        'build/css',
        'build/img',
        'build/js',
        'build/*.html',
      ]
    },


    copy: {
      js_vendors: {
        expand: true,
        cwd: 'src/js/vendors/',
        src: ['**'],
        dest: 'build/js/',
      },
      img: {
        expand: true,
        cwd: 'src/img/',
        src: ['*.{png,jpg,gif,svg}'],
        dest: 'build/img/',
      },
      css_min: {
        src: ['build/css/style.css'],
        dest: 'build/css/style.min.css',
      },
      css_add: {
        expand: true,
        cwd: 'src/less/css/',
        src: ['*.css'],
        dest: 'build/css/',
      }
      // fonts: {
      //   expand: true,
      //   cwd: 'src/font/',
      //   src: ['*.{eot,svg,woff,ttf}'],
      //   dest: 'build/font/',
      // },
    },


    includereplace: {
      html: {
        src: '*.html',
        dest: 'build/',
        expand: true,
        cwd: 'src/'
      }
    },


    watch: {
      style: {
        files: ['src/less/**/*.less'],
        tasks: ['style'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      scripts: {
        files: ['src/js/script.js'],
        tasks: ['js'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      images: {
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['img'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      html: {
        files: ['src/*.html', 'src/_html_inc/*.html'],
        tasks: ['includereplace:html'],
        options: {
          spawn: false,
          livereload: true
        },
      },
    },


    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'build/css/*.css',
            'build/js/*.js',
            'build/img/*.{png,jpg,gif,svg}',
            'build/*.html',
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "build/",
          },
          // startPath: "/index.html",
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
          }
        }
      }
    }

  });


  grunt.registerTask('default', [
    // 'sprite',                 // собираем спрайты в build/img/sprite-1x.png и build/img/sprite-2x.png и записываем для них less-файлы
    'copy:css_add',           // копируем дополнительные CSS-файлы из src/less/css/ в build/css/
    'less_colors:start',      // заменяю в less файле цвета на less функции цветов
    'less',                   // компилируем стили в          build/css/style.css
    'autoprefixer',           // обрабатываем автопрефиксером build/css/style.css
    'copy:css_min',           // создаем                      build/css/style.min.css
    'cmq',                    // объединяем медиа-правила в   build/css/style.min.css
    'cssmin',                 // минифицируем                 build/css/style.min.css
    'concat',                 // объединяем все указанные JS-файлы в build/js/script.min.js
    'uglify',                 // минифицируем                        build/js/script.min.js
    'copy:js_vendors',        // копируем всё из src/js/vendors/ в build/js/
    'copy:img',               // копируем всё из src/img/ в build/img/
    // 'copy:fonts',             // копируем всё из src/font/ в build/font/
    'imagemin',               // минифицируем картинки в build/img/
    'includereplace:html',    // собираем HTML-файлы в build/
    'browserSync',            // запускаем плюшки автообновления
    'watch'                   // запускаем слежение за изменениями файлов
  ]);


  grunt.registerTask('build', [
    'clean:build',            // удаляем build/
    // 'sprite',                 // собираем спрайты в build/img/sprite-1x.png и build/img/sprite-2x.png и записываем для них less-файлы
    'copy:css_add',          // копируем дополнительные CSS-файлы из src/less/css/ в build/css/
    'less_colors:start',      // заменяю в less файле цвета на less функции цветов
    'less',                   // компилируем стили в          build/css/style.css
    'autoprefixer',           // обрабатываем автопрефиксером build/css/style.css
    'copy:css_min',           // создаем                      build/css/style.min.css
    'cmq',                    // объединяем медиа-правила в   build/css/style.min.css
    'cssmin',                 // минифицируем                 build/css/style.min.css
    'concat',                 // объединяем все указанные JS-файлы в build/js/script.min.js
    'uglify',                 // минифицируем                        build/js/script.min.js
    'copy:js_vendors',        // копируем всё из src/js/vendors/ в build/js/
    'copy:img',               // копируем всё из src/img/ в build/img/
    // 'copy:fonts',             // копируем всё из src/font/ в build/font/
    'imagemin',               // минифицируем картинки в build/img/
    'includereplace:html',    // собираем HTML-файлы в build/
  ]);


  grunt.registerTask('js', [
    'concat',
    'uglify',
    'copy:js_vendors',
  ]);


  grunt.registerTask('style', [
    'less_colors:start',
    'less',
    'autoprefixer',
    'cmq',
    'cssmin'
  ]);


  grunt.registerTask('img', [
    // 'sprite',
    'copy:img',
    'imagemin',
    'less',
    'autoprefixer',
    'cmq',
    'cssmin'
  ]);

};