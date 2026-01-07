import express, { type Router } from "express";
import { runExport } from "@asafarim/md-exporter";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, resolve } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import type { DirexpoRunOptions, DirexpoServerOptions } from "./types.js";
import { discoverFiles, generateTreeSection } from "@asafarim/direxpo-core";

const execAsync = promisify(exec);

type DirexpoRouterResult = {
  router: Router;
  outputDir: string;
};

interface NormalizedOptions {
  targetPath: string;
  filter?: "all" | "tsx" | "css" | "md" | "json" | "glob";
  pattern?: string;
  exclude?: string[];
  maxSize?: number;
}

function normalizeOptions(input: any): NormalizedOptions {
  const normalized: NormalizedOptions = {
    targetPath: input.targetPath,
  };

  if (input.filter) {
    normalized.filter = input.filter;
  }

  if (input.pattern && typeof input.pattern === "string" && input.pattern.trim()) {
    normalized.pattern = input.pattern.trim();
    if (!input.filter) {
      normalized.filter = "glob";
    }
  }

  if (input.exclude) {
    let excludeArray: string[] = [];
    if (typeof input.exclude === "string") {
      excludeArray = input.exclude
        .split(/[,\n]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    } else if (Array.isArray(input.exclude)) {
      excludeArray = input.exclude
        .map((s: any) => (typeof s === "string" ? s.trim() : ""))
        .filter((s: string) => s.length > 0);
    }
    if (excludeArray.length > 0) {
      normalized.exclude = excludeArray;
    }
  }

  let maxSizeBytes = 0;
  if (input.maxSizeMb !== undefined && typeof input.maxSizeMb === "number") {
    maxSizeBytes = input.maxSizeMb;
  } else if (input.maxSize !== undefined && typeof input.maxSize === "number") {
    maxSizeBytes = input.maxSize / (1024 * 1024);
  }

  if (maxSizeBytes > 0 && isFinite(maxSizeBytes)) {
    normalized.maxSize = maxSizeBytes;
  }

  return normalized;
}

export function createDirexpoRouter(
  opts: DirexpoServerOptions = {},
): DirexpoRouterResult {
  const router = express.Router();

  const OUTPUT_DIR = resolve(opts.outputDir ?? join(process.cwd(), ".output"));

  mkdir(OUTPUT_DIR, { recursive: true }).catch(() => {
    // ignore
  });

  router.post("/run", async (req, res) => {
    try {
      const { options } = req.body as { options: DirexpoRunOptions };
      const { includeTree, treeOnly, filePaths, ...baseOptions } = options;

      // Tree-only: produce markdown that contains only the tree
      if (treeOnly) {
        const normalizedOpts = normalizeOptions(baseOptions);
        const paths =
          filePaths && filePaths.length
            ? filePaths
            : await discoverFiles(normalizedOpts);

        const treeSection = generateTreeSection(paths, baseOptions.targetPath);

        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "")
          .slice(0, -5);

        const filename = `tree_${timestamp}.md`;
        const outputPath = join(OUTPUT_DIR, filename);

        await writeFile(outputPath, treeSection, "utf-8");

        res.json({
          outputPath,
          report: {
            included: paths.length,
            bytesWritten: treeSection.length,
            treeOnly: true,
          },
        });
        return;
      }

      // Normal export
      const normalizedOpts = normalizeOptions(baseOptions);
      const result = await runExport({
        ...(normalizedOpts as any),
        outDir: OUTPUT_DIR,
      });

      // Prepend tree if requested
      if (includeTree && result.outputMarkdownPath) {
        const paths =
          filePaths && filePaths.length
            ? filePaths
            : await discoverFiles(normalizedOpts);

        if (paths.length) {
          try {
            const markdownContent = await readFile(result.outputMarkdownPath, "utf-8");
            const treeSection = generateTreeSection(paths, baseOptions.targetPath);
            if (treeSection) {
              await writeFile(
                result.outputMarkdownPath,
                treeSection + "\n" + markdownContent,
                "utf-8",
              );
            }
          } catch {
            // ignore tree failure
          }
        }
      }

      res.json({
        outputPath: result.outputMarkdownPath,
        report: result.report,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  router.post("/discover", async (req, res) => {
    try {
      const { options } = req.body as { options: any };
      const normalizedOpts = normalizeOptions(options);
      const files = await discoverFiles(normalizedOpts);
      res.json({ files });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  router.get("/download/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const filepath = join(OUTPUT_DIR, filename);
      const content = await readFile(filepath, "utf-8");
      res.setHeader("Content-Type", "text/markdown");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(content);
    } catch {
      res.status(404).json({ error: "File not found" });
    }
  });

  router.post("/open-file", async (req, res) => {
    try {
      const { filename } = req.body as { filename: string };
      const filepath = join(OUTPUT_DIR, filename);

      await readFile(filepath, "utf-8");

      const isWindows = process.platform === "win32";
      const isMac = process.platform === "darwin";
      const isLinux = process.platform === "linux";

      let command: string;
      if (isWindows) command = `start "" "${filepath}"`;
      else if (isMac) command = `open "${filepath}"`;
      else if (isLinux) command = `xdg-open "${filepath}"`;
      else throw new Error("Unsupported operating system");

      await execAsync(command);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to open file",
      });
    }
  });

  return { router, outputDir: OUTPUT_DIR };
}
