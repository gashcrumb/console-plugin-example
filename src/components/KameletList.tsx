import {
  ExtensionK8sModel,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  RowFilter,
  RowProps,
  TableColumn,
  TableData,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import React, { FC } from 'react';
import { KAMELET_GROUP_VERSION_KIND } from '../constants';
import { CubesIcon } from '@patternfly/react-icons';

const columns: TableColumn<K8sResourceCommon>[] = [
  {
    title: 'Name',
    id: 'name',
  },
];

export const filters: RowFilter[] = [];

const KameletRow: FC<RowProps<K8sResourceCommon>> = ({
  obj,
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={KAMELET_GROUP_VERSION_KIND}
          name={obj.metadata!.name}
          namespace={obj.metadata!.namespace}
        />
      </TableData>
    </>
  );
};

type KameletListProps = {
  match: {};
  namespace?: string;
  model: ExtensionK8sModel;
  kind: string;
};

const KameletList: FC<KameletListProps> = ({ namespace, kind }) => {
  const watchRes = {
    kind,
    isList: true,
    isNamespaced: typeof namespace !== 'undefined',
    ...(typeof namespace === 'string' && { namespace }),
  } as any;
  const [kamelets, loaded, error] =
    useK8sWatchResource<K8sResourceCommon[]>(watchRes);
  const [data, filteredData, onFilterChange] = useListPageFilter(
    kamelets,
    filters,
  );
  if (!loaded) {
    return <></>;
  }
  if (loaded && error) {
    console.log('Error watching katmelets: ', error);
    throw error;
  }
  return (
    <>
      <ListPageHeader title={'Kamelets'}>
        {loaded && kamelets.length > 0 ? (
          <ListPageCreate groupVersionKind={kind}>
            Create Kamelet
          </ListPageCreate>
        ) : (
          <></>
        )}
      </ListPageHeader>
      <ListPageBody>
        {loaded && kamelets.length > 0 ? (
          <>
            <ListPageFilter
              data={data}
              loaded={loaded}
              rowFilters={filters}
              onFilterChange={onFilterChange}
            />
            <VirtualizedTable<K8sResourceCommon>
              data={filteredData}
              unfilteredData={data}
              loaded={loaded}
              loadError={error}
              columns={columns}
              Row={KameletRow}
            />
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No Kamelets Defined
            </Title>
            <EmptyStateBody>Some words here</EmptyStateBody>
            <br />
            <ListPageCreate groupVersionKind={kind}>
              Create Kamelet
            </ListPageCreate>
          </EmptyState>
        )}
      </ListPageBody>
    </>
  );
};

export default KameletList;
