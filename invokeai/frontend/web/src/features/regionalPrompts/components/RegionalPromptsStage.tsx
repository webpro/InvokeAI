import { chakra } from '@invoke-ai/ui-library';
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from 'app/store/storeHooks';
import { BrushPreview } from 'features/regionalPrompts/components/BrushPreview';
import { LineComponent } from 'features/regionalPrompts/components/LineComponent';
import { RectComponent } from 'features/regionalPrompts/components/RectComponent';
import {
  useMouseDown,
  useMouseEnter,
  useMouseLeave,
  useMouseMove,
  useMouseUp,
} from 'features/regionalPrompts/hooks/useMouseDown';
import { $stage, selectRegionalPromptsSlice } from 'features/regionalPrompts/store/regionalPromptsSlice';
import type Konva from 'konva';
import { memo, useCallback, useRef } from 'react';
import { Group, Layer, Stage } from 'react-konva';

const selectLayers = createSelector(selectRegionalPromptsSlice, (regionalPrompts) => regionalPrompts.layers);

const ChakraStage = chakra(Stage, {
  shouldForwardProp: (prop) => !['sx'].includes(prop),
});

const stageSx = {
  border: '1px solid green',
};

export const RegionalPromptsStage: React.FC = memo(() => {
  const layers = useAppSelector(selectLayers);
  const stageRef = useRef<Konva.Stage | null>(null);
  const onMouseDown = useMouseDown(stageRef);
  const onMouseUp = useMouseUp(stageRef);
  const onMouseMove = useMouseMove(stageRef);
  const onMouseEnter = useMouseEnter(stageRef);
  const onMouseLeave = useMouseLeave(stageRef);
  const stageRefCallback = useCallback((el: Konva.Stage) => {
    $stage.set(el);
    stageRef.current = el;
  }, []);

  return (
    <ChakraStage
      ref={stageRefCallback}
      width={512}
      height={512}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={-1}
      sx={stageSx}
    >
      <Layer>
        {layers.map((layer) => (
          <Group key={layer.id}>
            {layer.objects.map((obj) => {
              if (obj.kind === 'line') {
                return <LineComponent key={obj.id} line={obj} color={layer.color} />;
              }
              if (obj.kind === 'fillRect') {
                return <RectComponent key={obj.id} rect={obj} color={layer.color} />;
              }
            })}
          </Group>
        ))}
        <BrushPreview />
      </Layer>
    </ChakraStage>
  );
});

RegionalPromptsStage.displayName = 'RegionalPromptingEditor';
