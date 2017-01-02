// cli: node makeRMW.js

const fs   = require('fs')
const path = require('path')

const output = './'
const pluginsPath = 'js/plugins/'
const repo = 'https://github.com/quxios/Quasi-MV-Master-Demo/tree/master/js/plugins'

const ignore = ['QBase.js', 'QCamera.js']
//const files  = fs.readdirSync(pluginsPath).filter((name) => {
//  return ignore.indexOf(name) === -1
//})

const files = [
  'QPlus.js',
  'QSprite.js',
  'QAudio.js',
  'QInput.js',
  'QInputRemap.js',
  'QNameInput.js'
]

class RMW {
  static save() {
    fs.writeFileSync(path.join(output, 'rmw.txt'), this.text);
    console.log('Complete');
    console.log(`Exported to: ${path.join(__dirname, output)}`);
  }
  static start() {
    console.log('Starting..');
    this.text = '';
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
        const help = this.getHelp(header);
        if (help) {
          plugin.about = help.shift().replace(/(\n|\n\r|\r|\r\n)/g, '').replace('## About', '')
          plugin.help  = help.join('\n')
        }
        if (!plugin.download) {
          plugin.download = `${repo}/${pluginName}`
        }
        this.text += `${plugin.name} - v${plugin.version}\n`;
        this.text += `Download - ${plugin.download}\n`
        this.text += `${plugin.about}\n\n`;
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
}

RMW.start()
RMW.save()
