/**
 * Sprint 2 — generate lightweight original GLBs for the hero scene.
 * Run: node scripts/generate-hero-glbs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Blob } from "node:buffer";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

globalThis.Blob = Blob;
globalThis.FileReader = class FileReader {
  result = null;
  onload = null;
  onerror = null;
  onloadend = null;
  readyState = 0;
  EMPTY = 0;
  LOADING = 1;
  DONE = 2;
  readAsArrayBuffer(blob) {
    this.readyState = 1;
    Promise.resolve()
      .then(() => blob.arrayBuffer())
      .then((buf) => {
        this.readyState = 2;
        this.result = buf;
        const ev = { target: this };
        this.onload?.(ev);
        this.onloadend?.(ev);
      })
      .catch((err) => {
        this.readyState = 2;
        this.onerror?.(err);
        this.onloadend?.({ target: this });
      });
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDirs = [
  path.join(__dirname, "..", "public", "assets", "3d"),
  path.join(__dirname, "..", "assets", "3d"),
];

function yarnMat(hex, rough = 0.88) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: rough,
    metalness: 0.04,
  });
}

function buildCharacter() {
  const root = new THREE.Group();
  root.name = "Character";

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), yarnMat(0xc62828));
  body.name = "Body";
  body.position.y = 0.15;
  root.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 28), yarnMat(0xc62828));
  head.name = "Head";
  head.position.y = 0.62;
  root.add(head);

  const eyes = new THREE.Group();
  eyes.name = "Eyes";
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfff9f5, roughness: 0.45 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x30231f, roughness: 0.5 });
  for (const [name, x] of [
    ["EyeLeft", -0.1],
    ["EyeRight", 0.1],
  ]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), eyeMat);
    eye.name = name;
    eye.position.set(x, 0.64, 0.22);
    eyes.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), pupilMat);
    pupil.position.set(x, 0.64, 0.29);
    eyes.add(pupil);
  }
  root.add(eyes);

  const details = new THREE.Group();
  details.name = "Details";
  const blue = yarnMat(0x1565c0);
  const patch = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), blue);
  patch.position.set(0, -0.05, 0.3);
  details.add(patch);
  for (const x of [-0.34, 0.34]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.16, 4, 8), blue);
    arm.position.set(x, 0.12, 0);
    arm.rotation.z = x < 0 ? 0.45 : -0.45;
    details.add(arm);
  }
  root.add(details);

  const yarnAttach = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8),
    yarnMat(0xe98f98, 0.95)
  );
  yarnAttach.name = "YarnAttachment";
  yarnAttach.position.y = 0.95;
  root.add(yarnAttach);

  root.updateMatrixWorld(true);
  return root;
}

function buildHook() {
  const root = new THREE.Group();
  root.name = "Hook";

  const handle = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.045, 0.42, 6, 12),
    new THREE.MeshStandardMaterial({ color: 0xe98f98, roughness: 0.45, metalness: 0.08 })
  );
  handle.name = "Handle";
  handle.position.y = 0.1;
  root.add(handle);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.014, 0.28, 12),
    new THREE.MeshStandardMaterial({ color: 0xc0c4c8, roughness: 0.22, metalness: 0.85 })
  );
  shaft.name = "Shaft";
  shaft.position.y = -0.28;
  root.add(shaft);

  const tip = new THREE.Mesh(
    new THREE.TorusGeometry(0.055, 0.014, 10, 24, Math.PI * 1.35),
    new THREE.MeshStandardMaterial({ color: 0xd0d4d8, roughness: 0.2, metalness: 0.9 })
  );
  tip.name = "Tip";
  tip.position.set(0.03, -0.44, 0);
  tip.rotation.z = 0.7;
  root.add(tip);

  root.updateMatrixWorld(true);
  return root;
}

function exportGlb(object, filePath) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      object,
      (result) => {
        try {
          const buffer = Buffer.from(result);
          fs.writeFileSync(filePath, buffer);
          resolve(buffer.length);
        } catch (e) {
          reject(e);
        }
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

async function main() {
  for (const dir of outDirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const charPath = path.join(outDirs[0], "hero-character.glb");
  const hookPath = path.join(outDirs[0], "crochet-hook.glb");

  const charBytes = await exportGlb(buildCharacter(), charPath);
  const hookBytes = await exportGlb(buildHook(), hookPath);

  fs.copyFileSync(charPath, path.join(outDirs[1], "hero-character.glb"));
  fs.copyFileSync(hookPath, path.join(outDirs[1], "crochet-hook.glb"));

  console.log(`Wrote hero-character.glb (${charBytes} bytes)`);
  console.log(`Wrote crochet-hook.glb (${hookBytes} bytes)`);
  console.log("Mirrored to assets/3d and public/assets/3d");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
