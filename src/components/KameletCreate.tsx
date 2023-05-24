import {
  CreateResourceComponentProps,
  ResourceYAMLEditor,
  useK8sModel,
  k8sCreate,
} from '@openshift-console/dynamic-plugin-sdk';
import React, { FC, useState } from 'react';
import { KAMELET_GROUP_VERSION_KIND, KAMELET_KIND } from '../constants';
import { safeLoad } from 'js-yaml';
import { ExpandableSection } from '@patternfly/react-core';
import { EmptyEditor } from '../POC/EmptyEditor';
import './KameletCreate.css';

const KameletCreate: FC<CreateResourceComponentProps> = ({ ...props }) => {
  const [isScreenshotExpanded, setIsScreenshotExpanded] =
    useState<boolean>(true);
  const [model, inFlight] = useK8sModel(KAMELET_GROUP_VERSION_KIND);
  if (inFlight) {
    return <></>;
  }
  return (
    <>
      <ExpandableSection
        isExpanded={isScreenshotExpanded}
        onToggle={setIsScreenshotExpanded}
        toggleText={'Screenshot'}
      >
        <EmptyEditor />
      </ExpandableSection>
      <ExpandableSection toggleText={'Text Editor'}>
        <React.Suspense fallback={<>Please wait...</>}>
            <ResourceYAMLEditor
              initialResource={`        
apiVersion: camel.apache.org/v1alpha1
kind: Kamelet
metadata:
  name: example
  namespace: ${props.namespace ? props.namespace : 'default'}
spec:
  definition:
    properties:
      message:
        description: The message to generate
        title: Message
        type: string
      period:
        default: 1000
        description: The time interval between two events
        title: Period
        type: integer
    required:
      - message
    description: Produces periodic events with a custom payload
    title: Example Timer
  template:
    from:
      parameters:
        period: '#property:period'
      steps:
        - set-body:
            constant: '#property:message'
        - to: 'kamelet:sink'
      uri: 'timer:tick'
`}
              header={'Make a Kamelet'}
              onSave={async (content: string) => {
                const data = safeLoad(content) as any;
                await k8sCreate({
                  model,
                  data: data as object,
                });
                //TODO - figure out router access
                window.location.href = `/ns/${
                  data.metadata!.namespace
                }/${KAMELET_KIND}/${data.metadata!.name}`;
              }}
            />
        </React.Suspense>
      </ExpandableSection>
      <ExpandableSection toggleText={'Page Properties'}>
        <pre>{JSON.stringify(props, undefined, 2)}</pre>
      </ExpandableSection>
      <ExpandableSection toggleText={'Object model'}>
        <pre>{JSON.stringify(model, undefined, 2)}</pre>
      </ExpandableSection>
    </>
  );
};

export default KameletCreate;
