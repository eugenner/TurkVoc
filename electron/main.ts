import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript'
import * as path from "path";
import { Word } from "./Word";

let win: any;
interface SearchCondition {
  where?: any,
  order?: any,
  limit?: number,
  offset?: number
}

const menuTemplate: Electron.MenuItemConstructorOptions[] = [
  {label: app.getName(), 
    submenu: [
      {
        label: 'About',
        click() {
          openAboutWindow()
        }
      }, 
      { type: 'separator' }, 
      {
        label: "Quit",
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        },
    }]
  },
  {
      label: 'View',
      submenu: [
        {
          label: 'Developer Console',
          click: () => {win.webContents.toggleDevTools()}
        }, {role: "copy"}, {role: "paste"}
      ]
  },
  { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }] },
  {
      role: 'help',
      submenu: [{
          label: 'Help',
          click() {
            openHelpWindow()
          }
      }]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(menu);

function createMainWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  win.loadURL(`file://${path.join(__dirname, "/../../dist/TurkVoc/index.html")}`);

  win.on("closed", () => {
    win = null;
  });

}

var aboutWindow: BrowserWindow | null = null;
var helpWindow: BrowserWindow | null = null;

function openAboutWindow() {
  if (aboutWindow) {
    aboutWindow.focus()
    return
  }

  aboutWindow = new BrowserWindow({
    height: 120,
    resizable: true,
    width: 270,
    title: 'About',
    minimizable: false,
    fullscreenable: false
  })

  if (app.isPackaged) {
    aboutWindow.loadURL(`file://${path.join(process.resourcesPath, "/about.html")}`);
  } else {
    aboutWindow.loadURL(`file://${path.join(__dirname, "/../about.html")}`);
  }
  aboutWindow.on('closed', function() {
    aboutWindow = null
  })
}

function openHelpWindow() {
  if (helpWindow) {
    helpWindow.focus()
    return
  }

  helpWindow = new BrowserWindow({
    height: 300,
    resizable: true,
    width: 400,
    title: 'Help',
    minimizable: false,
    fullscreenable: false
  })

  if (app.isPackaged) {
    helpWindow.loadURL(`file://${path.join(process.resourcesPath, "/help.html")}`);
    helpWindow.setTitle('resourcesPath: ' + process.resourcesPath)
  } else {
    helpWindow.loadURL(`file://${path.join(__dirname, "/../help.html")}`);
  }
  helpWindow.on('closed', function() {
    helpWindow = null
  })
}


app.whenReady().then(() => {
  let db_path = '';

  if (app.isPackaged) {
    db_path = path.resolve(process.resourcesPath, "turkvoc.sqlite3");
  } else {
    db_path = path.resolve(__dirname, "../turkvoc.sqlite3");
  }

  new Sequelize('turkvoc', 'username', 'password', {
    dialect: 'sqlite',
    storage: db_path,
    models: [Word],
  });

  createMainWindow();

});

app.on("activate", () => {
  if (win === null) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

async function getTranslation(ref_id: number) {
  let word: any;
  try {

    word = await Word.findOne({
      where: { id: ref_id }
    });

    await win.webContents.send("getTranslationResponse", word);
  } catch (err) {
    await win.webContents.send("getTranslationResponse", 'err: ' + err);
  }
}

async function getWordsList(search: string, isFullSearch: boolean, activeLang: string, offset: number) {
  let langId = activeLang == 'tr' ? 1 : 0;
  let words: Word[];
  let searchLine = '';
  let sc: SearchCondition = {
    order: [['word_tr_ind', 'ASC']],
    limit: 100,
    offset: offset
  };
  if(search.length > 0) {
    if (isFullSearch) {
      searchLine = '%' + search + '%';
      sc['where'] = {[Op.or]: [{word_tr: { [Op.like]: searchLine }}, 
                               {desc_ru: { [Op.like]: searchLine }}]};
    } else {
      searchLine = search + '%';
      sc['where'] = {word_tr: { [Op.like]: searchLine }};
    }
  }

  try {
    words = await Word.findAll<Word>(sc);
    
    const wordsFound = words.map(w => {
      let wz: Word;
      wz = w.get();
      return {'id': wz['id'], 'value': wz['word_tr']};
    });

    await win.webContents.send("getWordsListResponse", wordsFound);
  } catch (err) {
    await win.webContents.send("getWordsListResponse", 'err: ' + err);
  }
}

ipcMain.on("getWordsList", (event, ...args) => {
  getWordsList(args[0], args[1], args[2], args[3]);
});

ipcMain.on("getTranslation", (event, ...args) => {
  getTranslation(args[0]);
});