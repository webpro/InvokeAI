import { useAppDispatch } from 'app/store/storeHooks';
import { addToast } from 'features/system/store/systemSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause } from 'react-icons/fa';
import {
  useGetProcessorStatusQuery,
  usePauseProcessorMutation,
} from 'services/api/endpoints/queue';
import { useIsQueueMutationInProgress } from '../hooks/useIsQueueMutationInProgress';
import QueueButton from './common/QueueButton';

type Props = {
  asIconButton?: boolean;
};

const PauseProcessorButton = ({ asIconButton }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { data: processorStatus } = useGetProcessorStatusQuery();
  const [pauseProcessor] = usePauseProcessorMutation({
    fixedCacheKey: 'pauseProcessor',
  });
  const isQueueMutationInProgress = useIsQueueMutationInProgress();

  const handleClick = useCallback(async () => {
    try {
      await pauseProcessor().unwrap();
      dispatch(
        addToast({
          title: t('queue.pauseRequested'),
          status: 'info',
        })
      );
    } catch {
      dispatch(
        addToast({
          title: t('queue.pauseFailed'),
          status: 'error',
        })
      );
    }
  }, [dispatch, pauseProcessor, t]);

  return (
    <QueueButton
      asIconButton={asIconButton}
      label={t('queue.pause')}
      tooltip={t('queue.pauseTooltip')}
      isDisabled={!processorStatus?.is_started || isQueueMutationInProgress}
      isLoading={processorStatus?.is_stop_pending}
      icon={<FaPause />}
      onClick={handleClick}
      colorScheme="gold"
    />
  );
};

export default memo(PauseProcessorButton);
