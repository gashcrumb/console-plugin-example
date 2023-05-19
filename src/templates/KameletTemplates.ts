export const defaultYamlTemplate = `
apiVersion: camel.apache.org/v1alpha1
kind: Kamelet
metadata:
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

`;
