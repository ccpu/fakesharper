import * as vscode from "vscode";

class Config {
	public static getConfiguration(): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration("fakesharper");
	}
	public static get cleanupOnSave(): boolean {
		return this.getConfiguration().get<boolean>("cleanupOnSave")!;
	}
	public static get inspectcodeOnSave(): boolean {
		return this.getConfiguration().get<boolean>("inspectcodeOnSave")!;
	}
}

export { Config };
