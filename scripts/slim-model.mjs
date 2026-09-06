// Usage: node scripts/slim-model.mjs <in.glb> <out.glb> <ratio> [error]
// Requires: npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer
// Strips unused vertex attributes (tangents, UVs, vertex colours, flat
// normals), welds shared vertices, simplifies by target ratio, quantizes and
// meshopt-compresses. Normals are recomputed smooth at load time by the viewer.
// Every named node is kept so each structure stays individually selectable.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { simplify, weld, dedup, prune, quantize, meshopt } from "@gltf-transform/functions";
import { MeshoptSimplifier, MeshoptEncoder } from "meshoptimizer";
import { statSync } from "node:fs";

const [inPath, outPath, ratioArg, errorArg] = process.argv.slice(2);
const ratio = Number(ratioArg ?? 1);
const error = Number(errorArg ?? 0.001);
await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const doc = await io.read(inPath);
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    for (const name of ["TANGENT", "TEXCOORD_0", "TEXCOORD_1", "COLOR_0", "NORMAL"]) {
      if (prim.getAttribute(name)) prim.setAttribute(name, null);
    }
  }
}
for (const tex of doc.getRoot().listTextures()) tex.dispose();
for (const mat of doc.getRoot().listMaterials()) {
  mat.setBaseColorTexture(null); mat.setNormalTexture(null); mat.setMetallicRoughnessTexture(null); mat.setOcclusionTexture(null); mat.setEmissiveTexture(null);
}
const transforms = [dedup(), prune(), weld()];
if (ratio < 1) transforms.push(simplify({ simplifier: MeshoptSimplifier, ratio, error, lockBorder: false }));
transforms.push(quantize({ quantizePosition: 14, quantizeNormal: 10 }), meshopt({ encoder: MeshoptEncoder, level: "high" }));
await doc.transform(...transforms);
await io.write(outPath, doc);
let tris = 0;
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) tris += (p.getIndices()?.getCount() ?? 0) / 3;
console.log(`${outPath}: ${(statSync(outPath).size / 1024).toFixed(0)} KB, ${Math.round(tris)} tris, ${doc.getRoot().listNodes().filter(n => n.getMesh()).length} named nodes`);
