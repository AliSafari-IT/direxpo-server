import type { ExportOptions } from "@asafarim/md-exporter";

export interface DirexpoRunOptions extends ExportOptions {
  includeTree?: boolean;
  treeOnly?: boolean;
  filePaths?: string[];
}

export interface DirexpoServerOptions {
  outputDir?: string;
}
