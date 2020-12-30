import { workspace } from "vscode";
import { cleanupFile, inspectFile } from "../utils";
import { Config } from "../config";
import * as vscode from "vscode";

export const handleEvents = (output: vscode.OutputChannel, diagnosticCollection: vscode.DiagnosticCollection) => {
	workspace.onDidSaveTextDocument((file) => {
		if (Config.cleanupOnSave) {
			const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			cleanupFile(file.fileName, output, statusBarItem);
		}
		if (Config.inspectcodeOnSave) {
			const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			inspectFile(file.fileName, output, statusBarItem, diagnosticCollection);
		}
	});
};
