const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 340, height: 700});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (files) {
        if (files) event.sender.send('selected-directory', files)
    })
});
ipc.on('createFile',(e,json)=>{
    dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'select project path'
    }, function (files) {
        if(!files) return;
        let path = files[0].replace(/\//g,'/');
        try {
            fs.mkdirSync(path + '/src');
        } catch (e){
            console.log('src already exist')
        }
        try {
            fs.mkdirSync(path + '/src/libs');
        } catch (e){
            console.log('libs already exist')
        }
        try {
            fs.mkdirSync(path + '/src/template');
        } catch (e){
            console.log('template already exist')
        }
        try {
            fs.mkdirSync(path + '/src/views');
        } catch (e){
            console.log('views already exist')
        }
        try {
            fs.mkdirSync(path + '/src/config');
        } catch (e){
            console.log('config already exist')
        }
        let promise = null;
        if(json.platform==='desktop'){
            fs.readFile('file/main/desktop.js',(err,file)=>{
                let temp = '';
               if(json.router==='smart'){
                   temp = file.toString().replace('{mode}','env==="production"?"hash":"history"')
               } else if (json.router ==='history') {
                   temp = file.toString().replace('{mode}','"history"')
               } else {
                   temp = file.toString().replace('{mode}','"hash"')
               }
                fs.writeFile(path + '/src/main.js', temp, (err)=>{
                    if(err){
                        e.sender.send('makeProcess',{state: 'error',message:'occur error while making package.json'})
                    } else {
                        e.sender.send('makeProcess',{state: 'success',message:'package.json done'})
                    }
                });
            });
            promise = new Promise((resolve, reject)=>{
                fs.readFile('file/packageJSON/desktop.json', (err,file)=>{
                    if(err){
                        reject()
                    } else {
                        resolve(file)
                    }
                })
            })
        } else {
            fs.readFile('file/main/mobile.js',(err,file)=>{
                let temp = '';
                if(json.router==='smart'){
                    temp = file.toString().replace('{mode}','env==="production"?"hash":"history"')
                } else if (json.router ==='history') {
                    temp = file.toString().replace('{mode}','"history"')
                } else {
                    temp = file.toString().replace('{mode}','"hash"')
                }
                fs.writeFile(path + '/src/main.js', temp, (err)=>{
                    if(err){
                        e.sender.send('makeProcess',{state: 'error',message:'occur error while making package.json'})
                    } else {
                        e.sender.send('makeProcess',{state: 'success',message:'package.json done'})
                    }
                });
            });
            promise = new Promise((resolve, reject)=>{
                fs.readFile('file/packageJSON/mobile.json', (err,file)=>{
                    if(err){
                        reject()
                    } else {
                        resolve(file)
                    }
                })
            })
        }
        promise.then(file=>{
            let temp = file.toString();
            temp = temp.replace('{name}',json.projectName);
            temp = temp.replace('{description}',json.description);
            temp = temp.replace('{author}', json.author);
            if(json.open === 'yes'){
                temp = temp.replace('{license}', json.license);
                temp = temp.replace('{private}','false');
            } else {
                temp = temp.replace('{license}', '""');
                temp = temp.replace('{private}','true');
            }
            fs.writeFile(path + '/package.json', temp, (err)=>{
                if(err){
                    e.sender.send('makeProcess',{state: 'error',message:'occur error while making package.json'})
                } else {
                    e.sender.send('makeProcess',{state: 'success',message:'package.json done'})
                }
            });
        });
        fs.readFile('file/config/webpack.base.config.js', (err, file)=>{
            if(err){
                e.sender.send('makeProcess',{state: 'error', message: 'occur error while making base config'})
            } else {
                let temp = file.toString();
                fs.writeFile(path + '/webpack.base.config.js',temp,err=>{
                    if(err){
                        e.sender.send('makeProcess',{state: 'error',message:'occur error while making base config'})
                    } else {
                        e.sender.send('makeProcess',{state: 'success',message:'base config done'})
                    }
                });
            }
        });
        fs.readFile('file/config/webpack.dev.config.js', (err, file)=>{
            if(err){
                e.sender.send('makeProcess',{state: 'error', message: 'occur error while making dev config'})
            } else {
                let temp = file.toString();
                if (json.context.length>0){
                    let proxy = `
    devServer: {
        proxy: {
            '${json.context}':{
                target: '${json.target}',
                pathRewrite: {
                    '${json.regex}' : '${handledPath}'
                }
            }
        },
        progress: true,
    },`;
                    temp = temp.replace('{proxy}',proxy)
                } else {
                    temp = temp.replace('{proxy}','')
                }
                fs.writeFile(path + '/webpack.dev.config.js', temp, err=>{
                    if(err){
                        e.sender.send('makeProcess',{state: 'error',message:'occur error while making dev config'})
                    } else {
                        e.sender.send('makeProcess',{state: 'success',message:'dev config done'})
                    }
                })
            }
        });
        fs.readFile('file/config/webpack.prod.config.js', (err, file)=>{
            if(err){
                e.sender.send('makeProcess',{state: 'error', message: 'occur error while making prod config'})
            } else {
                let output = json.path.replace(/\\/g,'/');
                let temp = file.toString();
                temp = temp.replace('{path}',output);
                temp = temp.replace('{publicPath}',json.publicPath.replace(/\\/g,'/'));
                temp = temp.replace('{HTMLPath}',json.HTMLPath.replace(/\\/g,'/'));
                temp = temp.replace('{HTMLName}',json.HTMLName);
                if(json.hash==='no'){
                    temp = temp.replace(/\[hash]/g,'');
                }
                fs.writeFile(path + '/webpack.prod.config.js', temp, err=>{
                    if(err){
                        e.sender.send('makeProcess',{state: 'error',message:'occur error while making prod config'})
                    } else {
                        e.sender.send('makeProcess',{state: 'success',message:'prod config done'})
                    }
                })
            }
        });
        fs.readFile('file/other/util.js',(err,file)=>{
            if(file){
                let temp = file.toString();
                if (json.context.length>0) {
                    temp = temp.toString().replace('{baseUrl}','development' ?json.context : json.target)
                } else {
                    temp = temp.toString().replace('{baseUrl}','/')
                }
                fs.writeFile(path + '/src/libs/util.js',temp, err=>{
                    if(err){
                        e.sender.send('makeProcess',{state: 'error',message:'occur error while making util'})
                    } else {
                        e.sender.send('makeProcess',{state: 'success',message:'util done'})
                    }
                });
            }
        });
        const others = [
            {
                source: 'file/other/config.js',
                target: '/src/config/config.js',
            },
            {
                source: 'file/other/index.ejs',
                target: '/src/template/index.ejs'
            },
            {
                source: 'file/other/index.vue',
                target: '/src/views/index.vue'
            },
            {
                source: 'file/other/app.vue',
                target: '/src/app.vue'
            },
            {
                source: 'file/other/router.js',
                target: '/src/router.js'
            },
            {
                source: 'file/other/vendors.js',
                target: '/src/vendors.js'
            },
            {
                source: 'file/other/.babelrc',
                target: '/.babelrc'
            },
            {
                source: 'file/other/.editorconfig',
                target: '/.editorconfig'
            },
            {
                source: 'file/other/.eslintignore',
                target: '/.eslintignore'
            },
            {
                source: 'file/other/.eslintrc.json',
                target: '/.eslintrc.json'
            },
            {
                source: 'file/other/.gitignore',
                target: '/.gitignore'
            },
            {
                source: 'file/other/index.html',
                target: '/index.html'
            }
        ];
        others.forEach(t=>{
            fs.readFile(t.source, (err,file)=>{
                if( file) {
                    fs.writeFile(path + t.target,file,err=>{
                        const fileName = t.target.split('/')[t.target.split('/').length - 1];
                        if(err){
                            e.sender.send('makeProcess',{state: 'error',message:`occur error while making ${fileName}`})
                        } else {
                            e.sender.send('makeProcess',{state: 'success',message:fileName + 'done'})
                        }
                    })
                }
            })
        })
    });
});