// tasks:
// docs
// rmw
// sync

const gulp  = require('gulp')
const syncy = require('syncy');
const fs    = require('fs')
const path  = require('path')

const docOutput  = '../quxios.github.io/data'
const syncOutput = '../QMV-Master-Demo'
const rmwOutput  = './'
const pluginsPath = 'js/plugins/'
const repo = 'https://github.com/quxios/QMV-Master-Demo/tree/master/js/plugins'
const site = 'https://quxios.github.io/#/plugins/'

const ignore = ['QBase.js']
const pluginFiles  = fs.readdirSync(pluginsPath).filter((name) => {
  return ignore.indexOf(name) === -1
})

// default sorting
const selectedPlugins = [
  'QPlus.js',
  'QSprite.js',
  'QAudio.js',
  'QCamera.js',
  'QInput.js',
  'QInputRemap.js',
  'QNameInput.js',
  'QSpeed.js'
]

class Plugin {
  static get(pluginName) {
    const file   = fs.readFileSync(pluginsPath + pluginName, 'utf8')
    const header = this.getHeader(file)
    let plugin   = {
      name: pluginName.replace('.js', ''),
      version:  this.getVersion(header),
      download: this.getParam('download', header),
      requires: this.getParam('requires', header),
      video: this.getParam('video', header),
      tags: this.getParam('tags', header),
      about: '', // first section of help
      help: ''
    }
    const help = this.getHelp(header)
    if (help) {
      plugin.about = help.shift()
      plugin.help  = help.join('\n')
    }
    if (!plugin.download) {
      plugin.download = `${repo}/${pluginName}`
    }
    return plugin;
  }
  static getHeader(file) {
    let match = /\/\*\:([\s\S]*?)\*\//i.exec(file)
    if (match) {
      return match[1]
    }
    return ''
  }
  static getVersion(header) {
    let match = /Version (\d+.\d+.\d+)/i.exec(header)
    if (match) {
      return match[1]
    }
    return null
  }
  static getParam(param, header) {
    const regex = new RegExp(`@${param}(.*)`, 'i')
    const match = regex.exec(header)
    if (match) {
      return match[1]
    }
    return ''
  }
  static getHelp(header) {
    let help = /@help([\s\S]*?)(\@|\*\/)/.exec(header)
    if (help) {
      help = help[1].replace(/^ \*( |)/gm, '')
      help = help.replace(/\-{70,90}/g, '')
      help = help.replace(/\={70,90}(\n|\n\r|\r|\r\n)\#\#/g, '--SECTION--\n##')
      help = help.replace(/\={70,90}/g, '')
      let sections = help.split('--SECTION--')
      return sections.filter((s) => {
        return s.includes('##')
      })
    }
    return null
  }
}

gulp.task('docs', function() {
  let plugins = []
  let tags = {}
  selectedPlugins.forEach((pluginName) => {
    if (/^Q/.test(pluginName)) {
      const plugin = Plugin.get(pluginName);
      if (plugin.tags) {
        var newTags = plugin.tags.split(',').map((s) => { return s.trim() })
        newTags.forEach((tag) => {
          if (tags[tag]) {
            tags[tag]++
          } else {
            tags[tag] = 1
          }
        })
      }
      plugins.push(plugin)
    }
  })
  fs.writeFileSync(path.join(docOutput, 'plugins.json'), JSON.stringify(plugins, null, 2))
  fs.writeFileSync(path.join(docOutput, 'tags.json'), JSON.stringify(tags))
  console.log('Exported to: ', path.join(__dirname, docOutput))
});

gulp.task('rmw', function() {
  let text = ''
  selectedPlugins.forEach((pluginName) => {
    if (/^Q/.test(pluginName)) {
      const plugin = Plugin.get(pluginName);
      plugin.about = plugin.about.replace(/## About/g, '')
      plugin.about = plugin.about.replace(/\r/g, '\n')
      plugin.about = plugin.about.replace(/(\n)+/g, '\n')
      plugin.about = plugin.about.replace(/(\n)/g, ' ')
      const link = site + plugin.name
      text += `<b><a href='${link}'>${plugin.name}</a> - v${plugin.version}</b><br>\n`
      text += `Download - <a href='${plugin.download}'>${plugin.download}</a><br>\n`
      text += `${plugin.about.trim()}<br><br>\n\n`
    }
  })
  fs.writeFileSync(path.join(rmwOutput, 'rmw.html'), text)
  console.log('Exported to: ', path.join(__dirname, rmwOutput))
});

gulp.task('sync', function() {
  const glob = [
    'data/**',
    'js/plugins/!(QBase.js|*dev.js)'
  ]
  syncy(glob, syncOutput, { updateAndDelete: false })
    .then(() => {
      console.log('Done!')
    })
    .catch(console.error);
})
