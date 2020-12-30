import { findProjectFile } from "./find-project-file";
import * as path from "path";
import { InspectCodeExecutor } from "../modules/inspectcode/executor";
import * as vscode from "vscode";
import { INSPECTION_FILENAME } from "../constants";

export const inspectFile = (
	file: string,
	output: vscode.OutputChannel,
	statusBarItem: vscode.StatusBarItem,
	diagnosticCollection: vscode.DiagnosticCollection
) => {
	const projectFile = findProjectFile(file);

	if (!projectFile) {
		return;
	}
	const xmlPath = path.join(path.dirname(projectFile), INSPECTION_FILENAME);
	const cleanCode = new InspectCodeExecutor(output, statusBarItem, diagnosticCollection);
	const fileRelative = path.relative(path.dirname(projectFile), file);
	cleanCode.showStatusBarItem();
	cleanCode.executeInspectCode(projectFile, xmlPath, [`--include="${fileRelative}"`]);
};
