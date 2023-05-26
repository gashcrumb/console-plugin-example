import {
  CreateResourceComponentProps,
  ResourceYAMLEditor,
  useK8sModel,
  k8sCreate,
} from '@openshift-console/dynamic-plugin-sdk';
import React, { FC, Suspense, useState } from 'react';
import { KAMELET_GROUP_VERSION_KIND, KAMELET_KIND } from '../constants';
import { safeLoad } from 'js-yaml';
import { Flex, Radio } from '@patternfly/react-core';

import './KameletCreatePage.css';
import FullHeight from './FullHeight';

export enum EditorType {
  Kaoto = 'kaoto',
  YAML = 'yaml',
}

const KameletCreatePage: FC<CreateResourceComponentProps> = ({ ...props }) => {
  const [editorType, setEditorType] = useState<EditorType>(EditorType.Kaoto);
  const [model, inFlight] = useK8sModel(KAMELET_GROUP_VERSION_KIND);
  if (inFlight) {
    return <></>;
  }
  return (
    <>
      <div className="co-synced-editor__editor-toggle">
        <Flex
          spaceItems={{ default: 'spaceItemsMd' }}
          alignItems={{ default: 'alignItemsCenter' }}
          role="radiogroup"
          aria-labelledby="radio-group-title-editor-toggle"
        >
          <label
            className="co-synced-editor__editor-toggle-label"
            id="radio-group-title-editor-toggle"
          >
            Configure via:
          </label>
          <Radio
            isChecked={editorType === EditorType.Kaoto}
            name={EditorType.Kaoto}
            onChange={() => setEditorType(EditorType.Kaoto)}
            label={'Diagram view'}
            id={EditorType.Kaoto}
            value={EditorType.Kaoto}
          />
          <Radio
            isChecked={editorType === EditorType.YAML}
            name={EditorType.YAML}
            onChange={() => setEditorType(EditorType.YAML)}
            label={'YAML view'}
            id={EditorType.YAML}
            value={EditorType.YAML}
            data-test={`${EditorType.YAML}-view-input`}
          />
        </Flex>
      </div>
      <FullHeight>
        {(() => {
          switch (editorType) {
            case EditorType.Kaoto:
              return (
                <iframe
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  src={'https://kaoto-default.apps-crc.testing'}
                />
              );
            case EditorType.YAML:
              return (
                <Suspense fallback={<>Please wait...</>}>
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
                </Suspense>
              );
            default:
              return <></>;
          }
        })()}
      </FullHeight>
    </>
  );
};

export default KameletCreatePage;
