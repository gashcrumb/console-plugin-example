import {
  ErrorBoundaryFallbackPage,
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
import KameletIcon from './KameletIcon';

const columns: TableColumn<K8sResourceCommon>[] = [
  {
    title: 'Name',
    id: 'name',
  },
  {
    title: 'Namespace',
    id: 'namespace',
  },
  {
    title: 'Created',
    id: 'created',
  },
];

const filters: RowFilter[] = [];

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
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind="Namespace" name={obj.metadata!.namespace} />
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {obj.metadata!.creationTimestamp}
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
    return (
      <ErrorBoundaryFallbackPage
        errorMessage={error}
        componentStack={''}
        stack={''}
        title={error}
      />
    );
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
            <EmptyStateIcon icon={KameletIcon} />
            <Title headingLevel="h4" size="lg">
              No Kamelets Defined
            </Title>
            <EmptyStateBody>
              Start building powerful integration flows by leveraging Kamelets,
              the reusable components that simplify and accelerate integration
              development.
            </EmptyStateBody>
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
