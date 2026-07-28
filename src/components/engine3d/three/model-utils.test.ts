/**
 * Unit tests for engine3d model-utils (no WebGL).
 * Location: src/components/engine3d/three/model-utils.test.ts
 */
import { describe, expect, it } from 'vitest';
import { Object3D } from 'three';
import {
  attachToSocket,
  cloneSceneSafe,
  findObjectByName,
} from './model-utils';

function treeWithSocket(socketName: string): Object3D {
  const root = new Object3D();
  root.name = 'root';
  const socket = new Object3D();
  socket.name = socketName;
  root.add(socket);
  return root;
}

describe('findObjectByName', () => {
  it('finds nested socket by name', () => {
    const root = treeWithSocket('SOCKET_DRIVE');
    const found = findObjectByName(root, 'SOCKET_DRIVE');
    expect(found).not.toBeNull();
    expect(found!.name).toBe('SOCKET_DRIVE');
  });

  it('returns null when missing', () => {
    const root = treeWithSocket('SOCKET_DRIVE');
    expect(findObjectByName(root, 'SOCKET_OUTPUT')).toBeNull();
  });
});

describe('cloneSceneSafe', () => {
  it('deep-clones hierarchy with socket names', () => {
    const root = treeWithSocket('SOCKET_OUTPUT');
    const clone = cloneSceneSafe(root);
    expect(clone).not.toBe(root);
    expect(findObjectByName(clone, 'SOCKET_OUTPUT')).not.toBeNull();
    expect(findObjectByName(clone, 'SOCKET_OUTPUT')).not.toBe(
      findObjectByName(root, 'SOCKET_OUTPUT'),
    );
  });
});

describe('attachToSocket', () => {
  it('parents child under named socket', () => {
    const carrier = treeWithSocket('SOCKET_DRIVE');
    const drive = new Object3D();
    drive.name = 'drive';
    const result = attachToSocket(carrier, 'SOCKET_DRIVE', drive);
    expect(result.ok).toBe(true);
    expect(drive.parent?.name).toBe('SOCKET_DRIVE');
  });

  it('fails loudly when socket missing', () => {
    const carrier = treeWithSocket('SOCKET_DRIVE');
    const drive = new Object3D();
    const result = attachToSocket(carrier, 'SOCKET_OUTPUT', drive);
    expect(result.ok).toBe(false);
    expect(drive.parent).toBeNull();
  });
});
