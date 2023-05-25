#!/usr/bin/env bash

NAMESPACE=${NAMESPACE:="default"}
REGISTRY=${REGISTRY:="$(oc get route/default-route -n openshift-image-registry -o=jsonpath='{.spec.host}')/${NAMESPACE}"}

podman login --tls-verify=false -u unused -p `oc whoami -t` ${REGISTRY} && \
podman build -t ${REGISTRY}/console-plugin-example-git:latest . && \
podman push --tls-verify=false ${REGISTRY}/console-plugin-example-git:latest

helm upgrade -i console-plugin-example charts/openshift-console-plugin -n default --set plugin.image=image-registry.openshift-image-registry.svc:5000/${NAMESPACE}/console-plugin-example-git:latest
