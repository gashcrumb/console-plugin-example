import React, { FC } from 'react';
import { KameletResource } from 'src/constants';

type KameletDescriptionProps = {
  obj: KameletResource;
};

const KameletDescription: FC<KameletDescriptionProps> = ({ obj }) => {
  if (!obj.spec.definition) {
    return <></>;
  }
  return <>{obj.spec.definition.description}</>;
};

export default KameletDescription;
