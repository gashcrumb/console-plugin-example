import {
  K8sResourceCommon,
  PageComponentProps,
} from '@openshift-console/dynamic-plugin-sdk';

import React, { FC } from 'react';
import FullHeight from './FullHeight';

const KameletDiagramTab: FC<PageComponentProps<K8sResourceCommon>> = ({}) => {
  return (
    <FullHeight>
      <iframe
        style={{ width: '100%', height: '100%' }}
        src={'https://kaoto-default.apps-crc.testing'}
      />
    </FullHeight>
  );
};

export default KameletDiagramTab;
