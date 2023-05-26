import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import React, { FC } from 'react';
import KameletDescription from './KameletDescription';
import { KameletResource } from '../constants';
import {
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

type KameletDescriptionTabProps = {
  obj: K8sResourceCommon;
};

const KameletDescriptionTab: FC<KameletDescriptionTabProps> = ({ obj }) => (
  <PageSection variant={PageSectionVariants.light}>
    <Card
      className={'pf-u-min-width pf-u-w-33vw'}
      style={{ '--pf-u-min-width--MinWidth': '50ch' } as any}
    >
      <CardBody>
        <TextContent>
          <Text component={TextVariants.p}>
            <KameletDescription obj={obj as KameletResource} />
          </Text>
        </TextContent>
      </CardBody>
    </Card>
  </PageSection>
);

export default KameletDescriptionTab;
