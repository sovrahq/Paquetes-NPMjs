#!/usr/bin/env node
// bump-quarkid-versions.mjs (v2: walk recursivo en packages/**, ignora node_modules)
// - Bumpea "version" de TODOS los package.json bajo packages/** (carpetas y subcarpetas)
// - Actualiza SOLO deps internas "@quarkid/*" para que coincidan con las nuevas versiones locales
// - --dry: lista carpetas a tocar + cantidad + plan de cambios (sin escribir)
// - --verbose: loguea cada dep interna actualizada al aplicar
import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const PACKAGES_DIR = path.join(ROOT, "packages");
const DRY = process.argv.includes("--dry") || process.argv.includes("-n");
const VERBOSE = process.argv.includes("--verbose");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".hg",
  ".svn",
  "dist",
  "build",
  "out",
  ".next",
  ".turbo",
  ".yarn",
  ".pnpm",
]);

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkPackages(dir) {
  const out = [];
  const stack = [dir];

  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = await fs.readdir(cur, { withFileTypes: true });
    } catch {
      continue;
    }

    // Si esta carpeta tiene package.json, la agrego
    const pj = path.join(cur, "package.json");
    if (await exists(pj)) out.push({ dir: cur, file: pj });

    // Desciendo a subdirectorios (ignorando los de SKIP_DIRS)
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      if (SKIP_DIRS.has(ent.name)) continue;
      // ignora carpetas ocultas tipo .cache
      if (ent.name.startsWith(".")) continue;
      stack.push(path.join(cur, ent.name));
    }
  }

  // Devolver únicos por ruta de package.json
  const seen = new Set();
  return out.filter(({ file }) =>
    seen.has(file) ? false : (seen.add(file), true)
  );
}

function bumpVersion(v) {
  let m = v.match(/^(\d+)\.(\d+)\.(\d+)-(\d+)$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}-${Number(m[4]) + 1}`;

  m = v.match(/^(\d+)\.(\d+)\.(\d+)-([A-Za-z]+)\.(\d+)$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}-${m[4]}.${Number(m[5]) + 1}`;

  m = v.match(/^(\d+)\.(\d+)\.(\d+)-([A-Za-z]+)(\d+)$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}-${m[4]}${Number(m[5]) + 1}`;

  m = v.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (m) return `${m[1]}.${m[2]}.${Number(m[3]) + 1}`;

  throw new Error(`Versión no soportada: "${v}"`);
}

const isQuarkid = (name) =>
  typeof name === "string" && name.startsWith("@quarkid/");

function fromWorkspaceToSemver(oldSpec, newVersion) {
  if (typeof oldSpec !== "string") return newVersion;
  if (!oldSpec.startsWith("workspace:")) return null;
  const rest = oldSpec.slice("workspace:".length).trim();
  if (rest.startsWith("^")) return `^${newVersion}`;
  if (rest.startsWith("~")) return `~${newVersion}`;
  return `^${newVersion}`; // workspace:* o sin prefijo -> usamos ^ por defecto
}

function preserveRangePrefix(oldSpec, newVersion) {
  const ws = fromWorkspaceToSemver(oldSpec, newVersion);
  if (ws !== null) return ws;

  if (oldSpec.startsWith("file:") || oldSpec.startsWith("link:"))
    return oldSpec;

  const m = oldSpec.match(/^(\^|~|>=|<=|>|<|=)?\s*(.+)$/);
  const prefix = m?.[1] ?? "";
  return `${prefix}${newVersion}`;
}

async function main() {
  if (!(await exists(PACKAGES_DIR))) {
    console.error(`No existe la carpeta "${PACKAGES_DIR}".`);
    process.exit(1);
  }

  const targets = await walkPackages(PACKAGES_DIR);
  if (targets.length === 0) {
    console.error(`No se encontraron package.json dentro de "packages/".`);
    process.exit(1);
  }

  // Cargar y calcular nuevas versiones
  const pkgs = [];
  for (const t of targets) {
    const txt = await fs.readFile(t.file, "utf8");
    let json;
    try {
      json = JSON.parse(txt);
    } catch {
      continue;
    }
    if (!json.name || !json.version) continue;
    const newV = bumpVersion(json.version);
    pkgs.push({
      dir: t.dir,
      file: t.file,
      json,
      newVersion: newV,
      originalText: txt,
    });
  }

  // Mapa name -> newVersion (solo locales)
  const nameToNewVersion = new Map(
    pkgs.map((p) => [p.json.name, p.newVersion])
  );

  // DRY: listar rutas y conteo
  console.log("== Carpetas objetivo (packages/**) ==");
  pkgs
    .map((p) => path.relative(ROOT, p.dir))
    .sort((a, b) => a.localeCompare(b))
    .forEach((rel) => console.log("•", rel));
  console.log(`\nTotal paquetes locales encontrados: ${pkgs.length}\n`);

  // Plan de cambios
  console.log("== Plan de bump de versiones ==");
  for (const p of pkgs.sort((a, b) => a.json.name.localeCompare(b.json.name))) {
    console.log(`• ${p.json.name}: ${p.json.version}  ->  ${p.newVersion}`);
  }

  if (DRY) {
    console.log(
      "\n[DRY RUN] No se escribieron archivos. Ejecutá sin --dry para aplicar."
    );
    return;
  }

  // Aplicar cambios
  for (const p of pkgs) {
    const j = { ...p.json };

    // 1) version propia
    j.version = p.newVersion;

    // 2) actualizar deps internas @quarkid/* si existen localmente
    for (const field of DEP_FIELDS) {
      const deps = j[field];
      if (!deps) continue;
      for (const depName of Object.keys(deps)) {
        if (!isQuarkid(depName)) continue;
        const newDepVersion = nameToNewVersion.get(depName);
        if (!newDepVersion) continue; // no es paquete local
        const oldSpec = deps[depName];
        const nextSpec = preserveRangePrefix(oldSpec, newDepVersion);
        if (VERBOSE && oldSpec !== nextSpec) {
          console.log(
            `dep update: ${j.name} [${field}] ${depName}: ${oldSpec} => ${nextSpec}`
          );
        }
        deps[depName] = nextSpec;
      }
    }

    const out = JSON.stringify(j, null, 2) + "\n";
    await fs.writeFile(p.file, out, "utf8");
  }

  console.log(
    "\n✔ Listo. package.json actualizados (version + deps internas @quarkid/*)."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
