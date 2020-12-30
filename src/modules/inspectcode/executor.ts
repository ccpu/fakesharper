import { spawn } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import { EXTENSION_NAME, INSPECTION_FILENAME, INSPECTION_COMMAND } from '../../constants';
import { selectSolutionFile, findProjectFile } from '../../utils';
import { loadDiagnostics } from './diagnostics';

export class InspectCodeExecutor {
	constructor(
		private readonly output: vscode.OutputChannel,
		private readonly statusBarItem: vscode.StatusBarItem,
		private readonly diagnosticCollection: vscode.DiagnosticCollection
	) {}

	public showStatusBarItem(): void {
		this.statusBarItem.text = '$(sync~spin) Inspect Code';
		this.statusBarItem.tooltip = 'Inspect Code command is running';
		this.statusBarItem.command = `${EXTENSION_NAME}.showoutput`;
		this.statusBarItem.show();
	}

	public hideStatusBarItem(): void {
		this.statusBarItem.text = EXTENSION_NAME;
		this.statusBarItem.tooltip = undefined;
		this.statusBarItem.command = undefined;
		this.statusBarItem.hide();
	}

	public executeInspectCode(filePath: string, xmlPath: string, options: string[] = []): void {
		this.output.appendLine(`Inspect Code command is running for '${filePath}'...`);

		const cp = spawn(INSPECTION_COMMAND, [filePath, `--output=${xmlPath}`, ...options], { shell: true });

		cp.stdin?.addListener('data', (message) => this.output.append(message.toString()));
		cp.stdout?.addListener('data', (message) => this.output.append(message.toString()));
		cp.stderr?.addListener('data', (message) => this.output.append(message.toString()));

		cp.on('exit', (code) => {
			if (code !== 0) {
				vscode.window.showErrorMessage(`Process did not exit with 0 code. Please check output.`);
				this.statusBarItem.hide();
			} else {
				const dirPath = path.dirname(filePath);

				this.diagnosticCollection.clear();
				loadDiagnostics(dirPath, this.diagnosticCollection);

				this.hideStatusBarItem();
				this.output.appendLine('Fnished Inspect Code command.');
			}
		});
	}

	public run(file?: string) {
		if (file) {
			const projFile = findProjectFile(file);
			if (projFile) {
				this.showStatusBarItem();
				const xmlPath = path.join(path.dirname(projFile), INSPECTION_FILENAME);
				this.executeInspectCode(projFile, xmlPath);
			}
		} else {
			selectSolutionFile((filePath) => {
				if (!filePath) {
					vscode.window.showWarningMessage(`Not found any '*.sln' file.`);
					return;
				}

				const xmlPath = path.join(path.dirname(filePath), INSPECTION_FILENAME);

				this.showStatusBarItem();
				this.executeInspectCode(filePath, xmlPath);
			});
		}
	}
}
