import {
  K8sResourceCommon,
  PageComponentProps,
} from '@openshift-console/dynamic-plugin-sdk';
import { ExpandableSection } from '@patternfly/react-core';

import * as React from 'react';
import { useState } from 'react';
import EditorWithStuff from '../POC/EditorWithStuff';

const KameletDiagram = ({
  ...props
}: PageComponentProps<K8sResourceCommon>) => {
  const [isScreenshotExpanded, setIsScreenshotExpanded] = useState<boolean>(true);
  console.log('Got props: ', props);
  return (
    <>
      <ExpandableSection isExpanded={isScreenshotExpanded} onToggle={setIsScreenshotExpanded} toggleText={'Screenshot'}>
        <EditorWithStuff />
      </ExpandableSection>
      <ExpandableSection toggleText={'Page Properties'}>
        <pre>{JSON.stringify(props, undefined, 2)}</pre>
      </ExpandableSection>
    </>
  );
};

export default KameletDiagram;
