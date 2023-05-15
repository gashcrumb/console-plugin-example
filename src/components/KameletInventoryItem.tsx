import * as React from 'react';
import {
  K8sResourceCommon,
  ResourceLink,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';

export type KameletInventoryItemProps = {
  projectName: string;
};

export const KAMELET_GROUP_VERSION_KIND = {
  group: 'camel.apache.org',
  version: 'v1alpha1',
  kind: 'Kamelet',
} as const;

export default function KameletInventoryItem({
  projectName,
}: KameletInventoryItemProps) {
  const watchRes = {
    kind: KAMELET_GROUP_VERSION_KIND,
    isList: true,
    isNamespaced: true,
    namespace: projectName,
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
}
