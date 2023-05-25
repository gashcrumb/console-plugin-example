export const KAMELET_GROUP_VERSION_KIND = {
  group: 'camel.apache.org',
  version: 'v1alpha1',
  kind: 'Kamelet',
} as const;

export const KAMELET_KIND = `${KAMELET_GROUP_VERSION_KIND.group}~${KAMELET_GROUP_VERSION_KIND.version}~${KAMELET_GROUP_VERSION_KIND.kind}`;

console.log(
  'Package name: ',
  __NAME__,
  'version: ',
  __VERSION__,
  ', built at ',
  __TIMESTAMP__,
  ' with commit ID ',
  __COMMIT_HASH__
)
