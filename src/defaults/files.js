const { homedir } = require('os')
const { join } = require('path')

export default {
  directories: {
    wexond: join(homedir(), '.wexond'),
    userData: join(homedir(), '.wexond', 'userData'),
    extensions: join(homedir(), '.wexond', 'userData', 'extensions')
  },
  files: {
    history: join(homedir(), '.wexond', 'userData', 'history.json'),
    sites: join(homedir(), '.wexond', 'userData', 'sites.json'),
    bookmarks: join(homedir(), '.wexond', 'userData', 'bookmarks.json'),
    favicons: join(homedir(), '.wexond', 'userData', 'favicons.json')
  }
}