import * as path from "path";
import * as fs from "fs";

export const findFileByExtensionRecursively = (
	base: string,
	extension: string
): string | undefined => {
	const files = fs.readdirSync(base);

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const newbase = path.join(base, file);

		if (
			!fs.statSync(newbase).isDirectory() &&
			file.slice(-1 * (extension.length + 1)) === `.${extension}`
		) {
			return newbase;
		}
	}

	const dirUp = path.resolve(base, "..");

	const { root } = path.parse(dirUp);

	if (root !== dirUp) {
		return findFileByExtensionRecursively(dirUp, extension);
	}
};
