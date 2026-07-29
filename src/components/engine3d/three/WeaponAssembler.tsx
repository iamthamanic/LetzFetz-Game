/**
 * Assembles Träger → Antrieb (SOCKET_DRIVE) → Aufsatz (SOCKET_OUTPUT).
 * Location: src/components/engine3d/three/WeaponAssembler.tsx
 * ADR D4: R3F hooks allowed under engine3d/three/**
 * Montage: staggered dock via EngineAnimations (Brief §12).
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
import { shouldEnableEngineOutline } from './EngineMaterials';
import {
  advanceMontageProgress,
  resolveMontagePose,
} from './EngineAnimations';
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
  const assembledRef = useRef<{
    drive: Object3D | null;
    attachment: Object3D | null;
    hasDrive: boolean;
    hasAttachment: boolean;
  }>({
    drive: null,
    attachment: null,
    hasDrive: false,
    hasAttachment: false,
  });

  onIssuesRef.current = onIssuesChange;

  const carrierEntry = resolveEntry(recipe.carrierId);
  const driveEntry = resolveEntry(recipe.driveId);
  const attachmentEntry = resolveEntry(recipe.attachmentId);
  const outline = shouldEnableEngineOutline(reducedMotion);

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

    assembledRef.current = {
      drive: null,
      attachment: null,
      hasDrive: false,
      hasAttachment: false,
    };

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
    carrier.scale.set(1, 1, 1);
    root.add(carrier);

    let driveMounted: Object3D | null = null;
    let attachmentMounted: Object3D | null = null;

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
      } else {
        driveMounted = drive;
        if (attachmentEntry && attachment) {
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
          } else {
            attachmentMounted = attachment;
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

    assembledRef.current = {
      drive: driveMounted,
      attachment: attachmentMounted,
      hasDrive: driveMounted !== null,
      hasAttachment: attachmentMounted !== null,
    };

    // Apply initial pose immediately so first frame is not at socket origin mid-dock.
    const pose = resolveMontagePose(
      mountProgress.current,
      {
        hasDrive: driveMounted !== null,
        hasAttachment: attachmentMounted !== null,
      },
      reducedMotion,
    );
    root.scale.setScalar(pose.rootScale);
    if (driveMounted) {
      driveMounted.position.set(0, 0, pose.driveLocalZ);
      driveMounted.scale.setScalar(pose.driveScale);
    }
    if (attachmentMounted) {
      attachmentMounted.position.set(0, 0, pose.attachmentLocalZ);
      attachmentMounted.scale.setScalar(pose.attachmentScale);
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
    reducedMotion,
  ]);

  useFrame((_, delta) => {
    const group = rootRef.current;
    if (!group) return;

    const { drive, attachment, hasDrive, hasAttachment } = assembledRef.current;
    const parts = { hasDrive, hasAttachment };

    if (reducedMotion) {
      mountProgress.current = 1;
      const pose = resolveMontagePose(1, parts, true);
      group.scale.setScalar(pose.rootScale);
      if (drive) {
        drive.position.set(0, 0, 0);
        drive.scale.setScalar(1);
      }
      if (attachment) {
        attachment.position.set(0, 0, 0);
        attachment.scale.setScalar(1);
      }
      return;
    }

    if (mountProgress.current < 1) {
      mountProgress.current = advanceMontageProgress(mountProgress.current, delta);
    }

    const pose = resolveMontagePose(mountProgress.current, parts, false);
    group.scale.setScalar(pose.rootScale);
    if (drive) {
      drive.position.set(0, 0, pose.driveLocalZ);
      drive.scale.setScalar(pose.driveScale);
    }
    if (attachment) {
      attachment.position.set(0, 0, pose.attachmentLocalZ);
      attachment.scale.setScalar(pose.attachmentScale);
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
        outline={outline}
        onReady={onCarrierReady}
      />
      {driveEntry ? (
        <PartModel
          url={driveEntry.modelUrl}
          assetId={driveEntry.id}
          outline={outline}
          onReady={onDriveReady}
        />
      ) : null}
      {attachmentEntry ? (
        <PartModel
          url={attachmentEntry.modelUrl}
          assetId={attachmentEntry.id}
          outline={outline}
          onReady={onAttachmentReady}
        />
      ) : null}
      <group ref={rootRef} scale={reducedMotion ? 1 : 0.15} />
    </>
  );
}
