export const isProjectFile = (file?: string) => {
	if (!file) {
		return false;
	}

	if (file.endsWith(".csproj")) {
		return true;
	}
	if (file.endsWith(".fsproj")) {
		return true;
	}
	if (file.endsWith(".sln")) {
		return true;
	}
	return false;
};
