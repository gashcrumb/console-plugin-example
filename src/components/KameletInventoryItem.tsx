import React, { FC } from 'react';
import {
  K8sResourceCommon,
  ResourceLink,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { KAMELET_GROUP_VERSION_KIND } from '../constants';

type KameletInventoryItemProps = {
  projectName?: string;
};

const KameletInventoryItem: FC<KameletInventoryItemProps> = ({
  projectName,
}) => {
  const watchRes = {
    kind: KAMELET_GROUP_VERSION_KIND,
    isList: true,
    isNamespaced: typeof projectName !== 'undefined',
    ...(typeof projectName === 'string' && { namespace: projectName }),
  } as any;
  const [kamelets, loaded, error] =
    useK8sWatchResource<K8sResourceCommon[]>(watchRes);
  if (loaded && error) {
    console.log('Error watching kamelets: ', error);
    return <></>;
  }
  const title = `${kamelets.length} Kamelets`;
  return loaded ? (
    <ResourceLink
      groupVersionKind={KAMELET_GROUP_VERSION_KIND}
      namespace={projectName}
      hideIcon
      displayName={title}
      title={title}
    />
  ) : (
    <></>
  );
};

export default KameletInventoryItem;
