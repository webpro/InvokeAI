import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from 'app/store/storeHooks';
import { selectRegionalPromptsSlice } from 'features/regionalPrompts/store/regionalPromptsSlice';
import { useMemo } from 'react';
import { assert } from 'tsafe';

export const useLayer = (layerId: string) => {
  const selectLayer = useMemo(
    () =>
      createSelector(selectRegionalPromptsSlice, (regionalPrompts) =>
        regionalPrompts.layers.find((l) => l.id === layerId)
      ),
    [layerId]
  );
  const layer = useAppSelector(selectLayer);
  assert(layer !== undefined, `Layer ${layerId} doesn't exist!`);
  return layer;
};

export const useLayerPrompt = (layerId: string) => {
  const selectLayer = useMemo(
    () =>
      createSelector(
        selectRegionalPromptsSlice,
        (regionalPrompts) => regionalPrompts.layers.find((l) => l.id === layerId)?.prompt
      ),
    [layerId]
  );
  const prompt = useAppSelector(selectLayer);
  assert(prompt !== undefined, `Layer ${layerId} doesn't exist!`);
  return prompt;
};

export const useLayerIsVisible = (layerId: string) => {
  const selectLayer = useMemo(
    () =>
      createSelector(
        selectRegionalPromptsSlice,
        (regionalPrompts) => regionalPrompts.layers.find((l) => l.id === layerId)?.isVisible
      ),
    [layerId]
  );
  const isVisible = useAppSelector(selectLayer);
  assert(isVisible !== undefined, `Layer ${layerId} doesn't exist!`);
  return isVisible;
};
