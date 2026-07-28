/**
 * Pure Three.js scene helpers for Fetzgerät assembly (no WebGL required).
 * Location: src/components/engine3d/three/model-utils.ts
 * Hook exception ADR D4 — this file may import `three`.
 */
import { Object3D } from 'three';

/** Depth-first search for a named node (sockets are EMPTY nodes). */
export function findObjectByName(root: Object3D, name: string): Object3D | null {
  if (root.name === name) return root;
  for (const child of root.children) {
    const found = findObjectByName(child, name);
    if (found) return found;
  }
  return null;
}

/**
 * Clone a loaded GLTF scene for safe multi-mount / socket parenting.
 * `clone(true)` deep-copies hierarchy; materials stay shared (fine for MVP boxes).
 */
export function cloneSceneSafe(scene: Object3D): Object3D {
  const clone = scene.clone(true);
  clone.traverse((node) => {
    node.matrixAutoUpdate = true;
  });
  return clone;
}

/** Detach object from current parent without disposing. */
export function detachFromParent(object: Object3D): void {
  if (object.parent) {
    object.parent.remove(object);
  }
}

export interface SocketAttachResult {
  ok: boolean;
  socketName: string;
  /** Present when ok. */
  socket: Object3D | null;
}

/** Find socket under parent and attach `child` (replacing prior parenting). */
export function attachToSocket(
  parentRoot: Object3D,
  socketName: string,
  child: Object3D,
): SocketAttachResult {
  const socket = findObjectByName(parentRoot, socketName);
  if (!socket) {
    return { ok: false, socketName, socket: null };
  }
  detachFromParent(child);
  child.position.set(0, 0, 0);
  child.rotation.set(0, 0, 0);
  child.scale.set(1, 1, 1);
  socket.add(child);
  return { ok: true, socketName, socket };
}
