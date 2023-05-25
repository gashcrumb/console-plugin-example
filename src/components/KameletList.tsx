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
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import React, { FC } from 'react';
import { KAMELET_GROUP_VERSION_KIND, KAMELET_KIND } from '../constants';

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

type KameletEmptyStateProps = {
  namespace?: string;
};
const KameletEmptyState: FC<KameletEmptyStateProps> = ({ namespace }) => {
  return (
    <>
      <ListPageHeader title={'Kamelets'} />
      <ListPageBody>
        <EmptyState>
          <EmptyStateIcon
            icon={() => (
              <img
                height={64}
                width={64}
                src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTMwLjIxIDEzMC4wMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIzMzMuNDgiIHgyPSI0NzciIHkxPSI3MDIuNiIgeTI9IjU2My43MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg5NC4wMzggMjc2LjA2KSBzY2FsZSguOTkyMDYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0Y2OTkyMyIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0Y3OUEyMyIgb2Zmc2V0PSIuMTEiLz48c3RvcCBzdG9wLWNvbG9yPSIjRTk3ODI2IiBvZmZzZXQ9Ii45NDUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjMzMy40OCIgeDI9IjQ3NyIgeTE9IjcwMi42IiB5Mj0iNTYzLjczIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDk0LjAzOCAyNzYuMDYpIHNjYWxlKC45OTIwNikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRjY5OTIzIiBvZmZzZXQ9IjAiLz48c3RvcCBzdG9wLWNvbG9yPSIjRjc5QTIzIiBvZmZzZXQ9Ii4wOCIvPjxzdG9wIHN0b3AtY29sb3I9IiNFOTc4MjYiIG9mZnNldD0iLjQxOSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iNjMzLjU1IiB4Mj0iNTY2LjQ3IiB5MT0iODE0LjYiIHkyPSI5MDkuMTIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTg1LjQyMSA1Ni4yMzYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2Y2ZTQyMyIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0Y3OUEyMyIgb2Zmc2V0PSIuNDEyIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0U5NzgyNiIgb2Zmc2V0PSIuNzMzIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQzNy44OSAtODM1LjI5KSI+PGNpcmNsZSBjeD0iNTAzLjEiIGN5PSI5MDAuMjkiIHI9IjYyLjUyIiBmaWxsPSJ1cmwoI2EpIiBzdHJva2U9InVybCgjYikiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iNC45NiIvPjxwYXRoIGQ9Ik00ODcuODkgODczLjY0YTg5LjUzIDg5LjUzIDAgMCAwLTIuNjg4LjAzMWMtMS4wNDMuMDMxLTIuNDQ1LjM2Mi00LjA2Mi45MDYgMjcuMzA5IDIwLjczNyAzNy4xMjcgNTguMTQ2IDIwLjI1IDkwLjY1Ni41NzMuMDE1IDEuMTQyLjA2MyAxLjcxOS4wNjMgMzAuODQ0IDAgNTYuNjItMjEuNDkzIDYzLjI4LTUwLjMxMi0xOS41NzItMjIuOTQzLTQ2LjExNy00MS4yOTQtNzguNS00MS4zNDR6IiBmaWxsPSJ1cmwoI2MpIiBvcGFjaXR5PSIuNzUiLz48cGF0aCBkPSJNNDgxLjE0IDg3NC41OGMtOS4wNjggMy4wNTItMjYuMzY4IDEzLjgwMi00MyAyOC4xNTYgMS4yNjMgMzQuMTk1IDI4Ljk2MSA2MS42MDcgNjMuMjUgNjIuNSAxNi44NzctMzIuNTEgNy4wNi02OS45MTktMjAuMjUtOTAuNjU2eiIgZmlsbD0iIzI4MTcwYiIgb3BhY2l0eT0iLjc1Ii8+PHBhdGggZD0iTTUwNC44ODkgODYyLjU0NmMtLjQ3Mi0uMDMyLS45MzIuMDI4LTEuMzc1LjI1LTUuNiAyLjgwMSAwIDE0IDAgMTQtMTYuODA3IDE0LjAwOS0xMy4yMzYgMzcuOTM4LTMyLjg0NCAzNy45MzgtMTAuNjg5IDAtMjEuMzIyLTEyLjI5My0zMi41MzEtMTkuODEyLS4xNDQgMS43NzMtLjI1IDMuNTY0LS4yNSA1LjM3NSAwIDI0LjUxNSAxMy41MSA0NS44NjMgMzMuNDY5IDU3LjA2MyA1LjU4My0uNzAzIDExLjE1OC0yLjExNCAxNS4zNDQtNC45MDYgMjEuOTkyLTE0LjY2MiAyNy40NTItNDIuNTU3IDM2LjQzOC01Ni4wMzEgNS41OTYtOC40MDcgMzEuODI0LTcuNjc3IDMzLjU5NC0xMS4yMiAyLjgwNC01LjYwMS01LjYwMi0xNC04LjQwNi0xNGgtMjIuNDA2Yy0xLjU2NiAwLTQuMDI1LTIuNzgtNS41OTQtMi43OGgtOC40MDZzLTMuNzI1LTUuNjUtNy4wMzEtNS44NzV6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==
"
              />
            )}
          />
          <Title headingLevel={'h4'} size={'lg'}>
            No Kamelets Defined
          </Title>
          <EmptyStateBody>
            Start building powerful integration flows by leveraging Kamelets,
            the reusable components that simplify and accelerate integration
            development.
          </EmptyStateBody>
          <Button
            component={'a'}
            href={`${
              namespace ? '/k8s/ns/' + namespace : '/k8s/cluster'
            }/${KAMELET_KIND}/~new`}
            variant={ButtonVariant.primary}
          >
            Create Kamelet
          </Button>
        </EmptyState>
      </ListPageBody>
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
  if (loaded && kamelets.length === 0) {
    return <KameletEmptyState namespace={namespace} />;
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

export default KameletList;
