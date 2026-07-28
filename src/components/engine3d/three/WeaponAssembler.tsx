/**
 * Assembles Träger → Antrieb (SOCKET_DRIVE) → Aufsatz (SOCKET_OUTPUT).
 * Location: src/components/engine3d/three/WeaponAssembler.tsx
 * ADR D4: R3F hooks allowed under engine3d/three/**
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Object3D } from 'three';
import type { EngineRecipe } from '../../../game/types/engineVisual';
import {
  lookupEnginePartAsset,
  type EnginePartAssetEntry,
} from '../../../services/engineAssets/partRegistry';
import { PartModel } from './PartModel';
import { attachToSocket, detachFromParent } from './model-utils';

const SOCKET_DRIVE = 'SOCKET_DRIVE';
const SOCKET_OUTPUT = 'SOCKET_OUTPUT';

export interface AssemblerIssue {
  assetId: string;
  message: string;
  /** German prod-safe copy */
  userMessage: string;
}

interface WeaponAssemblerProps {
  recipe: EngineRecipe;
  reducedMotion: boolean;
  onIssuesChange?: (issues: AssemblerIssue[]) => void;
}

type PartKey = 'carrier' | 'drive' | 'attachment';

function resolveEntry(id: string | undefined): EnginePartAssetEntry | null {
  if (!id) return null;
  return lookupEnginePartAsset(id);
}

export function WeaponAssembler({
  recipe,
  reducedMotion,
  onIssuesChange,
}: WeaponAssemblerProps) {
  const rootRef = useRef<Group>(null);
  const scenesRef = useRef<Partial<Record<PartKey, Object3D>>>({});
  const onIssuesRef = useRef(onIssuesChange);
  const [tick, setTick] = useState(0);
  const mountProgress = useRef(reducedMotion ? 1 : 0);

  onIssuesRef.current = onIssuesChange;

  const carrierEntry = resolveEntry(recipe.carrierId);
  const driveEntry = resolveEntry(recipe.driveId);
  const attachmentEntry = resolveEntry(recipe.attachmentId);

  const onCarrierReady = useCallback((scene: Object3D | null) => {
    if (scene) scenesRef.current.carrier = scene;
    else delete scenesRef.current.carrier;
    setTick((n) => n + 1);
  }, []);

  const onDriveReady = useCallback((scene: Object3D | null) => {
    if (scene) scenesRef.current.drive = scene;
    else delete scenesRef.current.drive;
    setTick((n) => n + 1);
  }, []);

  const onAttachmentReady = useCallback((scene: Object3D | null) => {
    if (scene) scenesRef.current.attachment = scene;
    else delete scenesRef.current.attachment;
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const issues: AssemblerIssue[] = [];
    const root = rootRef.current;
    const carrier = scenesRef.current.carrier;
    const drive = scenesRef.current.drive;
    const attachment = scenesRef.current.attachment;

    if (!root) return;

    while (root.children.length > 0) {
      root.remove(root.children[0]!);
    }

    if (!carrierEntry) {
      if (recipe.carrierId) {
        issues.push({
          assetId: recipe.carrierId,
          message: `No registry entry for carrier "${recipe.carrierId}"`,
          userMessage: 'Träger-Modell nicht gefunden.',
        });
      }
      onIssuesRef.current?.(issues);
      return;
    }

    if (!carrier) {
      onIssuesRef.current?.(issues);
      return;
    }

    detachFromParent(carrier);
    carrier.position.set(0, 0, 0);
    root.add(carrier);

    if (driveEntry && drive) {
      const driveAttach = attachToSocket(carrier, SOCKET_DRIVE, drive);
      if (!driveAttach.ok) {
        const issue: AssemblerIssue = {
          assetId: driveEntry.id,
          message: `Missing socket ${SOCKET_DRIVE} on carrier "${carrierEntry.id}" (drive "${driveEntry.id}")`,
          userMessage: 'Antrieb konnte nicht am Träger befestigt werden (Socket fehlt).',
        };
        issues.push(issue);
        if (import.meta.env.DEV) {
          console.error('[WeaponAssembler]', issue.message, { assetId: driveEntry.id });
        }
      } else if (attachmentEntry && attachment) {
        const tipAttach = attachToSocket(drive, SOCKET_OUTPUT, attachment);
        if (!tipAttach.ok) {
          const issue: AssemblerIssue = {
            assetId: attachmentEntry.id,
            message: `Missing socket ${SOCKET_OUTPUT} on drive "${driveEntry.id}" (attachment "${attachmentEntry.id}")`,
            userMessage: 'Aufsatz konnte nicht am Antrieb befestigt werden (Socket fehlt).',
          };
          issues.push(issue);
          if (import.meta.env.DEV) {
            console.error('[WeaponAssembler]', issue.message, {
              assetId: attachmentEntry.id,
            });
          }
        }
      }
    } else if (recipe.driveId && !driveEntry) {
      issues.push({
        assetId: recipe.driveId,
        message: `No registry entry for drive "${recipe.driveId}"`,
        userMessage: 'Antrieb-Modell nicht gefunden.',
      });
    }

    if (recipe.attachmentId && !attachmentEntry) {
      issues.push({
        assetId: recipe.attachmentId,
        message: `No registry entry for attachment "${recipe.attachmentId}"`,
        userMessage: 'Aufsatz-Modell nicht gefunden.',
      });
    }

    if (attachmentEntry && attachment && !driveEntry) {
      issues.push({
        assetId: attachmentEntry.id,
        message: `Attachment "${attachmentEntry.id}" skipped — no drive for ${SOCKET_OUTPUT}`,
        userMessage: 'Aufsatz braucht einen Antrieb zum Montieren.',
      });
    }

    onIssuesRef.current?.(issues);
  }, [
    tick,
    carrierEntry,
    driveEntry,
    attachmentEntry,
    recipe.carrierId,
    recipe.driveId,
    recipe.attachmentId,
  ]);

  useFrame((_, delta) => {
    const group = rootRef.current;
    if (!group) return;
    if (reducedMotion) {
      group.scale.setScalar(1);
      return;
    }
    if (mountProgress.current < 1) {
      mountProgress.current = Math.min(1, mountProgress.current + delta * 2.2);
      const t = mountProgress.current;
      const s = 1 - (1 - t) ** 3;
      group.scale.setScalar(0.15 + s * 0.85);
    }
  });

  useEffect(() => {
    mountProgress.current = reducedMotion ? 1 : 0;
  }, [recipe.carrierId, recipe.driveId, recipe.attachmentId, reducedMotion]);

  if (!carrierEntry) {
    return null;
  }

  return (
    <>
      <PartModel
        url={carrierEntry.modelUrl}
        assetId={carrierEntry.id}
        onReady={onCarrierReady}
      />
      {driveEntry ? (
        <PartModel
          url={driveEntry.modelUrl}
          assetId={driveEntry.id}
          onReady={onDriveReady}
        />
      ) : null}
      {attachmentEntry ? (
        <PartModel
          url={attachmentEntry.modelUrl}
          assetId={attachmentEntry.id}
          onReady={onAttachmentReady}
        />
      ) : null}
      <group ref={rootRef} scale={reducedMotion ? 1 : 0.15} />
    </>
  );
}
