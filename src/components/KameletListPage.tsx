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
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';

import React, { FC } from 'react';
import {
  KAMELET_GROUP_VERSION_KIND,
  KAMELET_KIND,
  KameletResource,
} from '../constants';
import KameletDescription from './KameletDescription';
import CamelIcon from './CamelIcon';

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
    title: 'Description',
    id: 'description',
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
        <KameletDescription obj={obj as KameletResource} />
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata!.creationTimestamp!} />
      </TableData>
    </>
  );
};

type KameletTableProps = {
  kamelets: K8sResourceCommon[];
  kind: string;
  loaded: boolean;
  error: any;
};
const KameletTable: FC<KameletTableProps> = ({
  kamelets,
  kind,
  loaded,
  error,
}) => {
  const [data, filteredData, onFilterChange] = useListPageFilter(
    kamelets,
    filters,
  );
  return (
    <>
      <ListPageHeader title={'Kamelets'}>
        <ListPageCreate groupVersionKind={kind}>Create Kamelet</ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
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
      </ListPageBody>
    </>
  );
};

const KameletEmptyState: FC = () => (
  <>
    <div className="pf-c-empty-state">
      <div className="pf-c-empty-state__content">
        <i className="pf-c-empty-state__icon" aria-hidden="true">
          <CamelIcon size={'xl'} />
        </i>
        <h1 className="pf-c-title pf-m-lg">No Kamelets Defined</h1>
        <div className="pf-c-empty-state__body">
          Start building powerful integration flows by leveraging Kamelets, the
          reusable components that simplify and accelerate integration
          development.
        </div>
        <br />
        <ListPageCreate groupVersionKind={KAMELET_KIND}>
          Create Kamelet
        </ListPageCreate>
      </div>
    </div>
  </>
);

type KameletListPageProps = {
  match: {};
  namespace?: string;
  model: ExtensionK8sModel;
  kind: string;
};
const KameletListPage: FC<KameletListPageProps> = ({ namespace, kind }) => {
  const watchRes = {
    kind,
    isList: true,
    isNamespaced: typeof namespace !== 'undefined',
    ...(typeof namespace === 'string' && { namespace }),
  } as any;
  const [kamelets, loaded, error] =
    useK8sWatchResource<K8sResourceCommon[]>(watchRes);
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
  if (loaded && (!kamelets || kamelets.length === 0)) {
    return <KameletEmptyState />;
  }
  return (
    <KameletTable
      kamelets={kamelets}
      kind={kind}
      loaded={loaded}
      error={error}
    />
  );
};

export default KameletListPage;
