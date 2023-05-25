import {
  K8sResourceCommon,
  PageComponentProps,
} from '@openshift-console/dynamic-plugin-sdk';
import { ExpandableSection } from '@patternfly/react-core';

import React, { FC } from 'react';
import { useState } from 'react';

const KameletDiagram: FC<PageComponentProps<K8sResourceCommon>> = ({
  ...props
}) => {
  const [isKaotoExpanded, setIsKaotoExpanded] = useState<boolean>(true);
  return (
    <>
      <ExpandableSection
        isExpanded={isKaotoExpanded}
        onToggle={setIsKaotoExpanded}
        toggleText={'Kaoto'}
      >
        <iframe
          style={{ width: '100%', height: '675px', marginTop: '-50px' }}
          src={'https://kaoto-default.apps-crc.testing'}
        />
      </ExpandableSection>
      <ExpandableSection toggleText={'Page Properties'}>
        <pre>{JSON.stringify(props, undefined, 2)}</pre>
      </ExpandableSection>
    </>
  );
};

export default KameletDiagram;
