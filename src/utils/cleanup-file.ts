import { findProjectFile } from "./find-project-file";
import * as path from "path";
import { CleanupCodeExecutor } from "../modules/cleancode/executor";
import * as vscode from "vscode";

export const cleanupFile = (file: string, output: vscode.OutputChannel, statusBarItem: vscode.StatusBarItem) => {
	const projectFile = findProjectFile(file);

	if (!projectFile) {
		return;
	}

	const cleanCode = new CleanupCodeExecutor(output, statusBarItem);
	const fileRelative = path.relative(path.dirname(projectFile), file);
	cleanCode.showStatusBarItem();
	cleanCode.executeCleanupCode(projectFile, [`--include="${fileRelative}"`]);
};
