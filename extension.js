const vscode = require('vscode'); //必ず必要

class vsclauncherView {
    //dataで階層を定義
    data() {
        return [{
            title: '文字列の挿入',
            icon: {
                dark: __filename + '../../media/case-sensitive.svg',
                light: __filename + '../../media/case-sensitive.svg',
            },
            children: [{
                title: 'あいうえお',
                command: 'vsclauncherView.insertTxs',
            }, {
                title: 'かきくけこ',
                command: 'vsclauncherView.insertIms',
            }]
        }, {
            title: '親',
            icon: {
                dark: __filename + '../../media/vm.svg',
                light: __filename + '../../media/vm.svg',
            },
            children: [{
                title: '子',
                children: [{
                    title: '孫',
                    command: 'vsclauncherView.showMessage'
                }]
            }]
        }];
    }

    constructor() {

    }
    //dataを元にツリー用に組み直す
    generateTree(data) {
        let self = this;
        let tree = data;
        Object.keys(tree).forEach(function (i) {
            tree[i] = new TreeItem(tree[i]);
            if (tree[i].children !== undefined) {
                self.generateTree(tree[i].children);
            }
        });
        return tree;
    }
    getTreeItem(element) {
        return element;
    }
    //ツリーを生成
    getChildren(element) {
        if (element === undefined) {
            return this.generateTree(this.data());
        }
        return element.children;

    }

    //--ツリーをクリックして実行される処理の定義
    insertTxs() {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(function (editBuilder) {
                editBuilder.insert(editor.selection.active, 'あいえうお');
            });
        }
    }
    insertIms() {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(function (editBuilder) {
                editBuilder.insert(editor.selection.active, 'かきくけこ');
            });
        }
    }
    showMessage() {
        vscode.window.showInformationMessage('孫です');
    }

}

//ツリー各要素を生成するクラス
class TreeItem extends vscode.TreeItem {
    constructor(data) {
        super(data.title, data.children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded);
        this.label = data.title;
        this.command = {
            title: data.title,
            command: data.command,
        };
        this.iconPath = data.icon;
        this.children = data.children;
    }
}

function activate() {
    //ツリーペインを生成する
    const vscl = new vsclauncherView();
    vscode.window.registerTreeDataProvider('vsclauncherView', vscl);

    //コマンドの定義
    vscode.commands.registerCommand('vsclauncherView.insertTxs', vscl.insertTxs);
    vscode.commands.registerCommand('vsclauncherView.insertIms', vscl.insertIms);
    vscode.commands.registerCommand('vsclauncherView.showMessage', vscl.showMessage);
}

//お約束
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;