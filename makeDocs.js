// cli: node makeDocs.js

const fs   = require('fs')
const path = require('path')

const output = '../quxios.github.io/data'
const pluginsPath   = 'js/plugins/'

const ignore = ['QBase.js']
const files  = fs.readdirSync(pluginsPath).filter((name) => {
  return ignore.indexOf(name) === -1
})

let plugins = []
let tags = {}

const docs = class {
  static save() {
    fs.writeFileSync(path.join(output, 'plugins.json'), JSON.stringify(plugins, null, 2))
    fs.writeFileSync(path.join(output, 'tags.json'), JSON.stringify(tags))
    console.log('Complete');
    console.log(`Exported to: ${path.join(__dirname, output)}`);
  }
  static start() {
    console.log('Starting..');
    files.forEach((pluginName) => {
      if (/^Q/.test(pluginName)) {
        const file   = fs.readFileSync(pluginsPath + pluginName, 'utf8')
        const header = this.getHeader(file)
        let plugin   = {
          name: pluginName.replace('.js', ''),
          version:  this.getVersion(header),
          download: this.getParam('download', header),
          requires: this.getParam('requires', header),
          tags: this.getParam('tags', header),
          about: '', // first section of help
          help: ''
        }
        const help = this.getHelp(header)
        if (help) {
          plugin.about = help.shift()
          plugin.help  = help.join('\n')
        }
        this.addTags(plugin.tags)
        plugins.push(plugin)
      }
    })
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
  static addTags(newTags) {
    if (!newTags) return
    newTags = newTags.split(',').map((s) => { return s.trim() })
    newTags.forEach((tag) => {
      if (tags[tag]) {
        tags[tag]++
      } else {
        tags[tag] = 1
      }
    })
  }
}

docs.start()
docs.save()
