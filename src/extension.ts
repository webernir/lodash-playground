'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from 'lodash';
import { Range } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "lodash-playground" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.lodash', async () => {
        // The code you place here will be executed every time your command is executed

        const editor = vscode.window.activeTextEditor
        if (!editor)
            return

        if (editor.document.fileName.endsWith('json')) {

            const expression = await vscode.window.showInputBox({ prompt: 'lodash expression: ', value: `_.map(#.items, 'id')` })

            const activeSelection = vscode.window.activeTextEditor.selection
            const range = new Range(activeSelection.start, activeSelection.end)

            let selection: string
            if (range.isEmpty) {
                selection = vscode.window.activeTextEditor.document.getText()
            }
            else{
                selection = vscode.window.activeTextEditor.document.getText(range)
            }
            
            const parsedSelection = JSON.parse(selection)

            const parsedExpression = expression.replace('#', selection)

            vscode.window.showInformationMessage(`expression was ${expression}`  )

            const codeToExecute = `
                                    var _ = require('lodash'); 
                                    console.log('using lodash version: ' + _.VERSION);
                                    const result = ${parsedExpression};
                                    console.log(result);
                                    result;
                                `
            const result = eval(codeToExecute)

            vscode.window.showInformationMessage(JSON.stringify(result))



        }
        else {
            vscode.window.showErrorMessage("NOT A JSON!")
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}